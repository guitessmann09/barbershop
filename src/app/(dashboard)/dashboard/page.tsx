import { getOrders } from "@/app/_data-access/get-orders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format, subDays } from "date-fns"
import {
  Calendar,
  Clock,
  DollarSign,
  Package,
  Scissors,
  Star,
  UsersIcon,
} from "lucide-react"

const Dashboard = async () => {
  const orders = await getOrders()
  const today = new Date()
  const yesterday = subDays(today, 1)

  const todayOrders = orders.filter((order) => {
    return (
      format(new Date(order.createdAt), "dd/MM/yyyy") ===
        format(today, "dd/MM/yyyy") && order.status === "paid"
    )
  })

  const yesterdayOrders = orders.filter((order) => {
    return (
      format(new Date(order.createdAt), "dd/MM/yyyy") ===
        format(yesterday, "dd/MM/yyyy") && order.status === "paid"
    )
  })

  const todayRevenue = todayOrders.reduce(
    (acc, order) => acc + Number(order.total),
    0,
  )
  const yesterdayRevenue = yesterdayOrders.reduce(
    (acc, order) => acc + Number(order.total),
    0,
  )
  const revenueChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0

  const todayAttendance = todayOrders.length
  const yesterdayAttendance = yesterdayOrders.length
  const attendanceChange =
    yesterdayAttendance > 0
      ? ((todayAttendance - yesterdayAttendance) / yesterdayAttendance) * 100
      : 0

  return (
    <div className="space-y-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueChange > 0 ? "+" : ""}
              {revenueChange.toFixed(1)}% em relação a ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atendimentos Hoje
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance}</div>
            <p className="text-xs text-muted-foreground">
              {attendanceChange > 0 ? "+" : ""}
              {attendanceChange.toFixed(1)}% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Funcionários Ativos
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">6 trabalhando agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos em Estoque
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              12 produtos em baixa
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button
              className="h-20 flex-col gap-2 border-secondary bg-transparent"
              variant="outline"
            >
              <Scissors className="h-6 w-6" />
              <span>Novo Atendimento</span>
            </Button>
            <Button
              className="h-20 flex-col gap-2 border-secondary bg-transparent"
              variant="outline"
            >
              <Calendar className="h-6 w-6" />
              <span>Agendar Horário</span>
            </Button>
            <Button
              className="h-20 flex-col gap-2 border-secondary bg-transparent"
              variant="outline"
            >
              <Package className="h-6 w-6" />
              <span>Entrada Estoque</span>
            </Button>
            <Button
              className="h-20 flex-col gap-2 border-secondary bg-transparent"
              variant="outline"
            >
              <DollarSign className="h-6 w-6" />
              <span>Relatório Vendas</span>
            </Button>
          </CardContent>
        </Card>
        {/* Próximos Agendamentos */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>Horários marcados para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Carlos Silva
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Corte + Barba - 14:30
                  </p>
                </div>
                <Badge variant="default">João</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pedro Santos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Corte Social - 15:00
                  </p>
                </div>
                <Badge variant="default">Maria</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Lucas Oliveira
                  </p>
                  <p className="text-sm text-muted-foreground">Barba - 15:30</p>
                </div>
                <Badge variant="default">João</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Alertas e Notificações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Shampoo Anticaspa</span>
                <Badge variant="destructive">3 unidades</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pomada Modeladora</span>
                <Badge variant="outline">8 unidades</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Óleo para Barba</span>
                <Badge variant="destructive">2 unidades</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Funcionários do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">João Silva</span>
                <Badge variant="secondary">R$ 3.450,00</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Maria Santos</span>
                <Badge variant="secondary">R$ 2.890,00</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pedro Costa</span>
                <Badge variant="secondary">R$ 2.340,00</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
