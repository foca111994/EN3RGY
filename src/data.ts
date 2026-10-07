export const QUOTE_URL = 'https://new.easybook.au/#easy-quote';
export const SERVICE_URL = 'https://new.easybook.au/#service';
export const PHONE = 'tel:+61882946333';
export const services = [
 {id:'solar', label:'Solar', title:'Solar power', short:'A brighter way to power your day.', description:'Turn Adelaide sunshine into energy for your home. Explore a system designed around your roof, your routine and the way you use power.', url:'https://en3rgy.au/solar-systems-adelaide-we-repair-and-install/'},
 {id:'battery', label:'Battery', title:'Battery storage', short:'Your solar. Ready when you need it.', description:'Store more of the energy you generate and use it later. Find a battery solution that works with your home and your solar system.', url:'https://en3rgy.au/solar-battery-storage-adelaide/'},
 {id:'comfort', label:'Comfort', title:'Air conditioning', short:'Feel at home, in every season.', description:'From split systems to whole-home cooling and heating, explore practical ways to make your space comfortable throughout the year.', url:'https://en3rgy.au/air-conditioning-repair-and-service-adelaide/'},
 {id:'water', label:'Hot water', title:'Hot water', short:'Everyday comfort. Smarter energy.', description:'Explore heat pump and hot water options to find the right fit for your household, your space and your everyday needs.', url:'https://en3rgy.au/hot-water-systems-adelaide-install-repair-service/'}
] as const;
export type ServiceId = typeof services[number]['id'];
