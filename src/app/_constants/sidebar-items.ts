import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  Scissors,
  UserCheck,
  Settings,
  Package,
  Package2,
  Users,
  DollarSign,
} from "lucide-react"

interface QuickSideBarMenuItems {
  title: string
  icon: React.ElementType
  url: string
}

const quickSideBarMainMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
  },
  {
    title: "Agenda",
    icon: Calendar,
    url: "/dashboard/agenda",
  },
]

const quickSideBarCashierMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Novo Atendimento",
    url: "/caixa/novo",
    icon: Scissors,
  },
  {
    title: "Vendas do Dia",
    url: "/caixa/vendas",
    icon: DollarSign,
  },
  {
    title: "Histórico",
    url: "/caixa/historico",
    icon: Clock,
  },
]

const quickSideBarStockMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Produtos",
    url: "/estoque/produtos",
    icon: Package,
  },
  {
    title: "Entrada/Saída",
    url: "/estoque/movimentacao",
    icon: Package2,
  },
  {
    title: "Relatórios",
    url: "/estoque/relatorios",
    icon: BarChart3,
  },
]

const quickSideBarEmployeeMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Funcionários",
    url: "/dashboard/funcionarios",
    icon: Users,
  },
  {
    title: "Comissões",
    url: "/funcionarios/comissoes",
    icon: CreditCard,
  },
]

const sidebarItems = {
  quickSideBarMainMenuItem,
  quickSideBarCashierMenuItem,
  quickSideBarStockMenuItem,
  quickSideBarEmployeeMenuItem,
}

export default sidebarItems
