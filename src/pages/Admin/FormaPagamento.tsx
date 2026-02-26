import '../../styles/Admin/FormaPagamento.css'
import { useEffect, useState } from 'react'
import { MdEdit, MdDelete } from 'react-icons/md'
import {
  listarFormasPagamento,
  atualizar,
  desativar,
  type FormaPagamento as FormaPagamentoTipo,
} from '../../services/formaPagamentoService'
import { notify } from '../../utils/notify'

function FormaPagamento() {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamentoTipo[]>([])
  const [carregando, setCarregando] = useState(false)
  const [formaPagamentoselecionada, setformaPagamentoselecionada] =
    useState<FormaPagamentoTipo | null>(null)
  const [editando, setEditando] = useState(false)
  const [novaDescricao, setNovaDescricao] = useState('')

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true)
      try {
        const data = await listarFormasPagamento()
        setFormasPagamento(data)
      } catch (error) {
        console.error('Erro sop carregar formas de pagamento:', error)
        notify.error('Erro ao carregar formas de pagamento')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  const algumaSelecionada = formaPagamentoselecionada !== null

  async function handleExcluir() {
    if (!formaPagamentoselecionada) return

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a forma de pagamento "${formaPagamentoselecionada.descricaoPagamento}"?`,
    )

    if (!confirmar) return

    try {
      await desativar(formaPagamentoselecionada.formaPagamentoId)
      setFormasPagamento((prev) =>
        prev.filter(
          (formaPagamento) =>
            formaPagamento.formaPagamentoId !==
            formaPagamentoselecionada.formaPagamentoId,
        ),
      )
      setformaPagamentoselecionada(null)
    } catch (error) {
      console.error('Erro ao excluir forma de pagamento:', error)
      notify.error('Erro ao excluir forma de pagamento')
    }
  }

  function abrirEdicao() {
    if (!formaPagamentoselecionada) return
    setNovaDescricao(formaPagamentoselecionada.descricaoPagamento)
    setEditando(true)
  }

  async function salvarEdicao(event: React.FormEvent) {
    event.preventDefault()
    if (!formaPagamentoselecionada) return

    try {
      const atualizado = await atualizar(
        formaPagamentoselecionada.formaPagamentoId,
        novaDescricao,
      )

      setFormasPagamento((prev) =>
        prev.map((formaPagamento) =>
          formaPagamento.formaPagamentoId ===
          formaPagamentoselecionada.formaPagamentoId
            ? atualizado
            : formaPagamento,
        ),
      )

      setformaPagamentoselecionada(atualizado)
      setEditando(false)
    } catch (error) {
      console.error('Erro ao atualizar forma de pagamento:', error)
      notify.error('Erro ao atualizar forma de pagamento')
    }
  }

  return (
    <section className="formapagamento-section">
      <div className="formapagamento-container">
        <div className="formapagamento-header">
          <h2>Formas de Pagamento</h2>
          <p>Gerencie as opções de pagamento disponíveis</p>
        </div>

        {carregando ? (
          <div className="formapagamento-loading">
            <div className="spinner" />
            <p>Carregando formas de pagamento...</p>
          </div>
        ) : (
          <>
            {formasPagamento.length > 0 ? (
              <div className="formapagamento-list-grid">
                {formasPagamento.map((forma) => {
                  const selecionada =
                    formaPagamentoselecionada?.formaPagamentoId ===
                    forma.formaPagamentoId

                  return (
                    <button
                      key={forma.formaPagamentoId}
                      type="button"
                      className={`formapagamento-card${
                        selecionada ? ' formapagamento-card--selected' : ''
                      }`}
                      onClick={() =>
                        setformaPagamentoselecionada(selecionada ? null : forma)
                      }
                    >
                      <span className="formapagamento-card-nome">
                        {forma.descricaoPagamento}
                      </span>
                      {selecionada && (
                        <div className="formapagamento-card-indicator" />
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="formapagamento-empty">
                <p>Nenhuma forma de pagamento cadastrada.</p>
              </div>
            )}
          </>
        )}

        {/* Barra de Ações Flutuante */}
        <div
          className={`formapagamento-actions-bar${
            algumaSelecionada ? ' visible' : ''
          }`}
        >
          <span className="actions-label">
            {formaPagamentoselecionada?.descricaoPagamento} selecionada
          </span>
          <div className="actions-buttons">
            <button
              type="button"
              className="formapagamento-action-button"
              onClick={abrirEdicao}
              title="Editar"
            >
              <MdEdit /> <span>Editar</span>
            </button>
            <button
              type="button"
              className="formapagamento-action-button formapagamento-action-button--danger"
              onClick={handleExcluir}
              title="Excluir"
            >
              <MdDelete /> <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>

      {editando && formaPagamentoselecionada && (
        <div className="formapagamento-modal-backdrop">
          <div className="formapagamento-modal">
            <div className="formapagamento-modal-header">
              <h3>Editar Forma de Pagamento</h3>
              <p>Atualize os dados abaixo</p>
            </div>
            <form onSubmit={salvarEdicao} className="formapagamento-modal-form">
              <label className="formapagamento-field">
                <span>Descrição</span>
                <input
                  type="text"
                  value={novaDescricao}
                  onChange={(event) => setNovaDescricao(event.target.value)}
                  required
                  autoFocus
                />
              </label>

              <div className="formapagamento-modal-actions">
                <button
                  type="button"
                  className="formapagamento-action-button formapagamento-action-button--secondary"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="formapagamento-action-button formapagamento-action-button--primary"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default FormaPagamento
