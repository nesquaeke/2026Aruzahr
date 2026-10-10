import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { Matrix4, Mesh, Texture, Vector3 } from 'three'
import { places, placeById } from '../src/data'
import { mapFeatures } from '../src/map-features'
import { buildSettlement } from '../src/relief-buildings'
import { buildReliefWorld, disposeWorld } from '../src/relief-scene'
import { coldAt, danstsudPlaces, heightAt, inPolygon, mapPoint, mountainFootprints, riverPaths, signatures, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from '../src/relief-data'
import type { UV } from '../src/relief-data'

// A new session starts in 2D. These tests explicitly enable the optional
// Danstsud renderer and exercise real WebGL, including its fallback paths.
test.use({ storageState: { cookies: [], origins: [] } })
test.setTimeout(60000)

async function open3D(page:Page,id='',motion=false) {
  await page.emulateMedia({reducedMotion:motion?'no-preference':'reduce'})
  await page.goto(`/#/atlas${id?`/${id}`:''}`)
  if(await page.getByTestId('toggle-3d').getAttribute('aria-pressed')==='false')await page.getByTestId('toggle-3d').click()
  await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-ready','true',{timeout:30000})
  await page.waitForFunction(()=>{const el=document.querySelector<HTMLElement>('[data-testid=relief-viewer]');return el?.dataset.cameraProjection&&Number(el.dataset.drawCalls)>0})
}
async function projected(page:Page,point:[number,number,number]) {
  const data=await page.getByTestId('relief-viewer').evaluate(el=>({projection:el.dataset.cameraProjection!,inverse:el.dataset.cameraInverse!,rect:{x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.clientWidth,height:el.clientHeight}}))
  const value=new Vector3(...point).applyMatrix4(new Matrix4().fromArray(JSON.parse(data.inverse))).applyMatrix4(new Matrix4().fromArray(JSON.parse(data.projection)))
  return {x:data.rect.x+(value.x*.5+.5)*data.rect.width,y:data.rect.y+(-value.y*.5+.5)*data.rect.height}
}

test('all 58 Danstsud settlements have complete anchored geometry and distinct signature buildings',()=>{
  expect(places).toHaveLength(95)
  const ids=new Set<string>()
  for(const place of danstsudPlaces){
    expect(place.point).not.toBeNull()
    const group=buildSettlement({...place,point:place.point!});ids.add(group.userData.targetId)
    expect(group.position.x,place.name).toBeCloseTo((place.point![0]-.5)*WORLD_WIDTH,8)
    expect(group.position.z,place.name).toBeCloseTo((place.point![1]-.5)*WORLD_DEPTH,8)
    expect(group.children.length,place.name).toBeGreaterThan(1)
    expect(group.children.every(mesh=>'geometry'in mesh)).toBe(true)
    expect(group.children.some(mesh=>mesh.userData.part==='roof'||mesh.userData.part==='snow'),place.name).toBe(true)
    for(const mesh of group.children as Mesh[]){
      if(!['roof','snow'].includes(mesh.userData.part))continue
      const normals=mesh.geometry.getAttribute('normal')
      for(let i=0;i<normals.count;i++){
        const sloped=Math.abs(normals.getX(i))>.01||Math.abs(normals.getZ(i))>.01
        expect(sloped&&normals.getY(i)<-.01,`${place.name} inward pitched roof`).toBe(false)
      }
    }
    disposeWorld(group)
  }
  expect(ids.size).toBe(58)
  expect(signatures.valdareth.type).toBe('capital')
  const capital=buildSettlement({...placeById('valdareth')!,point:placeById('valdareth')!.point!})
  expect(capital.userData.features).toContain('Beş sur kuşağı')
  expect(capital.userData.features).toContain('Obsidyen mabedi')
  const pass=buildSettlement({...placeById('marhalden')!,point:placeById('marhalden')!.point!})
  expect(pass.userData.features).toContain('Kıyının iki tarafında kale')
  expect(signatures.kaldmere.type).toBe('huts')
  expect(ids.has('fehar')).toBe(true);expect(ids.has('frethar')).toBe(false)
})

test('source-map sea points and other countries remain flat while traced Danstsud peaks rise',()=>{
  for(const [x,y] of [[3200,3350],[4000,3650],[5300,2975],[6240,2800],[7450,2980],[4600,3830],[3500,4500],[4350,4850],[8150,4480],[6110,3060],[6450,2990]])expect(heightAt([x/8192,y/5668]),`${x},${y}`).toBe(0)
  expect(heightAt([4530/8192,4130/5668])).toBeGreaterThan(2)
  expect(coldAt([.555,.765])).toBeGreaterThan(.5)
  expect(coldAt(placeById('valdareth')!.point!)).toBe(0)
  for(const place of places.filter(place=>place.region!=='danstsud'))expect(heightAt(place.point!),place.name).toBe(0)
  expect(coldAt([.49,.19],5)).toBe(0)
  for(const place of places)expect(Number.isFinite(heightAt(place.point!)),place.id).toBe(true)
  for(const river of riverPaths){expect(mapFeatures.some(feature=>feature.id===river.id)).toBe(true);expect(river.points.every(point=>point.every(value=>value>=0&&value<=1))).toBe(true)}
  const marhalden=placeById('marhalden')!.point!
  expect(Math.min(...riverPaths.find(r=>r.id==='bati-aldara')!.points.map(p=>Math.hypot((p[0]-marhalden[0])*8192,(p[1]-marhalden[1])*5668)))).toBeLessThan(.01)
})

test('river faces remain above the real triangulated terrain instead of disappearing inside slopes',()=>{
  const world=buildReliefWorld(new Texture(),false)
  try{
    for(const river of world.waters.children.filter(mesh=>mesh.name.startsWith('river:')) as Mesh[]){
      const position=river.geometry.getAttribute('position'),indices=river.geometry.getIndex()!
      let clearance=Infinity
      for(let i=0;i<indices.count;i+=3){
        const vertices=[0,1,2].map(n=>new Vector3().fromBufferAttribute(position,indices.getX(i+n)))
        const midpoint=vertices.reduce((sum,vertex)=>sum.add(vertex),new Vector3()).divideScalar(3)
        clearance=Math.min(clearance,midpoint.y-world.sampleHeight(mapPoint(midpoint.x,midpoint.z)))
      }
      expect(clearance,river.name).toBeGreaterThan(0)
    }
  }finally{disposeWorld(world.root)}
})

test('a new visitor starts in 2D; Danstsud 3D explicitly switches on and off with complete city coverage',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(String(error)))
  const requests:string[]=[];page.on('request',request=>requests.push(request.url()))
  await page.goto('/#/atlas')
  await expect(page.getByTestId('atlas-viewer')).toBeVisible()
  await expect(page.getByTestId('toggle-3d')).toHaveAttribute('aria-pressed','false')
  expect(requests.some(url=>url.includes('/src/Atlas3D.tsx'))).toBe(false)
  await page.getByTestId('toggle-3d').click()
  const viewer=page.getByTestId('relief-viewer')
  await expect(viewer).toHaveAttribute('data-ready','true',{timeout:30000})
  await expect(viewer).toHaveAttribute('data-scope','danstsud')
  await expect(viewer).toHaveAttribute('data-city-count','58')
  await expect.poll(async()=>Number(await viewer.getAttribute('data-visible-models'))).toBe(61)
  expect(Number(await viewer.getAttribute('data-vertices'))).toBeGreaterThan(170000)
  expect(Number(await viewer.getAttribute('data-forest-count'))).toBeGreaterThan(1500)
  await expect(page.locator('.relief-pins .city-pin:not(.subregion-pin)')).toHaveCount(58)
  await expect(page.getByTestId('marker-xotar')).toHaveCount(0)
  await expect(page.getByTestId('marker-danstsud')).toBeVisible()
  await page.getByTestId('toggle-3d').click()
  await expect(page.getByTestId('atlas-viewer')).toBeVisible()
  await expect(page.getByTestId('relief-viewer')).toHaveCount(0)
  await expect(page.getByTestId('toggle-3d')).toHaveAttribute('aria-pressed','false')
  expect(errors).toEqual([])
})

