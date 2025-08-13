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
  {
    title: "Caixa",
    icon: DollarSign,
    url: "/dashboard/caixa",
  },
]

const quickSideBarStockMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Produtos",
    url: "/dashboard/produtos",
    icon: Package,
  },
  {
    title: "Entrada/Saída",
    url: "/dashboard/movimentacao",
    icon: Package2,
  },
  {
    title: "Relatórios",
    url: "/dashboard/relatorios",
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
    url: "/dashboard/funcionarios/comissoes",
    icon: CreditCard,
  },
]

const sidebarItems = {
  quickSideBarMainMenuItem,
  quickSideBarStockMenuItem,
  quickSideBarEmployeeMenuItem,
}

export default sidebarItems
