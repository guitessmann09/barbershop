"use client"

import { EmployeeUser } from "@/app/_data-access/get-employees"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Mail,
  Phone,
  UserIcon,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const EmployeeCard = (employees: EmployeeUser) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<EmployeeUser>(employees)

  const getRoleBadgeColor = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "barbeiro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "caixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="w-full min-w-[50%] transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-6">
        <div className="relative text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative h-[100px] w-[100px]">
              {employees.barber?.imageUrl ? (
                <Image
                  src={employees.barber?.imageUrl}
                  alt="Barber"
                  fill
                  className="rounded-lg border border-primary object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <UserIcon className="h-20 w-20 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold">{editedEmployee.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge
                  className={`${getRoleBadgeColor(editedEmployee.employee?.cargo)} capitalize`}
                >
                  {editedEmployee.employee?.cargo}
                </Badge>
                {/* <Badge
                  variant={editedEmployee.isActive ? "default" : "secondary"}
                >
                  {editedEmployee.isActive ? "Ativo" : "Inativo"}
                </Badge> */}
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0">
            <div className="flex items-center gap-1.5">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Informações básicas sempre visíveis */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{employees.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {employees.phone ? (
                  <span>{employees.phone}</span>
                ) : (
                  <span>Nenhum telefone cadastrado</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  10:00h - 20:00h
                  {/* {employees.barber?.availabilities.map((availabilitie) => {
                    ;<span key={availabilitie.id} {...availabilitie}>
                      {availabilitie.startTime}
                    </span>
                  })} */}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default EmployeeCard
