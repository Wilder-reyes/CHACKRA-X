import {monthStatus} from './planStatus'
import type {ChackraSpatialPlan,ChackraZoneAdvice} from './ChackraZonePlan'
import {cropVisual} from './chackraCropVisuals'

export function addPlanMonths(iso:string,amount:number):string{
 const [y,m]=iso.split('-').map(Number)
 const d=new Date(Date.UTC(y,m-1+amount,1))
 return String(d.getUTCFullYear())+'-'+String(d.getUTCMonth()+1).padStart(2,'0')
}
export function planMonths(plan:ChackraSpatialPlan):string[]{
 if(!plan.plan_start_month||!plan.planning_months)return []
 return Array.from({length:Math.max(0,Math.min(60,plan.planning_months))},(_,i)=>addPlanMonths(plan.plan_start_month!,i))
}
export function campaignAt(zone:ChackraZoneAdvice,month:string){
 return zone.campaigns?.find(c=>c.sow_month<=month&&month<c.end_month)
}
export function displayMonth(iso:string,lang:'es'|'en'){
 const date=new Date(iso+'-01T00:00:00Z')
 return date.toLocaleDateString(lang==='es'?'es-PE':'en-US',{month:'short',timeZone:'UTC'})
}
export function zoneLabel(id:string,es:boolean,index:number):string{
 const suffix=String.fromCharCode(65+Math.min(index,25))
 return (es?'Zona ':'Area ')+suffix
}
export function quarterMonths(yearMonths:string[],quarter:number){
 return yearMonths.filter(month=>Math.floor((Number(month.slice(5,7))-1)/3)===quarter)
}
export function quarterName(quarter:number,lang:'es'|'en'){
 const names=lang==='es'?['Ene–Mar','Abr–Jun','Jul–Set','Oct–Dic']:['Jan–Mar','Apr–Jun','Jul–Sep','Oct–Dec']
 return names[quarter]
}
export function quarterCrops(zone:ChackraZoneAdvice,months:string[]){
 const map=new Map<string,{crop_id:string;label:string;label_en:string;when:string;continues:boolean}>()
 for(const month of months){
  const campaign=campaignAt(zone,month)
  if(campaign&&!map.has(campaign.sow_month)){
   map.set(campaign.sow_month,{crop_id:campaign.crop_id,label:campaign.crop_es,label_en:campaign.crop_en,when:campaign.sow_month,continues:!months.includes(campaign.sow_month)})
  }
 }
 return [...map.values()]
}
export default function ChackraRotationTimeline({plan,lang,monthIndex,onMonth}:{
 plan:ChackraSpatialPlan;lang:'es'|'en';monthIndex:number;onMonth:(v:number)=>void
}){
 const months=planMonths(plan)
 if(!months.length)return null
 const es=lang==='es',activeIndex=Math.max(0,Math.min(monthIndex,months.length-1))
 const current=months[activeIndex],activeYear=current.slice(0,4)
 const years=[...new Set(months.map(m=>m.slice(0,4)))]
 const yearMonths=months.filter(m=>m.startsWith(activeYear))
 const select=(month:string)=>{const index=months.indexOf(month);if(index>=0)onMonth(index)}
 return <section className="chackra-calendar chackra-calendar-v3" aria-label={es?'Calendario de cultivos por zonas':'Crop calendar by area'}>
  <header className="chackra-calendar-intro">
   <div><span className="b-eyebrow">{es?'MI PLAN DE SIEMBRA':'MY PLANTING PLAN'}</span>
    <h2>{es?'¿Qué podría sembrar en cada zona?':'What could I plant in each area?'}</h2>
    <p>{es?'Explora cada año y elige un mes. El mapa de arriba cambia para mostrar tus próximas opciones.':'Explore each year and choose a month. The map above changes to show your next options.'}</p></div>
   <div className="chackra-calendar-active"><span>{es?'ESTÁS VIENDO':'YOU ARE VIEWING'}</span><strong>{displayMonth(current,lang)} {activeYear}</strong></div>
  </header>
  <nav className="chackra-calendar-years" aria-label={es?'Elegir año':'Choose year'}>
   {years.map(year=><button type="button" key={year} aria-pressed={activeYear===year} onClick={()=>select(months.find(m=>m.startsWith(year))!)}>{year}</button>)}
  </nav>
  <div className="chackra-calendar-months" role="group" aria-label={es?'Elegir mes para el mapa':'Choose month for map'}>
   {yearMonths.map(month=><button type="button" key={month} className={current===month?'selected':''} aria-pressed={current===month} onClick={()=>select(month)}>{displayMonth(month,lang).replace('.','')}</button>)}
  </div>
  <div className="chackra-month-status" aria-live="polite">{plan.zone_plans.map((zone,i)=>{const state=monthStatus(zone,current,es);return <div key={zone.zone_id}><strong>{zoneLabel(zone.zone_id,es,i)} · {state.label}</strong><small>{state.state}</small></div>})}</div>
  <div className="chackra-quarters" role="table" aria-label={es?'Cultivos organizados por trimestres':'Crops by quarter'}>
   <div className="chackra-quarter-heading" role="row"><div role="columnheader">{es?'TUS ZONAS':'YOUR AREAS'}</div>{[0,1,2,3].map(q=><div key={q} role="columnheader">{quarterName(q,lang)}</div>)}</div>
   {plan.zone_plans.map((zone,index)=><div className="chackra-quarter-row" role="row" key={zone.zone_id}>
    <div className="chackra-quarter-zone" role="rowheader">{zoneLabel(zone.zone_id,es,index)}<small>{es?'Antes':'Previously'}: {es?zone.current_crop:zone.current_crop_en||zone.current_crop}</small></div>
    {[0,1,2,3].map(quarter=>{
     const qMonths=quarterMonths(yearMonths,quarter),values=quarterCrops(zone,qMonths)
     return <div className="chackra-quarter-cell" role="cell" key={quarter}>
      <span className="chackra-quarter-period">{quarterName(quarter,lang)}</span>
      {qMonths.length===0?<span className="chackra-quarter-muted">—</span>:values.length?values.map(c=>{const visual=cropVisual(c.crop_id);return <div key={c.when} className="chackra-quarter-crop" style={{background:visual.color}}>
       <span>{visual.icon}</span><strong>{es?c.label:c.label_en}</strong><small>{c.continues?(es?'Continúa':'Ongoing'):displayMonth(c.when,lang).replace('.','')}</small>
      </div>}):<div className="chackra-quarter-empty">{es?'Meses sin programación confirmada':'Months without confirmed schedule'}<small>{es?'Verifica la fecha de cosecha y la ventana de siembra local.':'Check harvest date and local sowing window.'}</small></div>}
     </div>
    })}
   </div>)}
  </div>
  <div className="chackra-calendar-legend" aria-live="polite">{plan.zone_plans.map((zone,i)=>{
   const currentCrop=campaignAt(zone,current),visual=cropVisual(currentCrop?.crop_id||zone.current_crop_id)
   return <span key={zone.zone_id}><i style={{background:visual.color}}/>{zoneLabel(zone.zone_id,es,i)}: <strong>{currentCrop?(es?currentCrop.crop_es:currentCrop.crop_en):((es?'Sin programación · último cultivo: ':'Unscheduled · last grown: ')+(es?zone.current_crop:zone.current_crop_en||zone.current_crop))}</strong></span>
  })}</div>
  <p className="sr-only">{es?'Consulta las fuentes y limitaciones del plan en la página Fuentes.':'See sources and limitations on the Sources page.'}</p>
 </section>
}