"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type Props = {
  userRole?: "admin" | "medico" | "enfermeria" | "consulta"
}

export function AppSidebar({ userRole = "consulta" }: Props) {
  const pathname = usePathname()
  const items = NAV_ITEMS.filter(i => !i.roles || i.roles.includes(userRole))

  return (
    <aside className="w-64 shrink-0 border-r bg-background">
      <div className="p-4">
        <div className="text-sm font-semibold leading-tight">
          Sistema Nacional de Vacunación
        </div>
        <div className="text-xs text-muted-foreground">
          Ministerio de Salud y Deportes — Bolivia
        </div>
      </div>

      <Separator />

      <nav className="p-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}