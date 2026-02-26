import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/index.css'
import AppRoute from './routes/AppRoute.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoute />
      <ToastContainer 
        theme="dark" 
        position="top-center" 
        autoClose={3000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
        newestOnTop
        limit={3}
      />
    </BrowserRouter>
  </React.StrictMode>
)
