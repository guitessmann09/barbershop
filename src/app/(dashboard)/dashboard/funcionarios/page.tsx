import EmployeeCard from "./_components/employee-card"
import { Card, CardHeader } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getEmployees } from "@/app/_data-access/get-employees"
import SignUpUserForm from "./_components/sign-up-user-form"

const EmployeesPage = async () => {
  const employees = await getEmployees()
  return (
    <Card className="flex h-max flex-col gap-4 p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Funcionários
          </span>
          <h2 className="text-xl font-semibold">Gestão de funcionários</h2>
        </div>
        {/* <CreateProductDialog /> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon size={12} />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo funcionário</DialogTitle>
              <DialogDescription>Isira os dados abaixo</DialogDescription>
            </DialogHeader>
            <SignUpUserForm />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <div className="grid grid-cols-2 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} {...employee} />
        ))}
      </div>
    </Card>
    // <div className="mx-auto mt-10 max-w-md">
    //   <h1 className="mb-6 text-2xl font-bold">Cadastrar Funcionário</h1>
    //   <SignUpUserForm />
    // </div>
  )
}

export default EmployeesPage
