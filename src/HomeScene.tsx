import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import type { ServiceId } from './data';
type Vec = [number,number,number];
function makeTexture(kind:'timber'|'stone'|'roof'|'panel') {
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d')!;
 const colors={timber:'#997653',stone:'#b9b3a2',roof:'#293444',panel:'#12283d'};ctx.fillStyle=colors[kind];ctx.fillRect(0,0,256,256);
 let seed=77;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 if(kind==='panel'){ctx.strokeStyle='#7c9cb7';ctx.lineWidth=.8;for(let x=0;x<=256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke()}for(let y=0;y<=256;y+=43){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke()}ctx.strokeStyle='rgba(210,220,225,.25)';for(let x=2;x<256;x+=8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke()}}
 else if(kind==='roof'){ctx.strokeStyle='#536170';for(let x=0;x<256;x+=18){ctx.fillStyle='#344252';ctx.fillRect(x,0,2,256);ctx.beginPath();ctx.moveTo(x+2,0);ctx.lineTo(x+2,256);ctx.stroke()}}
 else {for(let i=0;i<1800;i++){ctx.fillStyle=`rgba(${rand()>.5?'255,255,255':'40,25,15'},${rand()*.10})`;ctx.fillRect(rand()*256,rand()*256,kind==='timber'?1:rand()*5,kind==='timber'?rand()*90:rand()*3)}if(kind==='timber'){ctx.fillStyle='rgba(40,25,10,.45)';for(let x=0;x<256;x+=32)ctx.fillRect(x,0,1.5,256)}else {ctx.strokeStyle='rgba(70,68,60,.15)';for(let y=0;y<256;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke()}}}
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(kind==='roof')t.repeat.set(3,1);return t;
}
function buildHome(){
 const root=new THREE.Group();const energy=new THREE.Group();root.add(energy);
 const mats={stone:new THREE.MeshStandardMaterial({map:makeTexture('stone'),roughness:.95}),wood:new THREE.MeshStandardMaterial({map:makeTexture('timber'),roughness:.85}),roof:new THREE.MeshStandardMaterial({map:makeTexture('roof'),metalness:.45,roughness:.52}),metal:new THREE.MeshStandardMaterial({color:'#202d3b',metalness:.5,roughness:.45}),wall:new THREE.MeshStandardMaterial({color:'#d5cabb',roughness:.95}),floor:new THREE.MeshStandardMaterial({color:'#a88d6e',roughness:.95}),glass:new THREE.MeshStandardMaterial({color:'#e9cfa5',transparent:true,opacity:.16,metalness:.15,roughness:.15,side:THREE.DoubleSide}),warm:new THREE.MeshStandardMaterial({color:'#f3d2a1',emissive:'#efa64c',emissiveIntensity:.35}),white:new THREE.MeshStandardMaterial({color:'#f4f1e8',roughness:.4}),panel:new THREE.MeshStandardMaterial({map:makeTexture('panel'),color:'#6d839a',metalness:.45,roughness:.25}),orange:new THREE.MeshBasicMaterial({color:'#ff951c'}),green:new THREE.MeshStandardMaterial({color:'#334b38',roughness:1}),ground:new THREE.MeshStandardMaterial({color:'#384237',roughness:1}),sofa:new THREE.MeshStandardMaterial({color:'#b2a594',roughness:1})};
 const geometries:THREE.BufferGeometry[]=[];
 function box(size:Vec,pos:Vec,mat:THREE.Material,rot?:Vec,parent=root){const g=new THREE.BoxGeometry(...size);geometries.push(g);const m=new THREE.Mesh(g,mat);m.position.set(...pos);if(rot)m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function cylinder(r1:number,r2:number,h:number,pos:Vec,mat:THREE.Material){const g=new THREE.CylinderGeometry(r1,r2,h,16);geometries.push(g);const m=new THREE.Mesh(g,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;root.add(m);return m}
 function line(points:Vec[],radius=.02,parent=root){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.01);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,48,radius,5,false),mats.orange);parent.add(mesh)}
 // Stone plinth, layered terrace and garden island.
 box([13.1,.34,8.6],[.65,-.32,.15],mats.stone);box([12.85,.08,8.35],[.65,-.105,.15],mats.ground);box([9.2,.16,6],[0,.02,.1],mats.stone);
 box([8.6,.13,1.3],[0,.14,3.2],mats.wood);box([4.3,.09,.45],[-1.4,.01,4.05],mats.stone);box([4.3,.07,.4],[-1.4,-.04,4.4],mats.stone);
 // Main living volume: glazed front, solid back, sandstone side.
 box([8,.14,5],[0,.18,0],mats.floor);box([8,2.3,.15],[0,1.35,-2.48],mats.wall);box([.18,2.3,5],[-4,1.35,0],mats.stone);box([.18,2.3,5],[4,1.35,0],mats.wood);
 box([8,.18,.15],[0,2.45,2.49],mats.metal);box([8,.08,.13],[0,.33,2.49],mats.metal);
 for(let i=0;i<7;i++){const x=-3.9+i*1.3;box([.055,2.15,.1],[x,1.39,2.52],mats.metal);if(i<6)box([1.24,2.08,.025],[x+.65,1.39,2.52],mats.glass)}
 // Interior partition, furniture, kitchen island, pendant lighting.
 box([.1,2.05,2.3],[.5,1.3,-1.25],mats.wall);box([.12,2.1,2.4],[-1.25,1.3,-1.25],mats.wood);
 box([2.1,.35,.9],[-2.6,.5,.65],mats.sofa);box([2.1,.65,.22],[-2.6,.72,.2],mats.sofa);box([.2,.48,.9],[-3.57,.57,.65],mats.sofa);box([.2,.48,.9],[-1.62,.57,.65],mats.sofa);box([1.3,.08,.7],[-2.6,.53,1.75],mats.wood);box([.7,.35,.3],[-2.6,.35,1.75],mats.metal);
 box([2.1,.95,.7],[2.4,.78,-1.6],mats.wood);box([2.25,.08,.8],[2.4,1.3,-1.6],mats.white);box([2.8,.65,.55],[2.2,.69,-2.05],mats.wood);box([2.2,.055,.8],[2.4,1.6,-2.37],mats.warm);
 for(let i=0;i<3;i++){cylinder(.22,.21,.07,[1.65+i*.65,.75,-.62],mats.wood);box([.05,.42,.05],[1.65+i*.65,.5,-.62],mats.metal)}
 for(const x of [-2.5,1.8,3.1]){box([.03,.65,.03],[x,2.08,.2],mats.metal);cylinder(.12,.3,.15,[x,1.76,.2],mats.metal);cylinder(.24,.24,.015,[x,1.68,.2],mats.warm)}
 const interiorLight=new THREE.PointLight('#ffd2a0',12,8,2);interiorLight.position.set(0,1.7,1);root.add(interiorLight);
 // Gable roof and end walls.
 const angle=Math.atan2(1.05,2.75);const slope=Math.hypot(2.75,1.05);
 for(const sign of [-1,1])box([8.6,.12,slope],[0,3.03,sign*1.375],mats.roof,[sign*angle,0,0]);
 box([8.64,.09,.12],[0,3.57,0],mats.metal);
 for(const x of [-4.02,4.02]){const shape=new THREE.Shape();shape.moveTo(-2.5,0);shape.lineTo(2.5,0);shape.lineTo(0,1.05);shape.closePath();const g=new THREE.ShapeGeometry(shape);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#9d7e5c',side:THREE.DoubleSide,roughness:.9}));m.rotation.y=Math.PI/2;m.position.set(x,2.5,0);root.add(m)}
 // Solar array on front roof slope, framing and individual modules.
 const solarGroup=new THREE.Group();solarGroup.position.set(-.4,3.06,1.28);solarGroup.rotation.x=angle;root.add(solarGroup);
 for(let row=0;row<2;row++)for(let col=0;col<6;col++){box([1.08,.045,1.15],[-2.88+col*1.15,.06,-.59+row*1.22],mats.metal,undefined,solarGroup);box([1.01,.012,1.075],[-2.88+col*1.15,.09,-.59+row*1.22],mats.panel,undefined,solarGroup)}
 // Flat-roof garage wing and timber shutters.
 box([2.6,2.05,3.6],[5.35,1.25,-.75],mats.stone);box([2.85,.13,3.85],[5.35,2.33,-.75],mats.roof);box([2.15,1.6,.05],[5.35,1.14,1.08],mats.wood);for(let i=0;i<10;i++)box([2.15,.015,.035],[5.35,.43+i*.15,1.12],mats.metal);
 // White battery at the front right, AC and hot water by side wall.
 box([.73,1.32,.23],[3.8,1.05,2.67],mats.white);box([.1,.025,.013],[3.8,1.43,2.795],mats.orange);box([.045,.38,.055],[3.8,.33,2.7],mats.metal);
 box([.38,.76,1.08],[6.83,.67,-.12],mats.white);const fan=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.045,24),mats.metal);fan.rotation.z=Math.PI/2;fan.position.set(7.045,.7,-.12);root.add(fan);for(let i=0;i<7;i++)box([.02,.01,.75],[7.08,.46+i*.07,-.12],mats.white);
 cylinder(.36,.36,1.65,[6.2,.93,-2.75],mats.white);cylinder(.38,.38,.16,[6.2,1.82,-2.75],mats.metal);box([.28,.27,.025],[6.2,1.14,-2.37],mats.metal);
 // Pergola and terrace details.
 for(const x of [-3.9,3.9]){box([.075,2.25,.075],[x,1.29,3.3],mats.metal)}box([8,.09,.1],[0,2.43,3.3],mats.metal);for(let i=0;i<9;i++)box([.06,.07,.8],[-3.9+i*.98,2.44,2.9],mats.wood);
 cylinder(.48,.48,.1,[-.4,.78,3.02],mats.wood);cylinder(.07,.09,.56,[-.4,.47,3.02],mats.metal);
 for(const x of [-1.2,.4]){box([.5,.08,.45],[x,.57,3.08],mats.wood);box([.5,.5,.06],[x,.83,3.3],mats.wood);box([.05,.4,.05],[x,.35,3.08],mats.metal)}
 // Native-style garden canopy, instanced foliage for low draw-call cost.
 const foliage=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),mats.green,110);const matrix=new THREE.Matrix4();const quat=new THREE.Quaternion();const c=new THREE.Color();let seed=105;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647};
 for(let i=0;i<110;i++){let x=(rand()-.5)*11.2+.5;let z=(rand()-.5)*7.8+.15;if(Math.abs(x)<4.4&&z<3.6&&z>-2.9){x=x<0?-5:7;z=(rand()-.5)*7}const r=.12+rand()*.25;matrix.compose(new THREE.Vector3(x,r*.55,z),quat,new THREE.Vector3(r,r*.9,r));foliage.setMatrixAt(i,matrix);c.setHSL(.23+rand()*.12,.12+rand()*.25,.12+rand()*.12);foliage.setColorAt(i,c)}foliage.castShadow=true;root.add(foliage);
 const leafGeo=new THREE.IcosahedronGeometry(1,2);const leaves=new THREE.InstancedMesh(leafGeo,mats.green,135);let leafIndex=0;
 for(const [x,z] of [[-5.1,-2.8],[-5.25,1.8],[7,2.8]]){
  cylinder(.045,.09,1.8,[x,.9,z],mats.wood);
  for(let j=0;j<45;j++){const theta=rand()*Math.PI*2;const spread=Math.sqrt(rand())*.73;const y=1.55+rand()*1.15;const r=.16+rand()*.14;matrix.compose(new THREE.Vector3(x+Math.cos(theta)*spread,y,z+Math.sin(theta)*spread),quat,new THREE.Vector3(r*1.25,r*.8,r));leaves.setMatrixAt(leafIndex,matrix);c.setHSL(.25+rand()*.1,.15+rand()*.25,.12+rand()*.1);leaves.setColorAt(leafIndex++,c)}
 }
 leaves.castShadow=true;root.add(leaves);
 for(const [x,z] of [[-4.8,3.6],[5.8,3],[7,-2.8],[-4.9,-3.4]]){cylinder(.06,.06,.45,[x,.2,z],mats.metal);cylinder(.065,.065,.04,[x,.45,z],mats.orange)}
 // Visible energy path: solar roof -> battery -> house.
 line([[-2.6,3.25,.95],[-2.6,2.93,1.75],[-2.6,2.53,2.8],[3.8,2.53,2.8],[3.8,1.77,2.8],[3.8,.33,2.8],[1.3,.33,2.8]],.018,energy);
 return {root,energy};
}
function Scene({active,paused}:{active:ServiceId;paused:boolean}){
 const {root,energy}=useMemo(buildHome,[]);const group=useRef<THREE.Group>(null);const {camera,size,pointer,invalidate}=useThree();const time=useRef(0);
 const views:Record<ServiceId,Vec>={solar:[11,9,15],battery:[13,6.5,13],comfort:[15,7,9],water:[15,8,4]};
 const target=useMemo(()=>new THREE.Vector3(...views[active]),[active]);
 useEffect(()=>{const c=camera as THREE.OrthographicCamera;c.zoom=Math.min(size.width/(size.width<650?16:19),size.height/9.4);c.updateProjectionMatrix();invalidate()},[size,camera,invalidate]);
 useFrame((_,delta)=>{const d=Math.min(delta,.05);time.current+=d;const p=target.clone();if(!paused&&size.width>650){p.x+=pointer.x*.32;p.y+=pointer.y*.16}if(paused)camera.position.copy(target);else camera.position.lerp(p,1-Math.exp(-d*2.5));camera.lookAt(.55,1.05,.2);if(group.current){group.current.rotation.y=paused?0:Math.sin(time.current*.22)*.045;group.current.position.y=paused?0:Math.sin(time.current*.5)*.03}energy.visible=active==='solar'||active==='battery';if(!paused||camera.position.distanceTo(target)>.005)invalidate()});
 return <><ambientLight intensity={.28}/><hemisphereLight args={['#b7cee9','#68513d',.7]}/><directionalLight position={[5,9,6]} intensity={1.9} color="#ffe1b6" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-normalBias={.035}/><directionalLight position={[-8,6,-5]} intensity={.65} color="#9dbaf7"/>
 <Environment resolution={128} frames={1}><Lightformer intensity={.85} color="#dae8ff" position={[0,8,0]} rotation={[Math.PI/2,0,0]} scale={[14,14,1]}/><Lightformer intensity={.85} color="#ffc885" position={[8,3,5]} scale={[8,4,1]}/></Environment>
 <group ref={group}><primitive object={root}/></group></>
}
export default function HomeScene({active,paused,visible}:{active:ServiceId;paused:boolean;visible:boolean}){
 const [lost,setLost]=useState(false);
 const [supported]=useState(()=>{try{const c=document.createElement('canvas');const context=c.getContext('webgl2');if(!context)return false;context.getExtension('WEBGL_lose_context')?.loseContext();return true}catch{return false}});
 if(!supported||lost)return <div className="scene-fallback" role="img" aria-label="Solar powered home at dusk"/>;
 return <Canvas orthographic camera={{position:[11,9,15],zoom:55,near:.1,far:100}} frameloop={visible?'demand':'never'} dpr={[1,1.5]} shadows gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>{gl.setClearColor(0x000000,0);gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.0;gl.domElement.setAttribute('aria-hidden','true');gl.domElement.addEventListener('webglcontextlost',()=>setLost(true))}}><Scene active={active} paused={paused}/></Canvas>
}
