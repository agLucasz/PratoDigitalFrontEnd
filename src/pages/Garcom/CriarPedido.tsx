import React, { useState, useEffect } from 'react'
import '../../styles/Garcom/CriarPedido.css'
import { MdAdd, MdDelete, MdArrowBack, MdCheck, MdRemove, MdClose } from 'react-icons/md'
import { notify } from '../../utils/notify'
import { listarProdutos, type Produto } from '../../services/produtoService'
import { listarCategorias, type Categoria } from '../../services/categoriaService'
import { criarPedido, adicionarItem } from '../../services/pedidoService'

interface CriarPedidoProps {
  onBack: () => void
}

interface ItemPedido {
  id: string
  produto: Produto
  quantidade: number
  observacao: string
}

const CriarPedido: React.FC<CriarPedidoProps> = ({ onBack }) => {
  const [step, setStep] = useState<'mesa' | 'pedido'>('mesa')
  const [mesa, setMesa] = useState('')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [itens, setItens] = useState<ItemPedido[]>([])
  

  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<string>('')
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>('')
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [isAddingItem, setIsAddingItem] = useState(false) 
  

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [produtosData, categoriasData] = await Promise.all([
        listarProdutos(),
        listarCategorias()
      ])
      setProdutos(produtosData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar dados', error)
      notify.error('Não foi possível carregar os dados. Tente novamente.')
    }
  }

  const handleMesaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mesa.trim()) {
      setStep('pedido')
      setIsAddingItem(true) 
    }
  }

  const handleAddItem = () => {
    if (!produtoSelecionadoId) return

    const produto = produtos.find(p => p.produtoId.toString() === produtoSelecionadoId)
    if (!produto) return

    const novoItem: ItemPedido = {
      id: Math.random().toString(36).substr(2, 9),
      produto,
      quantidade,
      observacao
    }

    setItens([...itens, novoItem])
    
    // Manter categoria mas limpar produto
    setProdutoSelecionadoId('')
    setQuantidade(1)
    setObservacao('')
    setIsAddingItem(false)
  }

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id))
  }

  const handleFinalizar = async () => {
    if (itens.length === 0) return

    setIsSubmitting(true)
    try {
      const novoPedido = await criarPedido(Number(mesa))
      
      for (const item of itens) {
        await adicionarItem(
          novoPedido.pedidoId,
          item.produto.produtoId,
          item.quantidade,
          item.observacao
        )
      }

      notify.success(`Pedido enviado com sucesso para a Mesa ${mesa}!`)
      onBack()
    } catch (error: unknown) {
      console.error('Erro ao enviar pedido:', error)
      type ErrShape = { response?: { data?: { message?: string } } } & { message?: string }
      const e = error as ErrShape
      const msg = e.response?.data?.message || e.message || 'Erro desconhecido'
      
      if (msg.includes('Pedido já aberto')) {
        notify.warning(`Já existe um pedido aberto para a Mesa ${mesa}. Verifique ou feche o pedido anterior.`)
        setStep('mesa')
      } else {
        notify.error(`Falha ao enviar pedido: ${msg}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepMesa = () => (
    <form className="mesa-selection" onSubmit={handleMesaSubmit}>
      <div className="mesa-input-group">
        <label htmlFor="mesa-input">Número da Mesa</label>
        <input
          id="mesa-input"
          type="number"
          className="mesa-input"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          placeholder="00"
          autoFocus
        />
      </div>
      <button type="button" onClick={onBack} className="btn-secondary" style={{width: '100%', maxWidth: '300px'}}>
        Cancelar
      </button>
      <button type="submit" className="btn-primary" disabled={!mesa}>
        Iniciar Pedido
      </button>
    </form>
  )

  const renderStepPedido = () => (
    <div className="pedido-flow">
      <div className="pedido-header-info">
        <h3>Mesa {mesa}</h3>
        <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          {itens.length} {itens.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Lista de Itens Adicionados */}
      {itens.length > 0 && (
        <div className="items-list">
          {itens.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-info">
                <span className="item-name">{item.produto.nomeProduto}</span>
                <span className="item-qty">x{item.quantidade}</span>
                {item.observacao && <span className="item-obs">Obs: {item.observacao}</span>}
              </div>
              <button 
                onClick={() => handleRemoveItem(item.id)} 
                className="btn-remove-item"
                aria-label="Remover item"
                disabled={isSubmitting}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botão para mostrar formulário de adição se não estiver visível */}
      {!isAddingItem && !isSubmitting && (
        <button 
          onClick={() => setIsAddingItem(true)} 
          className="btn-add-item"
          style={{ marginTop: '1rem' }}
        >
          <MdAdd size={24} />
          Adicionar Produto
        </button>
      )}

      {/* Formulário de Adicionar Item */}
      {isAddingItem && (
        <div className="add-item-form">
          <div className="form-group">
            <label>Categoria</label>
            <select
              className="form-select"
              value={categoriaSelecionadaId}
              onChange={(e) => {
                setCategoriaSelecionadaId(e.target.value)
                setProdutoSelecionadoId('')
              }}
              disabled={isSubmitting}
            >
              <option value="">Selecione uma categoria...</option>
              {categorias.map(c => (
                <option key={c.categoriaId} value={c.categoriaId}>
                  {c.nomeCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Produto</label>
            <select 
              className="form-select"
              value={produtoSelecionadoId}
              onChange={(e) => setProdutoSelecionadoId(e.target.value)}
              disabled={isSubmitting || !categoriaSelecionadaId}
            >
              <option value="">
                {!categoriaSelecionadaId ? 'Selecione uma categoria primeiro' : 'Selecione um produto...'}
              </option>
              {produtos
                .filter(p => !categoriaSelecionadaId || p.categoriaId.toString() === categoriaSelecionadaId)
                .map(p => (
                  <option key={p.produtoId} value={p.produtoId}>
                    {p.nomeProduto} - R$ {p.precoProduto.toFixed(2)}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantidade</label>
            <div className="quantity-control">
              <button 
                type="button" 
                className="qty-btn"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                disabled={isSubmitting}
              >
                <MdRemove />
              </button>
              <span className="qty-display">{quantidade}</span>
              <button 
                type="button" 
                className="qty-btn"
                onClick={() => setQuantidade(quantidade + 1)}
                disabled={isSubmitting}
              >
                <MdAdd />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Observação</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleAddItem}
              disabled={!produtoSelecionadoId || isSubmitting}
              style={{ width: '100%' }}
            >
              <MdCheck style={{ marginRight: '0.5rem' }} />
              Confirmar Item
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setIsAddingItem(false)}
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Ações do Pedido */}
      {!isAddingItem && (
        <div className="pedido-actions">
          <button onClick={() => setStep('mesa')} className="btn-secondary" disabled={isSubmitting}>
            <MdArrowBack /> Voltar
          </button>
          <button onClick={onBack} className="btn-secondary" style={{ color: '#ef4444' }} disabled={isSubmitting}>
            <MdClose /> Cancelar
          </button>
          <button 
            onClick={handleFinalizar} 
            className="btn-success" 
            disabled={itens.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="criar-pedido-container">
      {step === 'mesa' ? renderStepMesa() : renderStepPedido()}
    </div>
  )
}

export default CriarPedido
