import type {GeoPolygon} from './rotationZones'
import type {ChackraSpatialPlan} from './ChackraZonePlan'
import {approximatePolygonHectares,validateSubplotLayout} from './geometry.ts'

export type RecordedZone={id:string;polygon:GeoPolygon|null;crop_id:string;planted_month:string}
const points=(p:GeoPolygon)=>p.coordinates[0].slice(0,-1).map(([lng,lat])=>({lat,lng}))

/** Compatibility with the deployed engine, which requires assigning the remainder.
 * Recommendations depend on crop/date and whole-field climate, not zone area.
 * Ask the unchanged engine for each distinct crop/date in that SAME field.
 * Only IDs, approximate declared area and declared planting month are attached
 * to its returned advice. Never create an advice row for unplanted remainder.
 */
export async function prepareZonePlan(field:GeoPolygon,zones:RecordedZone[],months:number,
 request:(body:unknown)=>Promise<ChackraSpatialPlan>):Promise<ChackraSpatialPlan>{
 if(!zones.length||new Set(zones.map(z=>z.id)).size!==zones.length)throw Error('Revisa las zonas de cultivo.')
 if(zones.some(z=>!/^\d{4}-(0[1-9]|1[0-2])$/.test(z.planted_month)||z.planted_month<'2000-01'||z.planted_month>new Date().toISOString().slice(0,7)))throw Error('Revisa el mes de siembra: debe ser actual o anterior, desde enero de 2000.')
 if(zones.some(z=>!z.polygon)&&(zones.length!==1||zones[0].id!=='rest'))throw Error('Faltan límites de zona.')
 const check=validateSubplotLayout(points(field),zones.filter(z=>z.polygon).map(z=>({id:z.id,points:points(z.polygon!)})))
 if(!check.valid)throw Error('Las zonas deben estar dentro del terreno y no superponerse.')
 const cache=new Map<string,ChackraSpatialPlan>()
 const output=[]
 let reference:ChackraSpatialPlan|undefined
 for(const zone of zones){
  const key=zone.crop_id+'|'+zone.planted_month
  let data=cache.get(key)
  if(!data){
   data=await request({polygon:field,planning_months:months,zones:[{id:'rest',crop_id:zone.crop_id,planted_month:zone.planted_month}]})
   if(data.status!=='prepared'||data.zone_plans?.length!==1||data.zone_plans[0].current_crop_id!==zone.crop_id)throw Error('La respuesta del plan necesita revisión.')
   if(reference&&(data.plan_start_month!==reference.plan_start_month||data.planning_months!==reference.planning_months))throw Error('El periodo cambió durante la consulta. Vuelve a crear el plan.')
   cache.set(key,data)
  }
  reference??=data
  output.push({...data.zone_plans[0],zone_id:zone.id,area_ha:zone.polygon?approximatePolygonHectares(points(zone.polygon)):data.parcel_area_ha,planted_month:zone.planted_month})
 }
 return {...reference!,zone_plans:output,climate_status:[...cache.values()].every(p=>p.climate_status==='nasa_power_reference')?'nasa_power_reference':'reference_rules'}
}
