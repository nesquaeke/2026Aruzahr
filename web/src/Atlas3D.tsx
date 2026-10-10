import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'
import { MapControls } from 'three/addons/controls/MapControls.js'
import { Compass, Layers3, LoaderCircle, Mountain, RotateCcw, Snowflake, Trees, Waves, X } from 'lucide-react'
import type { AtlasHandle, AtlasProps } from './Atlas'
import { locationById, normalize, placeById, regions, regionById, subregionById } from './data'
import { featureById, featureLabels } from './map-features'
import { coldAt, DANSTSUD_VIEW, heightAt, inDanstsudView, mapPoint, reliefTargets, signatures, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import { buildReliefWorld, disposeWorld } from './relief-scene'

type Runtime = { home: () => void; zoom: (factor: number) => void; tilt: (flat: boolean) => void; north: () => void; refresh: (focus?: boolean) => void }
type Props = AtlasProps & { onUnavailable: () => void; onExit: () => void }
const cameraKey = 'aruzahr-danstsud-3d-camera-v3'
const allEntries = [...regions.filter(region=>region.id==='danstsud'), ...reliefTargets]

export default forwardRef<AtlasHandle, Props>(function Atlas3D(props,ref) {
  const host=useRef<HTMLDivElement>(null),pins=useRef<HTMLDivElement>(null),tooltip=useRef<HTMLDivElement>(null)
  const latest=useRef(props),runtime=useRef<Runtime|null>(null),previousSelected=useRef(props.selected)
  const [ready,setReady]=useState(false),[flat,setFlat]=useState(false),[forest,setForest]=useState(true),[water,setWater]=useState(true),[winter,setWinter]=useState(false),[weatherLabel,setWeatherLabel]=useState('')
  const layers=useRef({forest,water,winter});layers.current={forest,water,winter};latest.current=props
  useImperativeHandle(ref,()=>({home:()=>runtime.current?.home(),zoom:factor=>runtime.current?.zoom(factor)}),[])

  useEffect(()=>{
    const element=host.current,overlay=pins.current
    if(!element||!overlay)return
    let disposed=false,unavailable=false,frame=0,saveTimer=0,lastRender=0,lastTick=performance.now(),dirty=true,project=true
    let lastWeather=''
    const mobile=element.clientWidth<620
    let renderer:THREE.WebGLRenderer
    try {
      renderer=new THREE.WebGLRenderer({antialias:!mobile,alpha:false,powerPreference:'default'})
    } catch {latest.current.onUnavailable();return}
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.25:1.7))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.96
    renderer.shadowMap.enabled=!mobile;renderer.shadowMap.type=THREE.PCFSoftShadowMap
    const canvas=renderer.domElement;canvas.tabIndex=0
    canvas.setAttribute('aria-label','Danstsud 3D haritası. Sürükleyerek taşı, tekerlekle yakınlaştır, sağ sürükleyerek eğ. Ok tuşları haritayı taşır.')
    element.append(canvas)
    element.dataset.ready='false';element.dataset.source='rebuilt-geography';element.dataset.scope='danstsud';element.dataset.quality=mobile?'mobile':'desktop'
    const scene=new THREE.Scene();scene.background=new THREE.Color('#101925')
    const camera=new THREE.OrthographicCamera(-60,60,42,-42,.1,380)
    camera.position.set(0,92,78)
    const controls=new MapControls(camera,canvas)
    controls.enableDamping=!latest.current.reducedMotion;controls.dampingFactor=.12
    controls.minZoom=.8;controls.maxZoom=14;controls.minPolarAngle=.06;controls.maxPolarAngle=1.12
    controls.screenSpacePanning=false;controls.zoomSpeed=.92
    controls.target.set(0,0,0);controls.update()
    scene.add(new THREE.HemisphereLight('#edf1e4','#625440',1.2))
    const sun=new THREE.DirectionalLight('#ffe7be',2.0);sun.position.set(-28,65,25)
    sun.castShadow=!mobile;sun.shadow.mapSize.set(2048,2048);sun.shadow.normalBias=.055;sun.shadow.bias=-.00018
    sun.shadow.camera.near=1;sun.shadow.camera.far=140;scene.add(sun,sun.target)
    let world:ReturnType<typeof buildReliefWorld>|null=null,baseHeight=WORLD_DEPTH*.9
    const markerMap=new Map<string,HTMLButtonElement>(),markerVectors=new Map<string,THREE.Vector3>()
    const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster()
    let down={x:0,y:0},hovered=''
    let tween:{target:THREE.Vector3;zoom:number;eye?:THREE.Vector3}|null=null

    function fail(){if(!disposed&&!unavailable){unavailable=true;latest.current.onUnavailable()}}
    function schedule(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick)}
    function remember(){
      // Loading/resize events must not replace a saved or requested view with
      // the temporary world camera before terrain is available.
      if(!world)return
      try{sessionStorage.setItem(cameraKey,JSON.stringify({selected:latest.current.selected,target:controls.target.toArray(),position:camera.position.toArray(),zoom:camera.zoom}))}catch{/* Optional camera storage. */}
    }
    function changed(){dirty=true;project=true;window.clearTimeout(saveTimer);saveTimer=window.setTimeout(remember,250);schedule()}
    function finishTween(){
      if(!tween)return
      const offset=camera.position.clone().sub(controls.target)
      controls.target.copy(tween.target);camera.position.copy(tween.target).add(tween.eye||offset)
      camera.zoom=tween.zoom;camera.updateProjectionMatrix();tween=null;controls.update();changed()
    }
    function moveTo(target:THREE.Vector3,zoom:number,eye?:THREE.Vector3){
      tween={target,zoom:THREE.MathUtils.clamp(zoom,.8,14),eye}
      if(latest.current.reducedMotion)finishTween();else schedule()
    }
    function home(){
      const zoom=Math.min((camera.right-camera.left)/(DANSTSUD_VIEW.width*1.12),baseHeight/(DANSTSUD_VIEW.depth*.85+5))
      moveTo(new THREE.Vector3(...worldPoint(DANSTSUD_VIEW.point)),Math.max(.8,zoom),new THREE.Vector3(0,104,64));setFlat(false)
    }
    function focusSelected(){
      const selected=latest.current.selected
      if(!selected){home();return}
      const entry=regionById(selected)||locationById(selected)||featureById(selected)
      if(!entry)return
      const point=entry.point;if(!point)return
      const box=regionById(selected)?.box||subregionById(selected)?.box||featureById(selected)?.box
      const target=new THREE.Vector3(...worldPoint(point,heightAt(point)))
      const width=box?box[2]*WORLD_WIDTH:WORLD_WIDTH*.09
      const depth=box?box[3]*WORLD_DEPTH:WORLD_DEPTH*.075
      const zoom=Math.min((camera.right-camera.left)/(width*1.25),baseHeight/(depth*.9+5))
      moveTo(target,Math.max(1.2,Math.min(box?7.8:8.5,zoom)))
    }
    function north(){const eye=camera.position.clone().sub(controls.target);moveTo(controls.target.clone(),camera.zoom,new THREE.Vector3(0,eye.y,Math.hypot(eye.x,eye.z)));setFlat(eye.y/eye.length()>.98)}
    function tilt(top:boolean){const r=camera.position.distanceTo(controls.target),angle=top?.065:.56;moveTo(controls.target.clone(),camera.zoom,new THREE.Vector3(0,r*Math.cos(angle),r*Math.sin(angle)));setFlat(top)}

    function resize(){
      if(disposed)return
      const width=element!.clientWidth,height=element!.clientHeight
      if(!width||!height)return
      const aspect=width/height
      baseHeight=Math.max(WORLD_WIDTH/aspect,WORLD_DEPTH*.79)*1.1
      camera.left=-baseHeight*aspect/2;camera.right=baseHeight*aspect/2;camera.top=baseHeight/2;camera.bottom=-baseHeight/2
      camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true;project=true;schedule()
    }
    const observer=new ResizeObserver(resize);observer.observe(element)
    const changeHandler=()=>changed(),startHandler=()=>{tween=null}
    controls.addEventListener('change',changeHandler);controls.addEventListener('start',startHandler)
    function visibility(){element!.dataset.animation=document.hidden?'paused':latest.current.reducedMotion?'reduced':'active';if(document.hidden){cancelAnimationFrame(frame);frame=0}else{lastTick=performance.now();changed()}}
    document.addEventListener('visibilitychange',visibility)
    function contextLost(event:Event){event.preventDefault();fail()}
    canvas.addEventListener('webglcontextlost',contextLost)
    function keyboard(event:KeyboardEvent){
      const directions:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}
      const direction=directions[event.key];if(!direction)return
      event.preventDefault();tween=null
      const distance=2.5/camera.zoom
      const delta=new THREE.Vector3(direction[0]*distance,0,direction[1]*distance)
      controls.target.add(delta);camera.position.add(delta);controls.update();changed()
    }
    canvas.addEventListener('keydown',keyboard)
    function hit(event:PointerEvent){
      if(!world)return null
      const rect=canvas.getBoundingClientRect()
      pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1)
      raycaster.setFromCamera(pointer,camera)
      const candidates=[...world.cities,...world.monuments].filter(group=>group.visible)
      const intersections=raycaster.intersectObjects(candidates,true)
      return intersections.find(item=>typeof item.object.userData.targetId==='string')||null
    }
    function pointerDown(event:PointerEvent){down={x:event.clientX,y:event.clientY};if(event.button===0)canvas.focus({preventScroll:true})}
    function pointerUp(event:PointerEvent){if(event.button!==0||Math.hypot(event.clientX-down.x,event.clientY-down.y)>5)return;const target=hit(event)?.object.userData.targetId;if(target)latest.current.onSelect(target)}
    let hoverTime=0
    function pointerMove(event:PointerEvent){
      if(event.buttons||performance.now()-hoverTime<80)return
      hoverTime=performance.now();const target=hit(event)?.object.userData.targetId||''
      canvas.style.cursor=target?'pointer':'grab'
      if(target!==hovered){hovered=target;const place=placeById(target),feature=featureById(target);if(tooltip.current){tooltip.current.textContent=place?.name||feature?.name||'';tooltip.current.hidden=!target}}
      if(tooltip.current&&target){const rect=element!.getBoundingClientRect();tooltip.current.style.left=`${Math.min(event.clientX-rect.left+16,rect.width-140)}px`;tooltip.current.style.top=`${Math.max(12,event.clientY-rect.top-34)}px`}
    }
    function pointerLeave(){hovered='';if(tooltip.current)tooltip.current.hidden=true}
    canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerleave',pointerLeave)

    function makeMarkers(){
      for(const entry of allEntries){
        const feature=featureById(entry.id),region='box' in entry&&regions.some(value=>value.id===entry.id),subregion='kind'in entry&&entry.kind==='subregion'
        const name='mapLabel'in entry&&entry.mapLabel?entry.mapLabel:entry.name
        const button=document.createElement('button');button.type='button';button.className=`map-pin ${feature?`feature-pin ${feature.kind}-pin`:region?'region-pin':`city-pin${subregion?' subregion-pin':''}`}`
        button.dataset.testid=`marker-${entry.id}`;button.dataset.targetId=entry.id
        button.setAttribute('aria-label',`${name} ${feature?featureLabels[feature.kind].toLocaleLowerCase('tr'):region?'bölgesini':'yerleşimini'} keşfet`)
        button.title=signatureTitle(entry.id)||name
        const symbol=document.createElement('span');symbol.className='pin-symbol';symbol.textContent=feature?['mountain','ridge'].includes(feature.kind)?'▲':feature.kind==='route'?'⌁':feature.kind==='landmark'?'⌑':'≈':region?'✧':'◆'
        const label=document.createElement('span');label.className='pin-label';label.textContent=name
        button.append(symbol,label);button.addEventListener('click',()=>latest.current.onSelect(entry.id));overlay!.append(button)
        markerMap.set(entry.id,button);markerVectors.set(entry.id,new THREE.Vector3(...worldPoint(entry.point,heightAt(entry.point)+.12)))
      }
    }
    function signatureTitle(id:string){return signatures[id]?.label}
    function projectMarkers(){
      const p=latest.current,width=element!.clientWidth,height=element!.clientHeight,needle=normalize(p.query)
      const route=featureById(p.selected||'')?.kind==='route'?featureById(p.selected!):undefined
      const candidates:{id:string;button:HTMLButtonElement;x:number;y:number;priority:number}[]=[]
      for(const entry of allEntries){
        const button=markerMap.get(entry.id)!,pos=markerVectors.get(entry.id)!.clone().project(camera),feature=featureById(entry.id)
        const region=regions.some(r=>r.id===entry.id),subregion='kind'in entry&&entry.kind==='subregion',chosen=entry.id===p.selected
        const x=(pos.x*.5+.5)*width,y=(-pos.y*.5+.5)*height
        const match=chosen||!needle||normalize([entry.name,...('aliases'in entry?entry.aliases||[]:[]),'region'in entry?regionById(entry.region)?.name:'','mapLabel'in entry?entry.mapLabel:'',feature?.summary].join(' ')).includes(needle)
        const tier=feature?feature.kind==='route'?p.showRoutes&&(route?chosen:feature.status!=='planned'):p.showGeography&&!route:subregion?p.showGeography&&!route:region?camera.zoom<1.8&&!route:route?route.stops?.includes(entry.id):p.showCities
        const visible=pos.z>=-1&&pos.z<=1&&x>-14&&x<width+14&&y>-14&&y<height+14&&match&&((chosen&&(!feature||(feature.kind==='route'?p.showRoutes:p.showGeography)))||tier||Boolean(needle))
        button.style.left=`${x}px`;button.style.top=`${y}px`;button.style.zIndex=chosen?'30':region?'7':'6'
        button.classList.toggle('is-hidden',!visible);button.classList.toggle('selected',chosen);button.classList.toggle('route-stop',Boolean(route?.stops?.includes(entry.id)))
        button.classList.toggle('relief-distant',!chosen&&!region&&!subregion&&(!('major'in entry)||!entry.major)&&camera.zoom<2.5)
        button.setAttribute('aria-pressed',String(chosen));button.setAttribute('aria-hidden',String(!visible));button.tabIndex=visible?0:-1
        if(visible)candidates.push({id:entry.id,button,x,y,priority:chosen?100:region?90:'major'in entry&&entry.major?80:subregion?70:feature?40:50})
      }
      const occupied=candidates.map(c=>({id:c.id,left:c.x-12,right:c.x+12,top:c.y-12,bottom:c.y+12}));let count=0
      for(const candidate of candidates.sort((a,b)=>b.priority-a.priority)){
        const label=candidate.button.querySelector<HTMLSpanElement>('.pin-label')!,w=label.offsetWidth||130,h=label.offsetHeight||22
        let placed=false
        for(const left of [false,true]){
          const l=left?candidate.x-w-24:candidate.x+24,rect={id:candidate.id,left:l,right:l+w,top:candidate.y-h/2-3,bottom:candidate.y+h/2+3}
          const overlaps=occupied.some(o=>o.id!==rect.id&&rect.left<o.right+4&&rect.right>o.left-4&&rect.top<o.bottom+4&&rect.bottom>o.top-4)
          if((candidate.id===p.selected||(!overlaps&&count<(mobile?7:15)))&&rect.left>=5&&rect.right<=width-5&&rect.top>=7&&rect.bottom<=height-7){candidate.button.classList.toggle('label-left',left);occupied.push(rect);count++;placed=true;break}
        }
        candidate.button.classList.toggle('label-muted',!placed&&candidate.id!==p.selected)
      }
      element!.dataset.cameraProjection=JSON.stringify(camera.projectionMatrix.elements);element!.dataset.cameraInverse=JSON.stringify(camera.matrixWorldInverse.elements)
      element!.dataset.cameraZoom=String(camera.zoom);element!.dataset.cameraTarget=JSON.stringify(controls.target.toArray())
      latest.current.onZoom(Math.round(camera.zoom*100))
    }
    function updateLayers(dt:number){
      if(!world)return
      const p=latest.current,selection=regionById(p.selected||'')||locationById(p.selected||'')||featureById(p.selected||'')
      const localPoint=mapPoint(controls.target.x,controls.target.z),elevation=heightAt(localPoint)
      const steam=p.selected==='ternhaven',cold=coldAt(localPoint,elevation)
      const wantsWeather=p.effects&&!p.reducedMotion&&camera.zoom>1.65&&(cold>.35||steam)
      const targetOpacity=wantsWeather?(steam?.35:Math.min(.8,cold*(layers.current.winter?1:.68))):0
      world.weatherMaterial.uniforms.uOpacity.value=!p.effects||p.reducedMotion?0:THREE.MathUtils.lerp(world.weatherMaterial.uniforms.uOpacity.value,targetOpacity,Math.min(1,dt*9))
      if(!wantsWeather&&world.weatherMaterial.uniforms.uOpacity.value<.01)world.weatherMaterial.uniforms.uOpacity.value=0
      world.weatherMaterial.uniforms.uSteam.value=steam?1:0
      world.weather.position.set(controls.target.x,elevation+.2,controls.target.z)
      world.weather.scale.set(baseHeight*(element!.clientWidth/element!.clientHeight)/camera.zoom*.52,1,baseHeight/camera.zoom*.65)
      const label=wantsWeather?steam?'Sıcak su buharı':cold>.85?'Yoğun kar':'Dağ karı':''
      if(label!==lastWeather){lastWeather=label;setWeatherLabel(label)}
      element!.dataset.weather=wantsWeather?steam?'steam':'snow':'none'
      element!.dataset.snowOpacity=String(world.weatherMaterial.uniforms.uOpacity.value)
      world.winter.value=layers.current.winter?1:0;world.ice.visible=layers.current.winter
      element!.dataset.surface='procedural-terrain'
      world.forests.group.visible=layers.current.forest;world.forests.trunk.visible=true
      element!.dataset.forestVisible=String(world.forests.group.visible);element!.dataset.waterVisible=String(layers.current.water);element!.dataset.winter=String(layers.current.winter)
      world.waters.visible=layers.current.water;world.oceanMaterial.uniforms.uDetail.value=layers.current.water?1:0
      let visibleModels=0
      const visibleCityIds:string[]=[]
      for(const group of [...world.cities,...world.monuments]){
        const isCity=group.name.startsWith('settlement:'),id=group.userData.targetId
        const projected=group.position.clone().project(camera)
        const inView=Math.abs(projected.x)<1.15&&Math.abs(projected.y)<1.2&&projected.z>-1&&projected.z<1
        // Every settlement exists at every zoom; selection is never defeated
        // by LOD. Only the viewport and explicit city layer control visibility.
        group.visible=inView&&(isCity?p.showCities||p.selected===id:p.showGeography)
        group.scale.setScalar(group.userData.modelScale||1)
        if(group.visible){visibleModels++;if(isCity)visibleCityIds.push(id)}
      }
      element!.dataset.visibleModels=String(visibleModels);element!.dataset.visibleCityIds=JSON.stringify(visibleCityIds)
      world.routes.visible=p.showRoutes
      const selectedRoute=featureById(p.selected||'')?.kind==='route'?p.selected:null
      for(const group of world.routes.children){const feature=featureById(group.userData.targetId)!;group.visible=selectedRoute?feature.id===selectedRoute:feature.status!=='planned'}
      if(selection?.point){world.ring.visible=true;world.ring.position.set(...worldPoint(selection.point,heightAt(selection.point)+.13));const size='box'in selection&&regions.some(r=>r.id===selection.id)?2:1;world.ring.scale.setScalar(size)}else world.ring.visible=false
      const span=Math.max(6,Math.min(65,baseHeight/camera.zoom));sun.position.set(controls.target.x-26,controls.target.y+65,controls.target.z+22);sun.target.position.copy(controls.target)
      sun.shadow.camera.left=-span;sun.shadow.camera.right=span;sun.shadow.camera.top=span;sun.shadow.camera.bottom=-span;sun.shadow.camera.updateProjectionMatrix()
      scene.fog=p.effects?new THREE.FogExp2('#233442',.0015):null
      controls.enableDamping=!p.reducedMotion
      element!.dataset.animation=p.reducedMotion?'reduced':p.effects?'active':'static'
    }
    function tick(now:number){
      frame=0;if(disposed||document.hidden)return
      const dt=Math.min(.05,(now-lastTick)/1000);lastTick=now
      if(tween){
        const factor=1-Math.exp(-dt*8),offset=camera.position.clone().sub(controls.target)
        controls.target.lerp(tween.target,factor);camera.position.copy(controls.target).add(tween.eye?offset.lerp(tween.eye,factor):offset)
        camera.zoom=THREE.MathUtils.lerp(camera.zoom,tween.zoom,factor);camera.updateProjectionMatrix()
        if(controls.target.distanceTo(tween.target)<.025&&Math.abs(camera.zoom-tween.zoom)<.004&&(!tween.eye||offset.distanceTo(tween.eye)<.025))finishTween()
        dirty=true;project=true
      }
      controls.update()
      const centre=worldPoint(DANSTSUD_VIEW.point),x=THREE.MathUtils.clamp(controls.target.x,centre[0]-DANSTSUD_VIEW.width/2,centre[0]+DANSTSUD_VIEW.width/2),z=THREE.MathUtils.clamp(controls.target.z,centre[2]-DANSTSUD_VIEW.depth/2,centre[2]+DANSTSUD_VIEW.depth/2)
      if(x!==controls.target.x||z!==controls.target.z){camera.position.x+=x-controls.target.x;camera.position.z+=z-controls.target.z;controls.target.x=x;controls.target.z=z;controls.update();project=true;dirty=true}
      updateLayers(dt)
      const animated=world&&latest.current.effects&&!latest.current.reducedMotion
      if(animated){const time=now/1000;for(const flow of world!.flows)flow.uniforms.uTime.value=time;world!.weatherMaterial.uniforms.uTime.value=time}
      if(world&&(dirty||animated)&&now-lastRender>=(dirty?15:mobile?50:33)){
        camera.updateMatrixWorld();renderer.render(scene,camera);lastRender=now
        element!.dataset.drawCalls=String(renderer.info.render.calls);element!.dataset.triangles=String(renderer.info.render.triangles)
        if(project){projectMarkers();project=false}dirty=false
      }
      if(tween||dirty||animated)schedule()
    }
    runtime.current={home,zoom:factor=>{tween=null;camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,.8,14);camera.updateProjectionMatrix();controls.update();changed()},tilt,north,refresh:(focus=false)=>{if(focus&&world)focusSelected();if(latest.current.reducedMotion)finishTween();changed()}}
    resize()
    try {world=buildReliefWorld(mobile);scene.add(world.root);makeMarkers()}catch{fail()}
    if(world){
      element.dataset.vertices=String(world.vertices);element.dataset.cityCount=String(world.cities.length);element.dataset.forestCount=String(world.forests.group.userData.count)
      element.dataset.textureWidth='0';element.dataset.ready='true';setReady(true)
      let restored=false
      try{
        const saved=JSON.parse(sessionStorage.getItem(cameraKey)||'null')
        if(saved&&saved.selected===latest.current.selected&&[saved.target,saved.position].every((values:unknown)=>Array.isArray(values)&&values.length===3&&values.every((v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<400))&&Number.isFinite(saved.zoom)&&saved.zoom>=.8&&saved.zoom<=14&&inDanstsudView(mapPoint(saved.target[0],saved.target[2]))){controls.target.fromArray(saved.target);camera.position.fromArray(saved.position);camera.zoom=saved.zoom;camera.updateProjectionMatrix();controls.update();restored=true;setFlat(camera.position.clone().sub(controls.target).normalize().y>.98)}
      }catch{/* Invalid remembered views are ignored. */}
      if(!restored){focusSelected();finishTween()}changed()
    }
    return()=>{
      disposed=true;remember();window.clearTimeout(saveTimer);cancelAnimationFrame(frame);observer.disconnect();runtime.current=null
      document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('keydown',keyboard)
      canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerleave',pointerLeave)
      controls.removeEventListener('change',changeHandler);controls.removeEventListener('start',startHandler);controls.dispose()
      if(world)disposeWorld(world.root)
      renderer.dispose();renderer.forceContextLoss();canvas.remove();overlay.replaceChildren();markerMap.clear();markerVectors.clear()
    }
  },[])

  useEffect(()=>{
    if(previousSelected.current===props.selected)return
    previousSelected.current=props.selected
    runtime.current?.refresh(true)
  },[props.selected])
  useEffect(()=>{runtime.current?.refresh()},[props.query,props.showCities,props.showGeography,props.showRoutes,props.effects,props.reducedMotion,forest,water,winter])
  const selectedPlace=placeById(props.selected||''),signature=signatures[props.selected||'']
  return <>
    <div className="relief-viewer" ref={host} data-testid="relief-viewer" />
    <div className="relief-pins" ref={pins} aria-label="Danstsud 3D atlas yerleri" />
    <div className="relief-tooltip" ref={tooltip} hidden />
    {!ready&&<div className="map-loading" role="status"><LoaderCircle className="spin" size={25}/><span>Danstsud haritası oluşturuluyor…</span></div>}
    <button className="relief-exit" aria-label="3D görünümü kapat" onClick={props.onExit}><X size={16}/><span>2D’ye dön</span></button>
    <div className="relief-controls" aria-label="3D atlas kontrolleri">
      <button aria-label={flat?'Eğimli görünüm':'Üstten görünüm'} aria-pressed={flat} onClick={()=>runtime.current?.tilt(!flat)}><Layers3 size={16}/><span>{flat?'Üstten':'Eğimli'}</span></button>
      <button aria-label="Kuzeye dön" onClick={()=>runtime.current?.north()}><Compass size={17}/><span>Kuzey</span></button>
      <span className="relief-control-divider"/>
      <button aria-label="3D ormanlar" aria-pressed={forest} onClick={()=>setForest(!forest)}><Trees size={16}/><span>Orman</span></button>
      <button aria-label="3D su yüzeyleri" aria-pressed={water} onClick={()=>setWater(!water)}><Waves size={16}/><span>Su</span></button>
      <button aria-label="Kış görünümü" aria-pressed={winter} onClick={()=>setWinter(!winter)}><Snowflake size={16}/><span>Kış</span></button>
    </div>
    {ready&&<div className="relief-caption"><span><Mountain size={14}/> DANSTSUD · 3D {weatherLabel&&<em>· {weatherLabel}</em>}</span>{signature&&<small>{signature.label}</small>}{!selectedPlace&&!props.selected&&<small>Sürükle · yakınlaş · sağ sürüklemeyle eğ</small>}</div>}
    <button className="relief-home" aria-label="3D kamerayı sıfırla" onClick={()=>runtime.current?.home()}><RotateCcw size={16}/></button>
  </>
})
