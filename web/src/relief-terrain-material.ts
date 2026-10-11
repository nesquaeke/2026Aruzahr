import * as THREE from 'three'
import { smoothstep, valueNoise } from './relief-data'

// The three maps are authored from the new heightfield, not the reference
// bitmap. Baking moves small-scale surface work out of the fragment shader.
export function terrainSurface(geometry:THREE.BufferGeometry,cols:number,rows:number,mobile:boolean,winter:{value:number}) {
  const width=mobile?768:1536,height=Math.round(width*rows/cols),count=width*height
  const albedo=new Uint8Array(count*4),roughness=new Uint8Array(count*4),normalMap=new Uint8Array(count*4),micro=new Float32Array(count)
  const position=geometry.getAttribute('position'),color=geometry.getAttribute('color'),normals=geometry.getAttribute('normal')
  const spanX=position.getX(cols)-position.getX(0),spanZ=position.getZ(rows*(cols+1))-position.getZ(0)
  const pigment=new THREE.Color(),mineralColor=new THREE.Color()
  for(let row=0;row<height;row++)for(let x=0;x<width;x++){
    // Plane UV v=0 is its southern edge after rotateX(-pi/2).
    const gx=x/(width-1)*cols,gy=(1-row/(height-1))*rows,ix=Math.min(cols-1,Math.floor(gx)),iy=Math.min(rows-1,Math.floor(gy)),fx=gx-ix,fy=gy-iy
    const a=iy*(cols+1)+ix,b=a+1,c=a+cols+1,d=c+1
    const sample=(attr:THREE.BufferAttribute|THREE.InterleavedBufferAttribute,axis:number)=>((attr.getComponent(a,axis)*(1-fx)+attr.getComponent(b,axis)*fx)*(1-fy)+(attr.getComponent(c,axis)*(1-fx)+attr.getComponent(d,axis)*fx)*fy)
    const wx=sample(position,0),y=sample(position,1),wz=sample(position,2),slope=1-Math.max(0,sample(normals,1))
    const stone=Math.max(smoothstep(.5,1.65,y),smoothstep(.14,.5,slope))
    const broad=valueNoise(wx*2.1+31,wz*2.1),grain=valueNoise(wx*27.,wz*27.),fine=valueNoise(wx*91.+9,wz*91.)
    const vein=1-Math.abs(Math.sin(wx*5.2+wz*2.5+y*12.+broad*4.))
    const shade=.75+broad*.24+grain*.11+fine*.05
    pigment.setRGB(sample(color,0)*shade,sample(color,1)*shade,sample(color,2)*shade)
    const mineral=.73+grain*.2+vein*.12
    pigment.lerp(mineralColor.setRGB(.23*mineral,.255*mineral,.245*mineral),stone*.62)
    // Grass, mineral grains and roughness are independent of mesh cell size.
    micro[row*width+x]=((grain-.5)*.011+(fine-.5)*.005)*(.3+stone*2.2)+(broad-.5)*stone*.025
    pigment.convertLinearToSRGB()
    const n=(row*width+x)*4,r=Math.round(THREE.MathUtils.clamp(.91-stone*.09+fine*.035,0,1)*255)
    albedo[n]=Math.round(pigment.r*255);albedo[n+1]=Math.round(pigment.g*255);albedo[n+2]=Math.round(pigment.b*255);albedo[n+3]=255
    roughness[n]=roughness[n+1]=roughness[n+2]=r;roughness[n+3]=255
  }
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const dx=(micro[y*width+Math.min(width-1,x+1)]-micro[y*width+Math.max(0,x-1)])/(2*spanX/width)
    const dy=(micro[Math.min(height-1,y+1)*width+x]-micro[Math.max(0,y-1)*width+x])/(2*spanZ/height)
    const inv=1/Math.sqrt(dx*dx+dy*dy+1),i=(y*width+x)*4
    normalMap[i]=Math.round((-dx*inv*.5+.5)*255);normalMap[i+1]=Math.round((-dy*inv*.5+.5)*255);normalMap[i+2]=Math.round((inv*.5+.5)*255);normalMap[i+3]=255
  }
  function texture(data:Uint8Array,srgb=false){const t=new THREE.DataTexture(data,width,height);t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.anisotropy=4;t.needsUpdate=true;return t}
  const material=new THREE.MeshStandardMaterial({map:texture(albedo,true),normalMap:texture(normalMap),roughnessMap:texture(roughness),roughness:1,normalScale:new THREE.Vector2(.85,.85)})
  material.userData.surfaceMaps={width,height,source:'procedural-heightfield'}
  material.onBeforeCompile=shader=>{
    shader.uniforms.uWinter=winter
    shader.vertexShader='attribute float aSnow;attribute float aCold;varying float vSnow;varying float vCold;varying vec3 vGroundNormal;varying vec3 vGround;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnow=aSnow;vCold=aCold;vGroundNormal=normal;vGround=position;')
    shader.fragmentShader='uniform float uWinter;varying float vSnow;varying float vCold;varying vec3 vGroundNormal;varying vec3 vGround;\n'+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float slope=1.-clamp(normalize(vGroundNormal).y,0.,1.);
      float snowAmount=clamp(vSnow+uWinter*vCold*.42,0.,.98)*(1.-smoothstep(.10,.55,slope)*.94);
      float drift=sin(vGround.x*4.+vGround.z*.7)*sin(vGround.z*2.-vGround.x*.2)*.5+.5;
      diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(.56,.64,.68),vec3(.82,.85,.83),.45+drift*.45),snowAmount);`)
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.81,snowAmount);')
  }
  material.customProgramCacheKey=()=> 'baked-geological-surface-v2'
  return material
}
