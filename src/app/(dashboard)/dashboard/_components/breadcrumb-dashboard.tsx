"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

// Mapeamento opcional para nomes mais amigáveis
const nameMap: Record<string, string> = {
  dashboard: "Dashboard",
  funcionarios: "Funcionários",
  agenda: "Agendamentos",
  caixa: "Caixa",
  // Adicione outros mapeamentos conforme necessário
}

export default function BreadcrumbDashboard() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  // Gera os itens do breadcrumb
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.slice(1).map((segment, idx) => {
          const href = "/" + segments.slice(0, idx + 2).join("/")
          const isLast = idx === segments.slice(1).length - 1
          const label = nameMap[segment] || decodeURIComponent(segment)
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
