import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Garcom/Dashboard.css'
import { MdArrowBack } from 'react-icons/md'
import { PiNotePencilBold, PiListBulletsBold } from 'react-icons/pi'
import CriarPedido from './CriarPedido'
import ListaPedidos from './ListaPedidos'

type ViewState = 'dashboard' | 'criar-pedido' | 'lista-pedidos'

function GarcomModule() {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<ViewState>('dashboard')

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'criar-pedido':
        return <CriarPedido onBack={handleBackToDashboard} />
      case 'lista-pedidos':
        return <ListaPedidos onBack={handleBackToDashboard} />
      default:
        return (
          <>
            <header className="garcom-header">
              <div className="garcom-title">
                <h1>Garçom</h1>
                <p>Gerencie pedidos e mesas</p>
              </div>
              <button onClick={() => navigate('/dashboard')} className="garcom-back-btn">
                <MdArrowBack style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Voltar
              </button>
            </header>

            <div className="garcom-actions-grid">
              <div 
                className="garcom-card"
                onClick={() => setCurrentView('criar-pedido')}
              >
                <div className="garcom-card-icon">
                  <PiNotePencilBold />
                </div>
                <h2>Novo Pedido</h2>
                <p>Lançar itens para uma mesa</p>
              </div>

              <div 
                className="garcom-card"
                onClick={() => setCurrentView('lista-pedidos')}
              >
                <div className="garcom-card-icon">
                  <PiListBulletsBold />
                </div>
                <h2>Pedidos em Aberto</h2>
                <p>Acompanhar status e detalhes</p>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <main className="garcom-dashboard">
      {renderContent()}
    </main>
  )
}

export default GarcomModule
