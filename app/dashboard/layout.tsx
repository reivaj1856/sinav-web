import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app/app-sidebar"
import { AppTopbar } from "@/components/app/app-topbar"

type UserContext = {
  user_id: string
  rol: "admin" | "medico" | "enfermeria" | "consulta"
  nombre_completo: string | null
  establecimiento_id: string | null
  establecimiento_nombre: string | null
  departamento_id: number | null
  departamento_nombre: string | null
  activo: boolean
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) redirect("/login")

  const { data: ctx, error: ctxError } = await supabase
    .from("v_user_context")
    .select(
      "user_id, rol, nombre_completo, establecimiento_id, establecimiento_nombre, departamento_id, departamento_nombre, activo"
    )
    .eq("user_id", authData.user.id)
    .single<UserContext>()

  if (ctxError || !ctx || !ctx.activo) {
    // Usuario sin perfil activo o sin contexto
    redirect("/login")
  }

  const displayName =
    ctx.nombre_completo?.trim() ||
    authData.user.user_metadata?.full_name ||
    authData.user.email?.split("@")[0] ||
    "Usuario"

  return (
    <div className="flex min-h-dvh">
      <AppSidebar userRole={ctx.rol} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          displayName={String(displayName)}
          role={ctx.rol}
          establecimiento={ctx.establecimiento_nombre}
          departamento={ctx.departamento_nombre}
        />
        <main className="min-w-0 flex-1 bg-muted/20 p-6">{children}</main>
      </div>
    </div>
  )
}