import test from 'node:test'

import assert from 'node:assert/strict'

import {readFileSync} from 'node:fs'



const app=readFileSync(new URL('../src/ChackraFarmerApp.tsx',import.meta.url),'utf8')

const css=readFileSync(new URL('../src/chackra-farmer-base.css',import.meta.url),'utf8')

const bootstrap=readFileSync(new URL('../src/main.tsx',import.meta.url),'utf8')



test('The single farmer view is CHACKRA X with no historical route selection',()=>{

 assert.match(bootstrap,/<ChackraFarmerApp\/>/)

 assert.doesNotMatch(bootstrap,/URLSearchParams|ChalhuasPilotApp|\.\/FarmerApp'|RotationApp|AdvancedApp/)

 assert.match(app,/steps:\['Delimitar','Cultivos y zonas','Mi plan'\]/)
 assert.match(app,/chackra-crop-grid/)
 assert.match(app,/spatial-plan/)

})

test('Farmer-facing workflow keeps optional geometry import and never auto-confirms crops',()=>{

 assert.match(app,/¿Dónde está tu chacra\?/)

 assert.match(app,/Muéstranos qué sembraste/)

 assert.match(app,/Elige tus cultivos/)

 assert.doesNotMatch(app,/Comparar 3 rotaciones/)

 assert.match(app,/Importar contorno GeoJSON \(opcional\)/)
 assert.match(app,/chackra-farmer-clean/)
 assert.match(app,/ChackraInfoPage/)

 assert.match(app,/buildSpatialPlan\(\)/)

})

test('Barranca is the only public study example',()=>{

 assert.match(app,/TEAM_FIELDS\.filter\(f=>f.zone==='barranca'\)/)

 assert.match(app,/nominatim\.openstreetmap\.org\/search/)

 assert.match(app,/validatePolygon\(points\)/)

})

test('The zone plan renders a geographic printable A4 report and uses readable controls',()=>{

 const chackraCss=readFileSync(new URL('../src/chackra.css',import.meta.url),'utf8')
 const zonePlan=readFileSync(new URL('../src/ChackraZonePlan.tsx',import.meta.url),'utf8')
 assert.match(chackraCss,/@page\{size:A4;margin:18mm\}/)

 assert.match(zonePlan,/ChackraZonePrint/)

 assert.match(css,/break-inside:avoid/)

 assert.match(zonePlan,/ChackraZoneSketch/)

 assert.match(zonePlan,/sow_label_es/)

})

test('The design system provides usable controls, focus and reduced-motion support',()=>{

 assert.match(css,/min-height:48px/)

 assert.match(css,/:focus-visible/)

 assert.match(css,/prefers-reduced-motion/)

})