// Independent inspection of the actual triangle mesh catches the old coastal
// foundation bug and interpolation spilling past a closed mountain footprint.
test('the rendered terrain has no raised triangle outside traced mountain footprints, in either quality tier',()=>{
  for(const mobile of [false,true]) {
    const world=buildReliefWorld(new Texture(),mobile)
    try {
      expect(world.cities.map(group=>group.userData.targetId).sort()).toEqual(danstsudPlaces.map(place=>place.id).sort())
      expect(world.root.getObjectByName('lakbar-warm-light')).toBeUndefined()
      for(const group of world.cities){
        const place=placeById(group.userData.targetId)!
        expect(group.position.y-world.sampleHeight(place.point!),`${place.name} model foundation`).toBeGreaterThanOrEqual(.024)
      }
      const positions=world.terrain.geometry.getAttribute('position'),index=world.terrain.geometry.getIndex()!
      let raised=0
      for(let i=0;i<index.count;i+=3){
        const vertices=[0,1,2].map(n=>new Vector3().fromBufferAttribute(positions,index.getX(i+n)))
        if(vertices.every(vertex=>vertex.y===0))continue
        raised++
        // All vertices, edge midpoints and the centroid must remain inside a
        // source mountain footprint, including zero-height boundary vertices.
        const samples=[...vertices,...vertices.map((p,n)=>p.clone().add(vertices[(n+1)%3]).multiplyScalar(.5)),vertices.reduce((sum,p)=>sum.add(p),new Vector3()).divideScalar(3)]
        for(const sample of samples)expect(mountainFootprints.some(area=>inPolygon(mapPoint(sample.x,sample.z),area.polygon)),`${mobile?'mobile':'desktop'} raised face outside source outline`).toBe(true)
      }
      expect(raised).toBeGreaterThan(200)
      for(const [x,y] of [[6110,3060],[6450,2990],[4000,3650],[4600,3830],[4350,4850]])expect(world.sampleHeight([x/8192,y/5668])).toBe(0)
    }finally{disposeWorld(world.root)}
  }
})


