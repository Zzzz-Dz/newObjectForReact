import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals.js'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router.js'
import GlobalUserState from './globalContext.tsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalUserState>
      <RouterProvider router={router} />
    </GlobalUserState>
  </React.StrictMode>
)

reportWebVitals(console.log)
