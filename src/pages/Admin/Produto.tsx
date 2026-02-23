import '../../styles/Admin/Produto.css'

import { useEffect, useState } from 'react'
import {
  MdEdit,
  MdDelete,
  MdSearch,
} from 'react-icons/md'
import {
  listarProdutos,
  atualizar,
  desativar,
  type Produto as ProdutoTipo,
} from '../../services/produtoService'
import {
  listarCategorias,
  type Categoria as CategoriaTipo,
} from '../../services/categoriaService'

function Produto() {
  const [produtos, setProdutos] = useState<ProdutoTipo[]>([])
  const [categorias, setCategorias] = useState<CategoriaTipo[]>([])
  const [carregando, setCarregando] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoTipo | null>(null)
  const [expandido, setExpandido] = useState<number | null>(null)
  const [editando, setEditando] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novoPreco, setNovoPreco] = useState('')
  const [novaDescricao, setNovaDescricao] = useState('')
  const [novaCategoriaId, setNovaCategoriaId] = useState<number | ''>('')
  const [termoBusca, setTermoBusca] = useState('')

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true)
      try {
        const [produtosData, categoriasData] = await Promise.all([
          listarProdutos(),
          listarCategorias(),
        ])
        setProdutos(produtosData)
        setCategorias(categoriasData)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        alert('Erro ao carregar produtos')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  function toggleExpandir(id: number) {
    setExpandido((prev) => (prev === id ? null : id))
  }

  async function handleExcluir() {
    if (!produtoSelecionado) return
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o produto "${produtoSelecionado.nomeProduto}"?`,
    )
    if (!confirmar) return

    try {
      await desativar(produtoSelecionado.produtoId)
      setProdutos((prev) => prev.filter((p) => p.produtoId !== produtoSelecionado.produtoId))
      setProdutoSelecionado(null)
      setExpandido(null)
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto')
    }
  }

  function abrirEdicao() {
    if (!produtoSelecionado) return
    setNovoNome(produtoSelecionado.nomeProduto)
    setNovoPreco(produtoSelecionado.precoProduto.toString())
    setNovaDescricao(produtoSelecionado.descricao)
    setNovaCategoriaId(produtoSelecionado.categoriaId)
    setEditando(true)
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault()
    if (!produtoSelecionado) return
    try {
      const atualizado = await atualizar(
        produtoSelecionado.produtoId,
        novoNome,
        Number(novoPreco),
        novaDescricao,
        Number(novaCategoriaId),
      )
      setProdutos((prev) =>
        prev.map((p) => (p.produtoId === produtoSelecionado.produtoId ? atualizado : p)),
      )
      setProdutoSelecionado(atualizado)
      setEditando(false)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      alert('Erro ao atualizar produto')
    }
  }

  const produtosFiltrados = produtos.filter((p) =>
    p.nomeProduto.toLowerCase().includes(termoBusca.toLowerCase()),
  )

  const algumaSelecionada = !!produtoSelecionado

  return (
    <section className="produto-section">
      <div className="produto-container">
        <div className="produto-header">
          <h2>Gerenciar Produtos</h2>
          <p>Visualize, edite ou exclua os produtos do cardápio</p>
        </div>

        <div className="produto-search">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="produto-loading">
            <div className="spinner" />
            <p>Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="produto-empty">
            <p>Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <div className="produto-list-grid">
            {produtosFiltrados.map((produto) => {
              const selecionado = produtoSelecionado?.produtoId === produto.produtoId
              const isExpandido = expandido === produto.produtoId
              const categoriaNome =
                categorias.find((c) => c.categoriaId === produto.categoriaId)?.nomeCategoria ||
                'Desconhecida'

              return (
                <div
                  key={produto.produtoId}
                  className={`produto-card${selecionado ? ' produto-card--selected' : ''}`}
                  onClick={() => {
                    setProdutoSelecionado(selecionado ? null : produto)
                    toggleExpandir(produto.produtoId)
                  }}
                >
                  <div className="produto-card-header">
                    <span className="produto-card-nome">{produto.nomeProduto}</span>
                    {selecionado && <div className="produto-card-indicator" />}
                  </div>

                  {isExpandido && (
                    <div className="produto-card-details">
                      <div className="produto-detail-item">
                        <span><strong>Preço:</strong> R$ {produto.precoProduto.toFixed(2)}</span>
                      </div>
                      <div className="produto-detail-item">
                        <span><strong>Categoria:</strong> {categoriaNome}</span>
                      </div>
                      <div className="produto-detail-item full-width">
                        <p><strong>Descrição:</strong> {produto.descricao}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className={`produto-actions-bar${algumaSelecionada ? ' visible' : ''}`}>
        <span className="actions-label">
          {produtoSelecionado?.nomeProduto} selecionado
        </span>
        <div className="actions-buttons">
          <button
            type="button"
            className="produto-action-button"
            onClick={abrirEdicao}
            title="Editar"
          >
            <MdEdit /> <span>Editar</span>
          </button>
          <button
            type="button"
            className="produto-action-button produto-action-button--danger"
            onClick={handleExcluir}
            title="Excluir"
          >
            <MdDelete /> <span>Excluir</span>
          </button>
        </div>
      </div>

      {editando && produtoSelecionado && (
        <div className="produto-modal-backdrop">
          <div className="produto-modal">
            <div className="produto-modal-header">
              <h3>Editar Produto</h3>
              <p>Atualize as informações do produto</p>
            </div>
            <form onSubmit={salvarEdicao} className="produto-modal-form">
              <label className="produto-field">
                <span>Nome do Produto</span>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  required
                />
              </label>
              <div className="form-row">
                <label className="produto-field">
                  <span>Preço (R$)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                    required
                  />
                </label>
                <label className="produto-field">
                  <span><strong>Categoria:</strong></span>
                  <select
                    value={novaCategoriaId}
                    onChange={(e) =>
                      setNovaCategoriaId(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    required
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {categorias.map((categoria) => (
                      <option key={categoria.categoriaId} value={categoria.categoriaId}>
                        {categoria.nomeCategoria}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="produto-field">
                <span>Descrição</span>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  required
                  rows={3}
                />
              </label>

              <div className="produto-modal-actions">
                <button
                  type="button"
                  className="produto-action-button produto-action-button--secondary"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="produto-action-button produto-action-button--primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Produto
