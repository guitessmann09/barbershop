import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"

type MenuItem = {
  title: string
  url: string
  icon: React.ElementType
}

type SidebarAppMenuItemProps = {
  section: MenuItem[]
}

const SidebarAppMenuItem = ({ section }: SidebarAppMenuItemProps) => {
  return (
    <SidebarMenu>
      {section.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default SidebarAppMenuItem
