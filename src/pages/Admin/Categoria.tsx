import '../../styles/Admin/Categoria.css'
import { useEffect, useState } from 'react'
import {
  listarCategorias,
  atualizar,
  desativar,
  type Categoria as CategoriaTipo,
} from '../../services/categoriaService'
import { MdCategory, MdEdit, MdDelete } from 'react-icons/md'
import { notify } from '../../utils/notify'

function Categoria() {
  const [categorias, setCategorias] = useState<CategoriaTipo[]>([])
  const [carregando, setCarregando] = useState(false)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaTipo | null>(null)
  const [editando, setEditando] = useState(false)
  const [novoNome, setNovoNome] = useState('')

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true)
      try {
        const data = await listarCategorias()
        setCategorias(data)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        notify.error('Erro ao carregar categorias')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  // const semCategorias = !carregando && categorias.length === 0 // Removido por não estar em uso
  const algumaSelecionada = categoriaSelecionada !== null

  async function handleExcluir() {
    if (!categoriaSelecionada) return

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a categoria "${categoriaSelecionada.nomeCategoria}"?`,
    )

    if (!confirmar) return

    try {
      await desativar(categoriaSelecionada.categoriaId)
      setCategorias((prev) =>
        prev.filter((categoria) => categoria.categoriaId !== categoriaSelecionada.categoriaId),
      )
      setCategoriaSelecionada(null)
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      notify.error('Erro ao excluir categoria')
    }
  }

  function abrirEdicao() {
    if (!categoriaSelecionada) return
    setNovoNome(categoriaSelecionada.nomeCategoria)
    setEditando(true)
  }

  async function salvarEdicao(event: React.FormEvent) {
    event.preventDefault()
    if (!categoriaSelecionada) return

    try {
      const atualizado = await atualizar(categoriaSelecionada.categoriaId, novoNome)

      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.categoriaId === categoriaSelecionada.categoriaId ? atualizado : categoria,
        ),
      )

      setCategoriaSelecionada(atualizado)
      setEditando(false)
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      notify.error('Erro ao atualizar categoria')
    }
  }

  return (
    <section className="categoria-section">
      <div className="categoria-container">
        <div className="categoria-header">
          <h2>Categorias</h2>
          <p>Gerencie as categorias do seu cardápio</p>
        </div>

        {carregando && (
          <div className="categoria-loading">
            <div className="spinner"></div>
            <p>Carregando categorias...</p>
          </div>
        )}

        {!carregando && categorias.length > 0 && (
          <>
            <div className="categoria-list-grid">
              {categorias.map((categoria) => {
                const selecionada =
                  categoriaSelecionada?.categoriaId === categoria.categoriaId

                return (
                  <button
                    key={categoria.categoriaId}
                    type="button"
                    className={`categoria-card${
                      selecionada ? ' categoria-card--selected' : ''
                    }`}
                    onClick={() =>
                      setCategoriaSelecionada(
                        selecionada ? null : categoria,
                      )
                    }
                  >
                    <span className="categoria-card-nome">
                      {categoria.nomeCategoria}
                    </span>
                    {selecionada && <div className="categoria-card-indicator" />}
                  </button>
                )
              })}
            </div>

            <div className={`categoria-actions-bar${algumaSelecionada ? ' visible' : ''}`}>
              <span className="actions-label">
                {categoriaSelecionada?.nomeCategoria} selecionada
              </span>
              <div className="actions-buttons">
                <button
                  type="button"
                  className="categoria-action-button"
                  onClick={abrirEdicao}
                  title="Editar categoria"
                >
                  <MdEdit /> <span>Editar</span>
                </button>
                <button
                  type="button"
                  className="categoria-action-button categoria-action-button--danger"
                  onClick={handleExcluir}
                  title="Excluir categoria"
                >
                  <MdDelete /> <span>Excluir</span>
                </button>
              </div>
            </div>
          </>
        )}

        {!carregando && categorias.length === 0 && (
          <div className="categoria-empty">
            <MdCategory className="empty-icon" />
            <p>Nenhuma categoria cadastrada.</p>
          </div>
        )}
      </div>

      {editando && categoriaSelecionada && (
        <div className="categoria-modal-backdrop">
          <div className="categoria-modal">
            <div className="categoria-modal-header">
              <h3>Editar Categoria</h3>
              <p>Atualize o nome da categoria abaixo</p>
            </div>
            <form onSubmit={salvarEdicao} className="categoria-modal-form">
              <label className="categoria-field">
                <span>Nome da Categoria</span>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(event) => setNovoNome(event.target.value)}
                  placeholder="Ex: Bebidas, Sobremesas..."
                  required
                  autoFocus
                />
              </label>

              <div className="categoria-modal-actions">
                <button
                  type="button"
                  className="categoria-action-button categoria-action-button--secondary"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="categoria-action-button categoria-action-button--primary">
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

export default Categoria
