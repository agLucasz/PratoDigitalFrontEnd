import type { ComponentType } from 'react'
import '../styles/Dashboard.css'
import { PiChefHatBold } from 'react-icons/pi'
import { RiAdminFill, RiCashFill } from 'react-icons/ri'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import { GiCookingPot } from 'react-icons/gi'
import { Link } from 'react-router-dom'

type Role = {
  id: 'admin' | 'garcom' | 'cozinha' | 'caixa'
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  path: string
  allowedCargos: number[]
}

type StoredUser = {
  nome?: string
  cargo?: number | string
}

const roles: Role[] = [
  {
    id: 'admin',
    label: 'Administrador',
    description: 'Controle completo do sistema, usuários, cardápios e relatórios.',
    icon: RiAdminFill,
    path: '/admin',
    allowedCargos: [1], 
  },
  {
    id: 'garcom',
    label: 'Garçom',
    description: 'Lançamento de pedidos nas mesas e acompanhamento em tempo real.',
    icon: MdOutlineRestaurantMenu,
    path: '/garcom',
    allowedCargos: [2, 1],
  },
  {
    id: 'cozinha',
    label: 'Cozinha',
    description: 'Visualização e preparo dos pedidos em andamento.',
    icon: GiCookingPot,
    path: '/cozinha',
    allowedCargos: [3, 1],
  },
  {
    id: 'caixa',
    label: 'Caixa',
    description: 'Fechamento de contas, recebimentos e histórico de vendas.',
    icon: RiCashFill,
    path: '/caixa',
    allowedCargos: [4, 1],
  },
]

function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('usuario')
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

function Dashboard() {
  const storedUser = getStoredUser()
  const nome = storedUser?.nome ?? 'Usuário'

  let cargo: number | null = null
  if (storedUser?.cargo !== undefined && storedUser?.cargo !== null) {
    cargo =
      typeof storedUser.cargo === 'string'
        ? Number(storedUser.cargo)
        : storedUser.cargo
  }

  return (
    <main className="dashboard">
      <header className="dashboard-hero">
        <PiChefHatBold className="dashboard-hero-icon" />
        <div className="dashboard-hero-text">
          <h2>Olá, {nome}</h2>
          <h2>Seja Bem vindo!</h2>
          <h1 id="dashboard-hero-title">Escolha seu módulo</h1>
          <p>Selecione o tipo de acesso para entrar no painel correspondente.</p>
        </div>
      </header>

      <section className="dashboard-role-grid">
        {roles.map((role) => {
          const Icon = role.icon
          const isAllowed = cargo !== null && role.allowedCargos.includes(cargo)

          const baseClasses = `role-card role-card--large${
            role.id === 'admin' ? ' role-card--primary' : ''
          }${!isAllowed ? ' role-card--disabled' : ''}`

          if (!isAllowed) {
            return (
              <div
                key={role.id}
                className={baseClasses}
                aria-disabled="true"
              >
                <div className="role-card-header">
                  <Icon className="role-icon" />
                  <span className="role-label">{role.label}</span>
                </div>
                <p className="role-description">{role.description}</p>
                <span className="role-badge">Acesso bloqueado</span>
              </div>
            )
          }

          return (
            <Link key={role.id} to={role.path} className={baseClasses}>
              <div className="role-card-header">
                <Icon className="role-icon" />
                <span className="role-label">{role.label}</span>
              </div>
              <p className="role-description">{role.description}</p>
            </Link>
          )
        })}
      </section>
      <footer className="dashboard-footer">
        <Link to="/" className="dashboard-hero-btn">
          Sair
        </Link>
        <p>&copy; 2023 Prato Digital. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}

export default Dashboard

