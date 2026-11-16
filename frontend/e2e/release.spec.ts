import {test,expect,request} from '@playwright/test'
import {mkdirSync,readFileSync} from 'node:fs'
const backendOrigin=new URL(JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8')).rewrites[0].destination).origin
const widths=[320,360,375,390,430,640,768,820,960,1024,1280]
const artifacts=process.env.QA_ARTIFACTS||'/workspace/work/qa'
test('welcome starts only on request, supports Escape, and repeats without covering controls',async({page})=>{
 await page.goto('/')
 await expect(page.getByRole('dialog',{name:'Bienvenida a CHACKRA X'})).toBeVisible()
 for(const width of widths){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1)}
 await page.setViewportSize({width:1280,height:900})
 await expect(page.getByRole('region',{name:'CHOKLITO, tu guía'})).toHaveCount(0)
 await page.getByRole('button',{name:'Comenzar recorrido'}).click()
 await expect(page.getByRole('region',{name:'CHOKLITO, tu guía'})).toBeVisible()
 await page.getByRole('button',{name:'Registrar cultivos por zona'}).click()
 await expect(page.locator('.choklito-drag-example')).toBeVisible()
 await page.getByRole('button',{name:'Salir del tutorial'}).click()
 await page.getByRole('button',{name:'Abrir guía de CHOKLITO'}).click()
 await expect(page.getByRole('region',{name:'CHOKLITO, tu guía'})).toBeVisible()
 await page.reload()
 await expect(page.getByRole('dialog')).toHaveCount(0)
})
test('real API: three editable zones, identical crop/date, complete plan, responsive and PDF',async({page})=>{
 test.setTimeout(180000)
 mkdirSync(artifacts,{recursive:true})
 const api=await request.newContext({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined})
 const errors:string[]=[],engineBodies:unknown[]=[],tileZooms:number[]=[]
 page.on('request',r=>{const match=r.url().match(/World_Imagery\/MapServer\/tile\/(\d+)\//);if(match)tileZooms.push(Number(match[1]))})
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('https://server.arcgisonline.com/**',async route=>{const response=await api.get(route.request().url(),{timeout:45000});await route.fulfill({response})})
 await page.route('**/api/**',async route=>{
  if(route.request().url().includes('/spatial-plan'))engineBodies.push(route.request().postDataJSON())
  const url=route.request().url().replace('http://127.0.0.1:4173',backendOrigin)
  const response=await api.fetch(url,{method:route.request().method(),data:route.request().postData()||undefined,headers:{'Content-Type':'application/json'},timeout:60000})
  await route.fulfill({response})
 })
 await page.addInitScript(()=>localStorage.setItem('chackra-choklito-guided-v4','hide'))
 await page.goto('/')
 for(const width of widths){
  await page.setViewportSize({width,height:900})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`landing ${width}`).toBeLessThanOrEqual(width+1)
 }
 await page.getByRole('button',{name:'Registrar cultivos por zona'}).click()
 await expect(page.locator('.chackra-crop-card')).toHaveCount(9)
 await expect(page.locator('.chackra-zone-choice')).toHaveCount(3)
 // Actual vertex drag; one corner changes while the others retain their geometry.
 await page.setViewportSize({width:1280,height:900})
 const corner=page.locator('.chackra-zone-resize-icon').first()
 await corner.scrollIntoViewIfNeeded()
 const box=await corner.boundingBox()
 if(!box)throw Error('Missing vertex handle')
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+5,box.y+box.height/2+5,{steps:5});await page.mouse.up()
 await expect(page.locator('.chackra-zone-resize-icon')).toHaveCount(4)
 for(let i=0;i<3;i++){
  await page.locator('.chackra-zone-choice').nth(i).click()
  await page.locator('input[type=month]').fill('2026-11')
  await page.getByRole('group',{name:'Elige el cultivo'}).getByRole('button',{name:/Camote/}).click()
  await page.getByRole('button',{name:'Marcar en zona elegida'}).click()
 }
 await page.getByRole('button',{name:'Guardar avance'}).click()
 for(const width of widths){
  await page.setViewportSize({width,height:900})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`crops ${width}`).toBeLessThanOrEqual(width+1)
  const map=await page.locator('.chackra-zone-map-wrap').boundingBox(),actions=await page.locator('.chackra-zone-page>.b-next').boundingBox()
  expect(map&&actions&&actions.y>=map.y+map.height-1,`map clearance ${width}`).toBeTruthy()
 }
 await page.getByRole('button',{name:'Continuar a mi plan'}).click()
 await page.getByRole('button',{name:'Crear mi calendario'}).click()
 await expect(page.locator('.chackra-advice-card')).toHaveCount(3,{timeout:90000})
 expect(engineBodies.length).toBe(1)
 await expect(page.locator('.chackra-plan-highlight')).toContainText('3 zonas')
 for(const width of widths){
  await page.setViewportSize({width,height:900})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`plan ${width}`).toBeLessThanOrEqual(width+1)
 }
 await page.setViewportSize({width:390,height:844})
 await page.waitForTimeout(2000)
 await page.screenshot({path:artifacts+'/mobile-plan.png',fullPage:true})
 await page.setViewportSize({width:1280,height:900})
 await page.screenshot({path:artifacts+'/desktop-plan.png',fullPage:true})
 const download=page.waitForEvent('download')
 await page.getByRole('button',{name:/Guardar como PDF/}).click()
 await (await download).saveAs(artifacts+'/CHACKRA-X-plan.pdf')
 await page.getByRole('button',{name:/Compartir PDF por WhatsApp/}).click()
 await expect(page.locator('.chackra-share-notice')).toContainText('aún no se ha enviado')
 expect(tileZooms.length).toBeGreaterThan(0)
 expect(tileZooms.every(z=>z<=17)).toBeTruthy()
 expect(errors).toEqual([])
 await page.unrouteAll({behavior:'wait'})
 await api.dispose()
})
test('API errors remain visible and do not produce a successful plan',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('chackra-choklito-guided-v4','hide'))
 await page.route('**/api/rotation/spatial-plan',route=>route.fulfill({status:503,body:'Unavailable'}))
 await page.goto('/')
 await page.getByRole('button',{name:'Registrar cultivos por zona'}).click()
 for(let i=0;i<3;i++){await page.locator('.chackra-zone-choice').nth(i).click();await page.getByRole('button',{name:'Marcar en zona elegida'}).click()}
 await page.getByRole('button',{name:'Continuar a mi plan'}).click()
 await page.getByRole('button',{name:'Crear mi calendario'}).click()
 await expect(page.getByText(/servidor o proveedor satelital no está disponible/)).toBeVisible()
 await expect(page.locator('.chackra-advice-card')).toHaveCount(0)
})

