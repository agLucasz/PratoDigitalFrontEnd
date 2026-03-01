import React, { useEffect, useState } from 'react'
import '../../styles/Garcom/ListaPedido.css'
import { 
  listarPedidos, 
  obterPedido, 
  adicionarItemPedidoAberto,
  removerItemPedidoAberto,
  type Pedido
} from '../../services/pedidoService'
import { listarProdutos, type Produto } from '../../services/produtoService'
import notify from '../../utils/notify'
import { MdAccessTime, MdClose, MdRefresh, MdDelete, MdAdd } from 'react-icons/md'

interface ListaPedidosProps {
  onBack: () => void
}

const statusMap: { [key: number]: { label: string; class: string } } = {
  1: { label: 'Aberto', class: 'aberto' },
  2: { label: 'Pendente', class: 'pendente' },
  3: { label: 'Fechado', class: 'fechado' },
  4: { label: 'Cancelado', class: 'cancelado' }
}

const ListaPedidos: React.FC<ListaPedidosProps> = ({ onBack }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)


  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [selectedProdutoId, setSelectedProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPedidos = async () => {
    setLoading(true)
    try {
      const data = await listarPedidos()
      setPedidos(data.reverse())
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      notify.error('Não foi possível carregar a lista de pedidos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()

    listarProdutos().then(setProdutos).catch(console.error)
  }, [])

  const handleCardClick = async (pedidoId: number) => {
    setLoadingDetails(true)
    setIsAddingItem(false) 
    try {
      const detalhe = await obterPedido(pedidoId)
      setSelectedPedido(detalhe)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
      notify.error('Erro ao abrir detalhes do pedido.')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleAddItem = async () => {
    if (!selectedPedido || !selectedProdutoId) return
    setActionLoading(true)
    try {
      await adicionarItemPedidoAberto(
        selectedPedido.pedidoId, 
        Number(selectedProdutoId), 
        quantidade, 
        observacao
      )
      notify.success('Item adicionado com sucesso!')
      
    
      const detalhe = await obterPedido(selectedPedido.pedidoId)
      setSelectedPedido(detalhe)
      
   
      setIsAddingItem(false)
      setSelectedProdutoId('')
      setQuantidade(1)
      setObservacao('')
    } catch (error: any) {
      console.error('Erro ao adicionar item:', error)
      const msg = error.response?.data?.message || 'Erro ao adicionar item.'
      notify.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    if (!selectedPedido) return
    if (!window.confirm('Tem certeza que deseja remover este item?')) return
    
    setActionLoading(true)
    try {
      await removerItemPedidoAberto(selectedPedido.pedidoId, itemId)
      notify.success('Item removido com sucesso!')
      
    
      const detalhe = await obterPedido(selectedPedido.pedidoId)
      setSelectedPedido(detalhe)
    } catch (error: any) {
      console.error('Erro ao remover item:', error)
      const msg = error.response?.data?.message || 'Erro ao remover item.'
      notify.error(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedPedido(null)
    setIsAddingItem(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="lista-pedidos-container">
      <div className="garcom-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={onBack} className="garcom-back-btn">
          &larr; Voltar
        </button>
        <button onClick={fetchPedidos} className="garcom-back-btn" title="Atualizar lista">
          <MdRefresh size={24} />
        </button>
      </div>

      <div className="garcom-title">
        <h2>Pedidos</h2>
        <p>Acompanhe os pedidos das mesas</p>
      </div>

      {loading && pedidos.length === 0 ? (
        <div className="empty-state">
          <p>Carregando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div 
              key={pedido.pedidoId} 
              className="pedido-card"
              data-status={pedido.status}
              onClick={() => handleCardClick(pedido.pedidoId)}
            >
              <div className="pedido-header">
                <span className="pedido-mesa">Mesa {pedido.mesa}</span>
                <span className="pedido-id">#{pedido.pedidoId}</span>
              </div>
              
              <div className="pedido-info">
                <span className="pedido-status-badge">
                  {statusMap[pedido.status]?.label || 'Desconhecido'}
                </span>
                <div className="pedido-time">
                  <MdAccessTime />
                  <span>{formatTime(pedido.dataAbertura)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

  
      {selectedPedido && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3 className="modal-title">Pedido #{selectedPedido.pedidoId}</h3>
                <span className="pedido-mesa" style={{ fontSize: '1rem', color: '#9ca3af' }}>
                  Mesa {selectedPedido.mesa}
                </span>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <MdClose size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="itens-list">
                {selectedPedido.itens && selectedPedido.itens.length > 0 ? (
                  selectedPedido.itens.map((item) => (
                    <div key={item.pedidoItemId} className="item-row">
                      <div className="item-details">
                        <span className="item-name">
                          {item.produto?.nomeProduto || `Produto #${item.produtoId}`}
                        </span>
                        {item.pedidoObservacao && (
                          <span className="item-obs">Obs: {item.pedidoObservacao}</span>
                        )}
                      </div>
                      <div className="item-actions">
                        <span className="item-qty">{item.quantidade}x</span>
                  
                        {(selectedPedido.status === 1 || selectedPedido.status === 2) && (
                          <button 
                            className="btn-icon-danger" 
                            onClick={() => handleRemoveItem(item.produtoId)}
                            title="Remover Item"
                            disabled={actionLoading}
                          >
                            <MdDelete size={28} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state" style={{ padding: '1rem' }}>
                    Nenhum item neste pedido.
                  </p>
                )}
              </div>

   
              {(selectedPedido.status === 1 || selectedPedido.status === 2) && (
                <div className="add-item-section">
                  {isAddingItem ? (
                    <div className="add-item-form">
                      <h4>Adicionar Item</h4>
                      <div className="form-group">
                        <label>Produto</label>
                        <select 
                          className="form-select"
                          value={selectedProdutoId}
                          onChange={(e) => setSelectedProdutoId(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {produtos.map(p => (
                            <option key={p.produtoId} value={p.produtoId}>
                              {p.nomeProduto} - R$ {p.precoProduto.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Qtd</label>
                          <input 
                            type="number" 
                            min="1"
                            className="form-input"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                          />
                        </div>
                        <div className="form-group" style={{ flex: 3 }}>
                          <label>Obs</label>
                          <input 
                            type="text" 
                            className="form-input"
                            placeholder="Ex: Sem cebola"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-actions">
                        <button 
                          className="btn-secondary" 
                          onClick={() => setIsAddingItem(false)}
                          disabled={actionLoading}
                        >
                          Cancelar
                        </button>
                        <button 
                          className="btn-primary" 
                          onClick={handleAddItem}
                          disabled={!selectedProdutoId || actionLoading}
                        >
                          {actionLoading ? 'Adicionando...' : 'Confirmar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn-dashed" 
                      onClick={() => setIsAddingItem(true)}
                    >
                      <MdAdd /> Adicionar Item
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingDetails && (
        <div className="modal-backdrop" style={{ zIndex: 60 }}>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}

export default ListaPedidos