test('original pixel anchors project to the same 3D point instead of shifting cities',async({page})=>{
  await open3D(page)
  // Independently specified original pixels, including the six corrected sites.
  for(const [id,x,y] of [['valdareth',6200,4000],['lirendil',3260,2660],['dorvenhall',6460,3240],['harven',4795,5505],['tolvur',5385,5538],['theld',6504,4327],['uldar',5210,4400],['fevric',5260,4145],['naeron',5218,3890],['fehar',4860,3370]] as [string,number,number][]){
    const uv:UV=[x/8192,y/5668]
    const target=await projected(page,[(uv[0]-.5)*120,heightAt(uv)+.12,(uv[1]-.5)*120*5668/8192])
    const box=await page.getByTestId(`marker-${id}`).locator('.pin-symbol').boundingBox()
    expect(box,id).not.toBeNull()
    expect(Math.hypot(target.x-box!.x-box!.width/2,target.y-box!.y-box!.height/2),id).toBeLessThan(1)
  }
})

test('all 58 city pins select their existing panel and their actual model stays visible',async({page})=>{
  test.setTimeout(180000)
  await open3D(page)
  for(const place of danstsudPlaces){
    await page.evaluate(id=>{location.hash=`/atlas/${id}`},place.id)
    const pin=page.getByTestId(`marker-${place.id}`)
    await expect(pin,place.name).toHaveAttribute('aria-pressed','true')
    await expect(pin,place.name).toBeVisible()
    await expect.poll(async()=>JSON.parse(await page.getByTestId('relief-viewer').getAttribute('data-visible-city-ids')||'[]'),place.name).toContain(place.id)
    await pin.click()
    await expect(page.getByTestId('detail-panel').getByRole('heading',{name:place.name,exact:true})).toBeVisible()
  }
  await expect(page.locator('.relief-pins .city-pin:not(.subregion-pin)')).toHaveCount(58)
})

