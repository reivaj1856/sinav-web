import { createSupabaseServerClient } from "@/lib/supabase/server"

export type ActividadRow = {
  establecimiento_id: string
  establecimiento: string
  dia: string // timestamptz (viene como string)
  total_dosis: number
  pacientes_atendidos: number
  vacunas_diferentes: number
}

export async function getActividadEstablecimiento(params?: { limit?: number }) {
  const supabase = await createSupabaseServerClient()
  const limit = params?.limit ?? 14

  const { data, error } = await supabase
    .from("v_actividad_establecimiento")
    .select(
      "establecimiento_id,establecimiento,dia,total_dosis,pacientes_atendidos,vacunas_diferentes"
    )
    .order("dia", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as ActividadRow[]
}