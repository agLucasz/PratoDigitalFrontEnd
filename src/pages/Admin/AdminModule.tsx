import { useState } from 'react'
import '../../styles/Admin/Dashboard.css'
import { PiChefHatBold } from 'react-icons/pi'
import { MdSpaceDashboard, MdCategory } from 'react-icons/md'
import { TbBottle } from 'react-icons/tb'
import CadastroProduto from './CadastroProduto'
import Produto from './Produto'
import CadastroCategoria from './CadastroCategoria'
import Categoria from './Categoria'
import CadastroFormaPagamento from './CadastroFormaPagamento'
import FormaPagamento from './FormaPagamento'

type AdminSection =
  | 'dashboard'
  | 'produtoCadastrar'
  | 'produtoLista'
  | 'categoriaCadastrar'
  | 'categoriaLista'
  | 'formaPagamentoCadastrar'
  | 'formaPagamentoLista'

function AdminModule() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [produtoMenuOpen, setProdutoMenuOpen] = useState(false)
  const [categoriaMenuOpen, setCategoriaMenuOpen] = useState(false)
  const [formaPagamentoMenuOpen, setFormaPagamentoMenuOpen] = useState(false)

  return (
    <main className="dashboard admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <PiChefHatBold className="admin-logo-icon" />
          <div className="admin-sidebar-text">
            <span className="admin-sidebar-title">Prato Digital</span>
            <span className="admin-sidebar-subtitle">Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-item${
              activeSection === 'dashboard' ? ' admin-nav-item--active' : ''
            }`}
            onClick={() => {
              setActiveSection('dashboard')
              setProdutoMenuOpen(false)
              setCategoriaMenuOpen(false)
              setFormaPagamentoMenuOpen(false)
            }}
          >
            <MdSpaceDashboard className="admin-nav-icon" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="admin-nav-item"
            onClick={() => {
              setProdutoMenuOpen((prev) => !prev)
              setCategoriaMenuOpen(false)
              setFormaPagamentoMenuOpen(false)
            }}
          >
            <TbBottle className="admin-nav-icon" />
            <span>Produto</span>
          </button>

          {produtoMenuOpen && (
            <>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'produtoCadastrar' ? ' admin-nav-item--active' : ''
                }`}
                onClick={() => setActiveSection('produtoCadastrar')}
              >
                <span>Cadastrar produto</span>
              </button>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'produtoLista' ? ' admin-nav-item--active' : ''
                }`}
                onClick={() => setActiveSection('produtoLista')}
              >
                <span>Lista de produtos</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="admin-nav-item"
            onClick={() => {
              setCategoriaMenuOpen((prev) => !prev)
              setProdutoMenuOpen(false)
              setFormaPagamentoMenuOpen(false)
            }}
          >
            <MdCategory className="admin-nav-icon" />
            <span>Categoria</span>
          </button>

          {categoriaMenuOpen && (
            <>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'categoriaCadastrar'
                    ? ' admin-nav-item--active'
                    : ''
                }`}
                onClick={() => setActiveSection('categoriaCadastrar')}
              >
                <span>Cadastrar categoria</span>
              </button>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'categoriaLista' ? ' admin-nav-item--active' : ''
                }`}
                onClick={() => setActiveSection('categoriaLista')}
              >
                <span>Lista de categorias</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="admin-nav-item"
            onClick={() => {
              setFormaPagamentoMenuOpen((prev) => !prev)
              setProdutoMenuOpen(false)
              setCategoriaMenuOpen(false)
            }}
          >
            <MdCategory className="admin-nav-icon" />
            <span>Forma de Pagamento</span>
          </button>
          
            {formaPagamentoMenuOpen && (
            <>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'formaPagamentoCadastrar'
                    ? ' admin-nav-item--active'
                    : ''
                }`}
                onClick={() => setActiveSection('formaPagamentoCadastrar')}
              >
                <span>Cadastrar Forma de Pagamento</span>
              </button>
              <button
                type="button"
                className={`admin-nav-item admin-nav-subitem${
                  activeSection === 'formaPagamentoLista' ? ' admin-nav-item--active' : ''
                }`}
                onClick={() => setActiveSection('formaPagamentoLista')}
              >
                <span>Lista de Formas de Pagamentos</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      <section className="admin-content">
        {activeSection === 'dashboard' && (
          <header className="admin-content-header">
            <h1>Administrador</h1>
            <p>Selecione uma opção no menu para gerenciar o sistema.</p>
          </header>
        )}

        {activeSection === 'produtoCadastrar' && <CadastroProduto />}

        {activeSection === 'produtoLista' && <Produto />}

        {activeSection === 'categoriaCadastrar' && <CadastroCategoria />}

        {activeSection === 'categoriaLista' && <Categoria />}

        {activeSection === 'formaPagamentoCadastrar' && <CadastroFormaPagamento />}

        {activeSection === 'formaPagamentoLista' && <FormaPagamento />}
      </section>
    </main>
  )
}

export default AdminModule
