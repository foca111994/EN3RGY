import { useRef } from 'react';
import type { ServiceId } from './data';
const spots: {id:ServiceId;label:string;x:string;y:string}[]=[
 {id:'solar',label:'Solar power',x:'43%',y:'28%'},
 {id:'battery',label:'Battery storage',x:'70%',y:'61%'},
 {id:'comfort',label:'Home comfort',x:'31%',y:'62%'},
 {id:'water',label:'Hot water',x:'82%',y:'55%'}
];
export default function HeroScene({active,paused,onSelect}:{active:ServiceId;paused:boolean;onSelect:(id:ServiceId)=>void}){
 const layer=useRef<HTMLDivElement>(null);
 return <div className={`scene ${paused?'is-paused':''}`} onPointerMove={e=>{if(paused||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();layer.current?.style.setProperty('--px',`${((e.clientX-r.left)/r.width-.5)*10}px`);layer.current?.style.setProperty('--py',`${((e.clientY-r.top)/r.height-.5)*6}px`)}} onPointerLeave={()=>{layer.current?.style.setProperty('--px','0px');layer.current?.style.setProperty('--py','0px')}}>
 <div className="house-parallax" ref={layer}><div className="house-float"><img className="hero-house" src="/images/hero-house.webp" alt="Illustrative solar-powered home with a battery, warm interiors and landscaped garden at dusk" width="1536" height="1024" fetchPriority="high"/>
 <div className="hotspots">{spots.map(s=><button key={s.id} style={{left:s.x,top:s.y}} className={`hotspot ${active===s.id?'selected':''}`} onClick={()=>onSelect(s.id)} aria-label={`Explore ${s.label}`} aria-pressed={active===s.id}><span className="hotspot-dot"/><span className="hotspot-label">{s.label}</span></button>)}</div>
 </div></div></div>
}
