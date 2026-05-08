import { createSupabaseServerClient } from "@/lib/supabase/server"

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function getDashboardKpis() {
  const supabase = await createSupabaseServerClient()

  const today = ymd(new Date())
  const d30 = new Date()
  d30.setDate(d30.getDate() - 30)
  const from30 = ymd(d30)

  // 1) Dosis hoy (count)
  const dosisHoyQ = supabase
    .from("vacunacion_santa_cruz")
    .select("id", { count: "exact", head: true })
    .eq("fecha_aplicacion", today)

  // 2) Pacientes atendidos hoy (distinct paciente_id)
  const pacientesHoyQ = supabase
    .from("vacunacion_santa_cruz")
    .select("paciente_id")
    .eq("fecha_aplicacion", today)

  // 3) Vacunas diferentes en 30 días (distinct vacuna_id)
  const vacunas30Q = supabase
    .from("vacunacion_santa_cruz")
    .select("vacuna_id")
    .gte("fecha_aplicacion", from30)

  // 4) Importaciones pendientes
  const impPendQ = supabase
    .from("importaciones_csv")
    .select("id", { count: "exact", head: true })
    .neq("estado", "completado")

  const [dosisHoy, pacientesHoy, vacunas30, impPend] = await Promise.all([
    dosisHoyQ,
    pacientesHoyQ,
    vacunas30Q,
    impPendQ,
  ])

  if (dosisHoy.error) throw new Error(dosisHoy.error.message)
  if (pacientesHoy.error) throw new Error(pacientesHoy.error.message)
  if (vacunas30.error) throw new Error(vacunas30.error.message)
  if (impPend.error) throw new Error(impPend.error.message)

  const pacientesUnicos = new Set((pacientesHoy.data ?? []).map((r) => r.paciente_id)).size
  const vacunasUnicas = new Set((vacunas30.data ?? []).map((r) => r.vacuna_id)).size

  return {
    dosisHoy: dosisHoy.count ?? 0,
    pacientesHoy: pacientesUnicos,
    vacunas30: vacunasUnicas,
    importacionesPendientes: impPend.count ?? 0,
  }
}