test('zoom, wheel, keyboard pan, tilt, north and home control the camera without losing the map',async({page})=>{
  await open3D(page,'valdareth')
  const viewer=page.getByTestId('relief-viewer')
  const before=Number(await viewer.getAttribute('data-camera-zoom'))
  await page.getByRole('button',{name:'Yakınlaştır',exact:true}).click()
  await expect.poll(async()=>Number(await viewer.getAttribute('data-camera-zoom'))).toBeGreaterThan(before)
  const canvas=viewer.locator('canvas'),rect=await canvas.boundingBox()
  const zoomed=Number(await viewer.getAttribute('data-camera-zoom'))
  await page.mouse.move(rect!.x+rect!.width*.73,rect!.y+rect!.height*.68)
  await page.mouse.wheel(0,-160)
  await expect.poll(async()=>Number(await viewer.getAttribute('data-camera-zoom'))).toBeGreaterThan(zoomed)
  const target=await viewer.getAttribute('data-camera-target')
  await canvas.focus();await page.keyboard.press('ArrowRight')
  await expect.poll(()=>viewer.getAttribute('data-camera-target')).not.toBe(target)
  await page.getByRole('button',{name:'Üstten görünüm',exact:true}).click()
  await expect(page.getByRole('button',{name:'Eğimli görünüm',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Kuzeye dön',exact:true}).click()
  await expect(page.getByRole('button',{name:'Eğimli görünüm',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Haritanın tamamını göster',exact:true}).click()
  await expect.poll(async()=>Number(await viewer.getAttribute('data-visible-models'))).toBe(61)
  await expect(page.getByTestId('marker-lirendil')).toBeVisible()
})

test('real building geometry can be picked away from its pin and pointer gestures move and rotate the camera',async({page})=>{
  await open3D(page,'valdareth-ovasi')
  const viewer=page.getByTestId('relief-viewer')
  await expect.poll(async()=>Number(await viewer.getAttribute('data-visible-models'))).toBeGreaterThan(0)
  const place=placeById('valdareth')!,scale=signatures.valdareth.scale
  // The royal castle roof is separate from the city pin. This is an actual
  // canvas pointer/raycast selection, not a DOM marker or a mocked callback.
  const point=await projected(page,[(place.point![0]-.5)*WORLD_WIDTH-.19*scale,heightAt(place.point!)+.025+.9*scale,(place.point![1]-.5)*WORLD_DEPTH-.16*scale])
  await page.mouse.move(point.x,point.y)
  await expect(page.locator('.relief-tooltip')).toHaveText('Valdareth')
  await expect(page.locator('.relief-tooltip')).toBeVisible()
  await page.mouse.click(point.x,point.y)
  await expect(page.getByTestId('marker-valdareth')).toHaveAttribute('aria-pressed','true')
  await expect(page.getByTestId('detail-panel')).toContainText('Eryndorn')
  const canvas=await viewer.locator('canvas').boundingBox(),x=canvas!.x+canvas!.width*.75,y=canvas!.y+canvas!.height*.8
  const oldTarget=await viewer.getAttribute('data-camera-target')
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-75,y-20,{steps:5});await page.mouse.up()
  await expect.poll(()=>viewer.getAttribute('data-camera-target')).not.toBe(oldTarget)
  const oldOrientation=await viewer.getAttribute('data-camera-inverse')
  await page.mouse.move(x,y);await page.mouse.down({button:'right'});await page.mouse.move(x-50,y-35,{steps:5});await page.mouse.up({button:'right'})
  await expect.poll(()=>viewer.getAttribute('data-camera-inverse')).not.toBe(oldOrientation)
})

test('3D to wiki and back preserves the remembered camera and both renderer choices survive reload',async({page})=>{
  await open3D(page,'valdareth')
  const before=Number(await page.getByTestId('relief-viewer').getAttribute('data-camera-zoom'))
  await page.getByRole('button',{name:'Yakınlaştır',exact:true}).click()
  await expect.poll(async()=>Number(await page.getByTestId('relief-viewer').getAttribute('data-camera-zoom'))).toBeGreaterThan(before)
  const zoom=await page.getByTestId('relief-viewer').getAttribute('data-camera-zoom')
  await page.getByRole('button',{name:'Wiki sayfasını aç',exact:true}).click()
  await expect(page.locator('.article-title h1')).toHaveText('Valdareth')
  await page.getByRole('button',{name:'Haritaya dön',exact:true}).click()
  await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-ready','true')
  await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-camera-zoom',zoom!)
  await page.getByRole('button',{name:'2D harita',exact:true}).click()
  await expect(page.getByTestId('atlas-viewer')).toBeVisible()
  await expect(page.getByTestId('marker-valdareth')).toBeVisible({timeout:15000})
  await page.reload();await expect(page.getByRole('button',{name:'2D harita',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Danstsud 3D',exact:true}).click()
  await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-ready','true')
  await expect(page.getByTestId('marker-valdareth')).toHaveAttribute('aria-pressed','true')
  await page.reload();await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-ready','true')
})

test('forest, water and winter controls change layers while the original map remains at every zoom',async({page})=>{
  await open3D(page,'frostmere-golu')
  const viewer=page.getByTestId('relief-viewer')
  await expect(viewer).toHaveAttribute('data-forest-visible','true')
  await page.getByRole('button',{name:'3D ormanlar',exact:true}).click();await expect(viewer).toHaveAttribute('data-forest-visible','false')
  await page.getByRole('button',{name:'3D su yüzeyleri',exact:true}).click();await expect(viewer).toHaveAttribute('data-water-visible','false')
  await page.getByRole('button',{name:'Kış görünümü',exact:true}).click();await expect(viewer).toHaveAttribute('data-winter','true')
  await expect(viewer).toHaveAttribute('data-surface','original-map')
  await page.getByRole('button',{name:'Yakınlaştır',exact:true}).click()
  await expect(viewer).toHaveAttribute('data-surface','original-map')
})

test('cold areas receive local snow, warm cities do not, hot springs have steam and reduced motion stops weather',async({page})=>{
  await open3D(page,'veyrakar',true)
  const viewer=page.getByTestId('relief-viewer')
  await expect(viewer).toHaveAttribute('data-weather','snow',{timeout:15000})
  await expect.poll(async()=>Number(await viewer.getAttribute('data-snow-opacity'))).toBeGreaterThan(.1)
  await page.evaluate(()=>{location.hash='/atlas/valdareth'})
  await expect(viewer).toHaveAttribute('data-weather','none',{timeout:15000})
  await page.evaluate(()=>{location.hash='/atlas/ternhaven'})
  await expect(viewer).toHaveAttribute('data-weather','steam',{timeout:15000})
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(viewer).toHaveAttribute('data-weather','none')
  await expect(viewer).toHaveAttribute('data-animation','reduced')
  await expect.poll(async()=>Number(await viewer.getAttribute('data-snow-opacity'))).toBe(0)
  await expect(page.getByRole('button',{name:'Atmosfer efektleri'})).toBeDisabled()
})

test('switching atmosphere off or reducing motion clears settled snow immediately without waiting for a camera movement',async({page})=>{
  await open3D(page,'veyrakar',true)
  const viewer=page.getByTestId('relief-viewer')
  const point=mapFeatures.find(feature=>feature.id==='veyrakar')!.point
  await expect(viewer).toHaveAttribute('data-camera-target',JSON.stringify(worldPoint(point,heightAt(point))),{timeout:15000})
  await expect.poll(async()=>Number(await viewer.getAttribute('data-snow-opacity'))).toBeGreaterThan(.15)
  await page.getByRole('button',{name:'Atmosfer efektleri',exact:true}).click()
  await expect(viewer).toHaveAttribute('data-animation','static')
  await expect(viewer).toHaveAttribute('data-snow-opacity','0')
  await page.getByRole('button',{name:'Atmosfer efektleri',exact:true}).click()
  await expect.poll(async()=>Number(await viewer.getAttribute('data-snow-opacity'))).toBeGreaterThan(.15)
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(viewer).toHaveAttribute('data-animation','reduced')
  await expect(viewer).toHaveAttribute('data-snow-opacity','0')
})

test('legacy place URLs, search and planned trade routes keep their canonical records in 3D',async({page})=>{
  await open3D(page,'frethar')
  await expect(page.getByTestId('marker-fehar')).toHaveAttribute('aria-pressed','true')
  await expect(page.getByTestId('marker-frethar')).toHaveCount(0)
  await page.getByRole('textbox',{name:'Atlas ve wiki içinde ara'}).fill('Telvar')
  await page.getByTestId('location-result-telvai').click()
  await expect(page.getByTestId('marker-telvai')).toHaveAttribute('aria-pressed','true')
  await page.getByRole('textbox',{name:'Atlas ve wiki içinde ara'}).fill('')
  await page.evaluate(()=>{location.hash='/atlas/cevher-cizgisi'})
  await expect(page.getByTestId('marker-cevher-cizgisi')).toHaveAttribute('aria-pressed','true')
  await expect(page.getByTestId('detail-panel')).toContainText('Hayata geçmedi')
  await expect(page.getByRole('button',{name:'Ticaret yolları',exact:true})).toHaveAttribute('aria-pressed','true')
})

test('missing WebGL falls back to the working 2D atlas with the same selected place',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){if(type==='webgl2'||type==='webgl')return null;return original.apply(this,[type,...args] as Parameters<typeof original>)} as typeof original
  })
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#/atlas/valdareth')
  await page.getByTestId('toggle-3d').click()
  await expect(page.getByRole('button',{name:'2D harita',exact:true})).toHaveAttribute('aria-pressed','true',{timeout:15000})
  await expect(page.getByTestId('marker-valdareth')).toBeVisible({timeout:15000})
  await expect(page.getByTestId('detail-panel')).toContainText('Valdareth')
  await page.getByRole('button',{name:'Wiki sayfasını aç',exact:true}).click()
  await expect(page.locator('.article-title h1')).toHaveText('Valdareth')
})

test('a failed 3D engine download opens the existing drawing atlas instead of breaking the page',async({page})=>{
  await page.route('**/src/Atlas3D.tsx*',route=>route.abort())
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#/atlas/valdareth')
  await page.getByTestId('toggle-3d').click()
  await expect(page.getByRole('button',{name:'2D harita',exact:true})).toHaveAttribute('aria-pressed','true',{timeout:15000})
  await expect(page.getByTestId('marker-valdareth')).toBeVisible({timeout:15000})
  await expect(page.getByTestId('detail-panel')).toContainText('Valdareth')
})

test('a real GPU context loss releases the 3D renderer and opens the preserved 2D map',async({page})=>{
  await open3D(page,'marhalden')
  const lost=await page.getByTestId('relief-viewer').locator('canvas').evaluate(canvas=>{const gl=canvas.getContext('webgl2');const extension=gl?.getExtension('WEBGL_lose_context');extension?.loseContext();return Boolean(extension)})
  expect(lost).toBe(true)
  await expect(page.getByRole('button',{name:'2D harita',exact:true})).toHaveAttribute('aria-pressed','true')
  await expect(page.getByTestId('marker-marhalden')).toBeVisible({timeout:15000})
})

for(const width of [320,390,820,1024,1440])test(`3D atlas controls, city panel and drawing fallback fit ${width}px without overflow`,async({page})=>{
  await page.setViewportSize({width,height:900});await open3D(page,'valdareth')
  const viewer=page.getByTestId('relief-viewer')
  await expect(page.getByTestId('marker-valdareth')).toBeVisible()
  await expect(page.getByRole('button',{name:'Danstsud 3D',exact:true})).toBeVisible()
  await expect(page.getByRole('button',{name:'2D harita',exact:true})).toBeVisible()
  const controls=await page.locator('.relief-controls button,.relief-home').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().toJSON()))
  for(const rect of controls){expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.right).toBeLessThanOrEqual(width);expect(rect.width).toBeGreaterThanOrEqual(35)}
  for(let a=0;a<controls.length;a++)for(let b=a+1;b<controls.length;b++)expect(controls[a].left<controls[b].right&&controls[a].right>controls[b].left&&controls[a].top<controls[b].bottom&&controls[a].bottom>controls[b].top,'camera/layer controls overlap').toBe(false)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false)
  await page.getByRole('button',{name:'Kış görünümü',exact:true}).click()
  await expect(viewer).toHaveAttribute('data-winter','true')
  expect(Number(await viewer.getAttribute('data-vertices'))).toBeGreaterThan(15000)
  await page.getByRole('button',{name:'2D harita',exact:true}).click()
  await expect(page.getByTestId('marker-valdareth')).toBeVisible({timeout:15000})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false)
})

