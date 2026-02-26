import React from 'react'

interface ListaPedidosProps {
  onBack: () => void
}

const ListaPedidos: React.FC<ListaPedidosProps> = ({ onBack }) => {
  return (
    <div className="garcom-subpage">
      <button onClick={onBack} className="garcom-back-btn" style={{ marginBottom: '1rem' }}>
        &larr; Voltar
      </button>
      <h2>Lista de Pedidos</h2>
      <p>Funcionalidade em desenvolvimento...</p>
    </div>
  )
}

export default ListaPedidos
