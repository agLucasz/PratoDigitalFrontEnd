import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/index.css'
import AppRoute from './routes/AppRoute.tsx'

// Quando a janela perde o foco, removemos todas as notificações imediatamente
window.addEventListener('blur', () => {
  toast.dismiss()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoute />
      <ToastContainer 
        theme="dark" 
        position="top-center" 
        autoClose={2500}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
        newestOnTop
        limit={3}
      />
    </BrowserRouter>
  </React.StrictMode>
)
