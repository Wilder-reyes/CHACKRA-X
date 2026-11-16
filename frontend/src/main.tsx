import '@fontsource-variable/inter'
import '@fontsource/pt-serif/400-italic.css'
import React from 'react'
import {createRoot} from 'react-dom/client'
import ChackraFarmerApp from './ChackraFarmerApp'
import 'leaflet/dist/leaflet.css'
import './style.css'

// Application entry point.
createRoot(document.getElementById('root')!).render(<React.StrictMode><ChackraFarmerApp/></React.StrictMode>)