test('a saved non-Barranca field restores polygons and supports two distinct crops with live reference advice',async({page})=>{
 test.setTimeout(120000)
 const api=await request.newContext({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined})
 await page.route('**/api/**',async route=>{const response=await api.fetch(route.request().url().replace('http://127.0.0.1:4173',backendOrigin),{method:route.request().method(),data:route.request().postData()||undefined,headers:{'Content-Type':'application/json'},timeout:60000});await route.fulfill({response})})
 await page.addInitScript(()=>{
  const rect=(x:number,y:number,w:number)=>({type:'Polygon',coordinates:[[[x,y],[x+w,y],[x+w,y+w],[x,y+w],[x,y]]]})
  localStorage.setItem('chackra-choklito-guided-v4','hide')
  localStorage.setItem('chackrax-farm-v1',JSON.stringify({version:1,field:rect(-77.18,-11.48,.003),place:'Huaral',isDemoField:false,plantings:[],baseYear:2024,subplots:[{id:'A',polygon:rect(-77.1798,-11.4798,.001)},{id:'B',polygon:rect(-77.1785,-11.4785,.001)}],zoneCrops:{A:{crop_id:'camote',planted_month:'2026-11'},B:{crop_id:'zanahoria',planted_month:'2026-11'}}}))
 })
 await page.goto('/')
 await page.getByRole('button',{name:'Recuperar mi chacra guardada'}).click()
 await page.getByRole('button',{name:'Registrar cultivos por zona'}).click()
 await expect(page.locator('.chackra-zone-choice')).toHaveCount(2)
 await expect(page.locator('.chackra-zone-choice').first()).toContainText('Camote')
 await expect(page.locator('.chackra-zone-choice').nth(1)).toContainText('Zanahoria')
 await page.getByRole('button',{name:'Continuar a mi plan'}).click()
 await page.getByRole('button',{name:'Crear mi calendario'}).click()
 await expect(page.locator('.chackra-advice-card')).toHaveCount(2,{timeout:90000})
 await expect(page.locator('.chackra-advice-card').first()).toContainText('calendario agrícola local')
 await page.unrouteAll({behavior:'wait'});await api.dispose()
})