test('malformed camera storage uses a valid fitted camera and keeps the selected city accessible',async({page})=>{
  await page.addInitScript(()=>{sessionStorage.setItem('aruzahr-danstsud-3d-camera-v2',JSON.stringify({selected:'valdareth',target:[999999,0,null],position:[],zoom:-2}));localStorage.setItem('aruzahr-danstsud-atlas-mode','broken')})
  await open3D(page,'valdareth')
  await expect(page.getByTestId('marker-valdareth')).toHaveAttribute('aria-pressed','true')
  expect(Number(await page.getByTestId('relief-viewer').getAttribute('data-camera-zoom'))).toBeGreaterThan(1)
})


test('selecting another kingdom leaves optional Danstsud 3D and keeps its original map panel',async({page})=>{
  await open3D(page,'valdareth')
  await page.evaluate(()=>{location.hash='/atlas/xotar'})
  await expect(page.getByTestId('atlas-viewer')).toBeVisible()
  await expect(page.getByTestId('toggle-3d')).toHaveAttribute('aria-pressed','false')
  await expect(page.getByTestId('detail-panel').getByRole('heading',{name:'Xotar',exact:true})).toBeVisible()
  await page.getByTestId('toggle-3d').click()
  await expect(page.getByTestId('relief-viewer')).toHaveAttribute('data-ready','true')
  await expect(page.getByTestId('marker-xotar')).toHaveCount(0)
  await expect(page.getByTestId('marker-lirendil')).toBeVisible()
})
