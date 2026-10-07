import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Native scrolling drives the reveal; no wheel/touch interception or scroll lock. */
export function useHeroReveal(story: RefObject<HTMLDivElement | null>) {
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const root=story.current;if(!root)return;
  let frame=0;let previous=false;
  const update=()=>{
   frame=0;
   const height=root.querySelector<HTMLElement>('.hero')?.offsetHeight||window.innerHeight;
   const progress=Math.max(0,Math.min(1,-root.getBoundingClientRect().top/(height*.58)));
   root.style.setProperty('--hero-progress',String(progress));
   root.style.setProperty('--copy-opacity',String(Math.max(0,Math.min(1,(progress-.06)/.52))));
   root.style.setProperty('--card-opacity',String(Math.max(0,Math.min(1,(progress-.2)/.62))));
   const next=progress>.28;
   if(next!==previous){previous=next;setReady(next)}
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue)};
 },[story]);
 return ready;
}
