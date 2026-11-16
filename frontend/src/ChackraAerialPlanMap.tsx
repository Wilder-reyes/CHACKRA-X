import {monthStatus} from './planStatus'
/** Full satellite/aerial context behind the real field outline and suggested crops.
 * The Barranca ML model stays limited to its research polygon; the imagery here
 * is cartographic, not a crop-classification output.
 */
import {useEffect} from 'react'
import {MapContainer,Polygon,TileLayer,Tooltip,useMap} from 'react-leaflet'
import type {GeoPolygon} from './rotationZones'
import type {ChackraParcel,ChackraSpatialPlan,ChackraZoneAdvice} from './ChackraZonePlan'
import {zoneLabel,displayMonth} from './ChackraRotationTimeline'
import {cropVisual} from './chackraCropVisuals'
const points=(p:GeoPolygon)=>p.coordinates[0].slice(0,-1).map(([lng,lat])=>[lat,lng] as [number,number])
function Frame({field}:{field:GeoPolygon}){
 const map=useMap()
 useEffect(()=>{map.fitBounds(points(field),{padding:[24,24],maxZoom:20,animate:false})},[map,field])
 return null
}
function cropFor(row:ChackraZoneAdvice|undefined,month:string|undefined,lang:'es'|'en'){
 if(!row)return {color:'#92a58c',label:lang==='es'?'Sin registro':'Not recorded',icon:'🌱'}
 if(month){const state=monthStatus(row,month,lang==='es'),visual=cropVisual(state.crop_id);return {color:state.crop_id?visual.color:'#68736b',label:state.label+' · '+state.state,icon:state.crop_id?visual.icon:'—'}}
 const visual=cropVisual(row.suggested_crop_id)
 return {color:visual.color,label:lang==='es'?row.suggested_crop:row.suggested_crop_en||row.suggested_crop,icon:visual.icon}
}
export default function ChackraAerialPlanMap({field,subplots,plan,month,lang}:{
 field:GeoPolygon;subplots:ChackraParcel[];plan:ChackraSpatialPlan;month?:string;lang:'es'|'en'
}){
 const es=lang==='es'
 const coordinates=points(field),centre={lat:coordinates.reduce((a,p)=>a+p[0],0)/coordinates.length,lng:coordinates.reduce((a,p)=>a+p[1],0)/coordinates.length}
 const remainder=plan.zone_plans.find(r=>r.zone_id==='rest')
 const rem=cropFor(remainder,month,lang)
 return <figure className="chackra-aerial-plan" aria-label={es?'Tu terreno en la fotografía aérea con cultivos por zonas':'Your field on the aerial imagery with crops by area'}>
  <div className="chackra-aerial-heading">
   <div><strong>{es?'Mi terreno desde arriba':'My field from above'}</strong>
    <p>{es?'La misma parcela, con colores para distinguir los cultivos de cada zona.':'The same field, color-coded by the crops in each area.'}</p></div>
   <span>{month?displayMonth(month,lang)+' '+month.slice(0,4):''}</span>
  </div>
  <div className="chackra-aerial-frame">
   <MapContainer maxZoom={21} key={field.coordinates[0].map(p=>p.join(',')).join(';')} center={[centre.lat,centre.lng]} zoom={14} className="chackra-aerial-map" scrollWheelZoom={false}>
    <TileLayer maxNativeZoom={17} maxZoom={21} attribution="Imagery © Esri, Maxar, Earthstar Geographics" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
    <Frame field={field}/>
    <Polygon positions={coordinates} pathOptions={{color:'#D6F866',weight:5,fillColor:rem.color,fillOpacity:remainder?.2:0}}>
     {remainder&&subplots.length===0&&<Tooltip permanent direction="center" className="chackra-crop-map-label">{rem.icon} {rem.label}</Tooltip>}
    </Polygon>
    {subplots.map((zone,i)=>{
     const row=plan.zone_plans.find(r=>r.zone_id===zone.id),v=cropFor(row,month,lang)
     return <Polygon key={zone.id} positions={points(zone.polygon)} pathOptions={{color:['#A3D99D','#E9B56D','#8CB9E1','#D0A4E8'][i%4],weight:4,fillColor:v.color,fillOpacity:.71}}>
      <Tooltip permanent direction="center" className="chackra-crop-map-label">{zoneLabel(zone.id,es,i)} · {v.icon}</Tooltip>
     </Polygon>
    })}
   </MapContainer>
  </div>
  <figcaption>{es?'El contorno muestra el terreno que seleccionaste.':'The outline is the field you selected.'}{subplots.map((zone,i)=>{const v=cropFor(plan.zone_plans.find(r=>r.zone_id===zone.id),month,lang);return <span key={zone.id} style={{display:'block'}}>{zoneLabel(zone.id,es,i)}: {v.label}</span>})}</figcaption>
 </figure>
}
