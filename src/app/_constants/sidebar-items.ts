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
]

const quickSideBarEmployeeMenuItem: QuickSideBarMenuItems[] = [
  {
    title: "Funcionários",
    url: "/dashboard/funcionarios",
    icon: Users,
  },
]

const sidebarItems = {
  quickSideBarMainMenuItem,
  quickSideBarStockMenuItem,
  quickSideBarEmployeeMenuItem,
}

export default sidebarItems
