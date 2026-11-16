import {jsPDF} from 'jspdf'
import type {ChackraParcel,ChackraSpatialPlan} from './ChackraZonePlan'
import type {GeoPolygon} from './rotationZones'
import {printableGeometry} from './campaignPlan'
import {monthStatus} from './planStatus'

/** Vector map and selectable text, with explicit page margins and page breaks. */
export function createPlanPdf(plan:ChackraSpatialPlan,field:GeoPolygon,zones:ChackraParcel[],lang:'es'|'en'){
 const es=lang==='es',doc=new jsPDF({unit:'mm',format:'a4'}),margin=18,width=174
 let y=margin
 const clean=(s:string)=>s.replace(/[\u{1F000}-\u{1FFFF}\u2600-\u27ff]/gu,'').replace(/[–—]/g,'-').replace(/→/g,'>')
 function page(){doc.addPage();y=margin}
 function text(value:string,size=11,bold=false){
  doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(24,48,31)
  const lines=doc.splitTextToSize(clean(value),width) as string[]
  for(const line of lines){if(y+6>279)page();doc.text(line,margin,y);y+=size*.46+1}
  y+=2
 }
 function title(value:string){if(y+25>279)page();text(value,16,true)}
 doc.setFillColor(5,8,6);doc.rect(0,0,210,36,'F');doc.setTextColor(214,248,102);doc.setFontSize(23);doc.text('CHACKRA X',margin,23);y=48
 title(es?'Mi plan agrícola por zonas':'My zone planting plan')
 text((es?'Superficie aproximada del terreno: ':'Approximate field area: ')+plan.parcel_area_ha.toFixed(2)+' ha')
 text((es?'Zonas sembradas: ':'Planted zones: ')+plan.zone_plans.length+' · '+new Date().toLocaleDateString(es?'es-PE':'en-US'))
 const geometry=printableGeometry(field,zones),mapY=y,scale=width/600
 function polygon(value:string,fill:boolean){
  const p=value.split(' ').map(pair=>pair.split(',').map(Number));if(!p.length)return
  doc.lines(p.slice(1).map((v,i)=>[(v[0]-p[i][0])*scale,(v[1]-p[i][1])*scale]),margin+p[0][0]*scale,mapY+p[0][1]*scale,[1,1],fill?'FD':'S',true)
 }
 doc.setDrawColor(54,92,56);doc.setLineWidth(.6);polygon(geometry.field,false)
 geometry.subplots.forEach((shape,i)=>{doc.setFillColor(180+(i*17)%60,210-(i*13)%50,150+(i*19)%70);polygon(shape,true);const points=shape.split(' ').map(pair=>pair.split(',').map(Number));doc.setFontSize(12);doc.setTextColor(24,48,31);doc.text(String.fromCharCode(65+i),margin+points.reduce((sum,p)=>sum+p[0],0)/points.length*scale,mapY+points.reduce((sum,p)=>sum+p[1],0)/points.length*scale)})
 y+=340*scale+8;text(es?'Croquis de polígonos declarados; no es un levantamiento catastral.':'Declared polygons; not a cadastral survey.',9)
 plan.zone_plans.forEach((z,i)=>text(String.fromCharCode(65+i)+' · '+z.area_ha.toFixed(2)+' ha · '+(es?z.current_crop:z.current_crop_en||z.current_crop),10))
 text(es?'Las áreas exteriores a los polígonos no cuentan como zonas sembradas.':'Land outside the polygons is not counted as planted.',9)
 for(const [i,z] of plan.zone_plans.entries()){
  page();title((es?'Zona ':'Area ')+String.fromCharCode(65+i)+' · '+z.area_ha.toFixed(2)+' ha')
  text((es?'Cultivo actual: ':'Current crop: ')+(es?z.current_crop:z.current_crop_en||z.current_crop),12,true)
  if(z.planted_month)text((es?'Siembra declarada: ':'Declared sowing: ')+z.planted_month)
  text((es?'Próximo cultivo: ':'Next crop: ')+(es?z.suggested_crop:z.suggested_crop_en||z.suggested_crop),12,true)
  text((es?'Siembra orientativa: ':'Reference sowing: ')+(es?z.sow_label_es:z.sow_label_en||z.sow_label_es))
  text(es?z.why_es:z.why_en||z.why_es)
  title(es?'Preparación paso a paso':'Preparation steps')
  ;(es?z.how_es:z.how_en||z.how_es).forEach((step,j)=>text((j+1)+'. '+step))
  text(es?plan.disclaimer_es:plan.disclaimer_en||plan.disclaimer_es,10)
  text((es?'Referencias: ':'References: ')+z.source_tags.join(' · '),9)
 }
 page();title(es?'Calendario por zona':'Calendar by area')
 if(plan.plan_start_month&&plan.planning_months){
  const [year,month]=plan.plan_start_month.split('-').map(Number)
  for(let i=0;i<plan.planning_months;i++){
   const date=new Date(Date.UTC(year,month-1+i,1)),iso=date.toISOString().slice(0,7)
   const rows=plan.zone_plans.map((z,j)=>{const state=monthStatus(z,iso,es);return String.fromCharCode(65+j)+': '+state.label+' - '+state.state})
   if(y+12+rows.length*14>279)page()
   text(date.toLocaleDateString(es?'es-PE':'en-US',{month:'long',year:'numeric',timeZone:'UTC'}),12,true)
   rows.forEach(row=>text(row,10))
  }
 }
 page();title(es?'Fuentes y limitaciones':'Sources and limitations')
 text(es?plan.disclaimer_es:plan.disclaimer_en||plan.disclaimer_es)
 text('NASA POWER: '+plan.climate_status+' · NASA HLS: '+plan.ai_status)
 ;(es?plan.sources:plan.sources_en||plan.sources).forEach(source=>text(source,10))
 text(es?'Crecimiento estimado por duración de catálogo; no confirma el estado real del cultivo. Un mes sin programación no implica descanso planificado.':'Growth is estimated from catalog duration; it does not confirm actual crop status. An unscheduled month does not imply planned fallow.',10)
 text(window.location.origin+'/fuentes',10)
 for(let i=1;i<=doc.getNumberOfPages();i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(90);doc.text('CHACKRA X · NASA Space Apps Challenge 2026 · Field Shift',margin,288);doc.text(i+' / '+doc.getNumberOfPages(),180,288)}
 return new File([doc.output('blob')],'CHACKRA-X-plan.pdf',{type:'application/pdf'})
}
