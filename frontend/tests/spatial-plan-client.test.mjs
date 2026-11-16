import test from 'node:test'
import assert from 'node:assert/strict'
import {prepareZonePlan} from '../src/spatialPlanClient.ts'
import {monthStatus} from '../src/planStatus.ts'
const polygon=(x,y,w=.001)=>({type:'Polygon',coordinates:[[[x,y],[x+w,y],[x+w,y+w],[x,y+w],[x,y]]]})
const field=polygon(-77,-11,.01)
const row={zone_id:'rest',current_crop_id:'camote',current_crop:'Camote',suggested_crop_id:'vainita',suggested_crop:'Vainita',campaigns:[{crop_id:'vainita',crop_es:'Vainita',crop_en:'Green bean',sow_month:'2027-02',end_month:'2027-05'}]}
const response={status:'prepared',parcel_area_ha:120,plan_start_month:'2026-11',planning_months:12,climate_status:'nasa_power_reference',zone_plans:[row]}
test('three explicit zones stay three zones; same crop/month is valid and reuses the engine request',async()=>{
 const calls=[]
 const zones=[0,1,2].map(i=>({id:'area-'+i,polygon:polygon(-76.999+i*.002,-10.999),crop_id:'camote',planted_month:'2026-11'}))
 const result=await prepareZonePlan(field,zones,12,async body=>{calls.push(body);return response})
 assert.equal(calls.length,1)
 assert.deepEqual(calls[0].polygon,field,'the scientific engine must retain the whole-field context')
 assert.equal(result.zone_plans.length,3)
 assert.ok(result.zone_plans.every(z=>z.zone_id!=='rest'&&z.area_ha<2))
 assert.ok(result.zone_plans.every(z=>z.suggested_crop===row.suggested_crop))
 assert.ok(result.zone_plans.reduce((s,z)=>s+z.area_ha,0)<result.parcel_area_ha)
})
test('overlap/outside are rejected before contacting the engine',async()=>{
 let calls=0
 const zone={id:'A',polygon:polygon(-76.999,-10.999),crop_id:'camote',planted_month:'2026-11'}
 await assert.rejects(()=>prepareZonePlan(field,[zone,{...zone,id:'B'}],12,async()=>{calls++;return response}))
 await assert.rejects(()=>prepareZonePlan(field,[{...zone,polygon:polygon(0,0)}],12,async()=>{calls++;return response}))
 assert.equal(calls,0)
})
test('API failures never become a fabricated successful plan',async()=>{
 await assert.rejects(()=>prepareZonePlan(field,[{id:'rest',polygon:null,crop_id:'camote',planted_month:'2026-11'}],12,async()=>{throw Error('offline')}),/offline/)
})
test('calendar distinguishes estimated current growth, next sowing, ongoing growth and unconfirmed gaps',()=>{
 const zone={...row,planted_month:'2026-11'}
 assert.match(monthStatus(zone,'2026-11').state,/Cultivo actual/)
 assert.equal(monthStatus(zone,'2027-02').state,'Próxima siembra')
 assert.equal(monthStatus(zone,'2027-03').state,'En crecimiento estimado')
 assert.equal(monthStatus(zone,'2027-10').label,'Mes sin programación confirmada')
 assert.match(monthStatus(zone,'2027-10').state,/No implica descanso/)
})
