import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Cadastro from '../pages/Cadastro'
import Dashboard from '../pages/DashBoard'
import AdminModule from '../pages/Admin/AdminModule'
import GarcomModule from '../pages/Garcom/GarcomModule'
import CozinhaModule from '../pages/CozinhaModule'
import CaixaModule from '../pages/CaixaModule'

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminModule />} />
      <Route path="/garcom" element={<GarcomModule />} />
      <Route path="/cozinha" element={<CozinhaModule />} />
      <Route path="/caixa" element={<CaixaModule />} />
    </Routes>
  )
}

export default AppRoute
