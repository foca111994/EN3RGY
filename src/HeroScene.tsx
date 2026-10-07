import { useRef } from 'react';
import { ArrowUpRight, BatteryCharging, Sun, Wind, Droplets } from 'lucide-react';
import type { ServiceId } from './data';
const spots=[
 {id:'solar',label:'Solar power',description:'Turn sunshine into a smarter home.',Icon:Sun},
 {id:'battery',label:'Battery',description:'Store your sunshine for later.',Icon:BatteryCharging},
 {id:'comfort',label:'Comfort',description:'Feel at home in every season.',Icon:Wind},
 {id:'water',label:'Hot water',description:'Smarter everyday comfort.',Icon:Droplets}
] as const;
export default function HeroScene({active,paused,ready,onSelect}:{active:ServiceId;paused:boolean;ready:boolean;onSelect:(id:ServiceId)=>void}){
 const layer=useRef<HTMLDivElement>(null);
 return <>
 <div className={`scene ${paused?'is-paused':''}`} onPointerMove={e=>{if(paused||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();layer.current?.style.setProperty('--px',`${((e.clientX-r.left)/r.width-.5)*10}px`);layer.current?.style.setProperty('--py',`${((e.clientY-r.top)/r.height-.5)*6}px`)}} onPointerLeave={()=>{layer.current?.style.setProperty('--px','0px');layer.current?.style.setProperty('--py','0px')}}>
  <div className="house-position"><div className="house-parallax" ref={layer}><div className="house-float"><img className="hero-house" src="/images/hero-house.webp" alt="Illustrative solar-powered home with a battery, warm interiors and landscaped garden at dusk" width="1536" height="1024" fetchPriority="high"/></div></div></div>
 </div>
 <div className="spot-overlay" inert={!ready} aria-hidden={!ready}>
 {spots.map(({id,label,description,Icon})=><button key={id} className={`hotspot hotspot-${id} ${active===id?'selected':''}`} onClick={()=>onSelect(id)} aria-label={`Explore ${id==='battery'?'Battery storage':id==='comfort'?'Home comfort':label}`} aria-pressed={active===id}>
  <span className="hotspot-heading"><Icon size={16}/><strong>{label}</strong><span className="hotspot-dot"/></span>
  <span className="hotspot-description">{description}</span><span className="hotspot-more">Explore your home <ArrowUpRight size={12}/></span>
 </button>)}
 </div>
 </>
}
