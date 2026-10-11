import * as THREE from 'three'
import { valueNoise } from './relief-data'

// Small opaque leaf/needle detail for volumetric crowns. Generated locally;
// neither photographs nor the atlas bitmap are used as vegetation textures.
export function foliageMap(pine:boolean){
  const width=128,height=128,data=new Uint8Array(width*height*4)
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const grain=valueNoise(x*.41,y*.41),cluster=valueNoise(x*.09,y*.09)
    const veins=pine?Math.abs(Math.sin(x*.91+y*.57))*.045:Math.abs(Math.sin(x*.32)*Math.cos(y*.43))*.035
    const shade=.80+cluster*.11+grain*.06+veins,i=(y*width+x)*4
    data[i]=Math.round(255*shade*.96);data[i+1]=Math.round(255*shade);data[i+2]=Math.round(255*shade*.91);data[i+3]=255
  }
  const texture=new THREE.DataTexture(data,width,height);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true
  texture.userData.source='procedural-foliage-surface';return texture
}
