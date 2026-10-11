import * as THREE from 'three'

// Authored surface detail, evaluated in building coordinates: no external
// imagery, no atlas texture and no repeated UV seams across merged buildings.
export const surfaceNoiseGLSL = `
float atlasHash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float atlasNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(atlasHash(i),atlasHash(i+vec2(1,0)),f.x),mix(atlasHash(i+vec2(0,1)),atlasHash(i+vec2(1,1)),f.x),f.y);}
float atlasFbm(vec2 p){return atlasNoise(p)*.53+atlasNoise(p*2.03+13.)*.27+atlasNoise(p*4.17-9.)*.13+atlasNoise(p*8.31+7.)*.07;}
vec3 atlasBump(vec3 p,vec3 n,float h){vec3 dx=dFdx(p),dy=dFdy(p),r1=cross(dy,n),r2=cross(n,dx);float det=dot(dx,r1);vec3 gradient=sign(det)*(dFdx(h)*r1+dFdy(h)*r2);return normalize(abs(det)*n-gradient);}
`
export function masonryMaterial(color:string,kind:string) {
  const material=new THREE.MeshStandardMaterial({color,roughness:kind==='gold'?.42:kind==='roof'?.74:.9,metalness:kind==='gold'?.45:0})
  material.onBeforeCompile=shader=>{
    shader.uniforms.uKind={value:kind==='roof'?1:kind==='wood'?2:kind==='dark'?3:kind==='gold'?4:kind==='snow'?5:0}
    shader.vertexShader='varying vec3 vMasonry;varying vec3 vMasonryNormal;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvMasonry=position;vMasonryNormal=normal;')
    shader.fragmentShader='uniform float uKind;varying vec3 vMasonry;varying vec3 vMasonryNormal;\n'+surfaceNoiseGLSL+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec2 face=abs(vMasonryNormal.x)>abs(vMasonryNormal.z)?vMasonry.zy:vMasonry.xy;
      float grain=atlasFbm(face*145.),weather=atlasFbm(face*12.);
      float course=floor(face.y*58.);
      vec2 brick=fract(vec2(face.x*39.+mod(course,2.)*.5,face.y*58.));
      float mortar=max(1.-smoothstep(.015,.075,brick.x),smoothstep(.925,.985,brick.y));
      float variation=atlasHash(floor(vec2(face.x*39.+mod(course,2.)*.5,course)));
      vec2 roofFace=abs(vMasonryNormal.x)>abs(vMasonryNormal.z)?vMasonry.zy:vMasonry.xy;
      float tileCourse=floor(roofFace.y*85.);
      vec2 tileCell=fract(vec2(roofFace.x*82.+mod(tileCourse,2.)*.5,roofFace.y*85.));
      float tileJoint=max(smoothstep(.86,.99,tileCell.y),1.-smoothstep(.012,.08,tileCell.x));
      float tileVariation=atlasHash(floor(vec2(roofFace.x*82.+mod(tileCourse,2.)*.5,tileCourse)));
      float woodgrain=atlasNoise(vec2(face.x*245.,face.y*9.));
      float vein=pow(1.-abs(sin(face.x*12.+face.y*19.+weather*8.)),18.);
      float shade=uKind<.5?(.69+variation*.2+weather*.21+grain*.1-mortar*.18):uKind<1.5?(.76+tileVariation*.2+grain*.1-tileJoint*.16):uKind<2.5?(.59+woodgrain*.34+weather*.17):uKind<3.5?(.72+grain*.14+weather*.14+vein*.08):(.88+grain*.12);
      diffuseColor.rgb*=shade;
      diffuseColor.rgb*=1.-.2*exp(-max(vMasonry.y,0.)*10.);
      float surfaceHeight=uKind<.5?grain*.0012+weather*.002-mortar*.0018:uKind<1.5?grain*.0006-tileJoint*.0013:uKind<2.5?woodgrain*.0012:grain*.0006;`)
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=atlasBump(-vViewPosition,normal,surfaceHeight);')
  }
  // The source is identical for every finish; uKind is a material uniform.
  // Sharing this program avoids compiling the same large shader seven times.
  material.customProgramCacheKey=()=> 'masonry-detail-6'
  return material
}
