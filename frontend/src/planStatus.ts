import type {ChackraZoneAdvice} from './ChackraZonePlan'
import cycles from './currentCropCycles.json' with {type:'json'}

/** Month-level reference stages, never a remotely observed growth state. */
export function monthStatus(zone:ChackraZoneAdvice,month:string,es=true){
 const campaign=zone.campaigns?.find(c=>c.sow_month<=month&&month<c.end_month)
 if(campaign)return {crop_id:campaign.crop_id,label:es?campaign.crop_es:campaign.crop_en,state:campaign.sow_month===month?(es?'Próxima siembra':'Next sowing'):(es?'En crecimiento estimado':'Estimated growth')}
 const days=(cycles as Record<string,number>)[zone.current_crop_id]
 if(zone.planted_month&&days){
  const [y,m]=zone.planted_month.split('-').map(Number)
  const end=new Date(Date.UTC(y,m-1,1)+days*86400000).toISOString().slice(0,7)
  if(zone.planted_month<=month&&month<=end)return {crop_id:zone.current_crop_id,label:es?zone.current_crop:zone.current_crop_en||zone.current_crop,state:es?'Cultivo actual · crecimiento estimado':'Current crop · estimated growth'}
 }
 return {crop_id:'',label:es?'Mes sin programación confirmada':'No confirmed schedule',state:es?'No implica descanso planificado':'Does not imply planned fallow'}
}
