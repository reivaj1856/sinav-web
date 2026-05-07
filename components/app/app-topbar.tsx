"use client"

import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/app/user-menu"

type Props = {
  displayName?: string
  role?: "admin" | "medico" | "enfermeria" | "consulta"
  establecimiento?: string | null
  departamento?: string | null
}

export function AppTopbar({
  displayName = "Usuario",
  role = "consulta",
  establecimiento,
  departamento,
}: Props) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <span className="truncate font-medium text-foreground">{displayName}</span>
        <Badge variant="secondary">{role}</Badge>
        {establecimiento ? (
          <span className="hidden md:inline">• {establecimiento}</span>
        ) : null}
        {departamento ? (
          <span className="hidden md:inline">• {departamento}</span>
        ) : null}
      </div>

      <UserMenu displayName={displayName} />
    </header>
  )
}