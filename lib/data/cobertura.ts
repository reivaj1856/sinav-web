import { createSupabaseServerClient } from "@/lib/supabase/server"

export type CoberturaRow = {
  municipio_id: number
  municipio: string
  departamento: string
  vacuna: string
  nombre_generico: string
  dosis_aplicadas: number
  anio: string
  mes: string
}

export async function getCoberturaMunicipal(params?: { limit?: number }) {
  const supabase = await createSupabaseServerClient()
  const limit = params?.limit ?? 50

  const { data, error } = await supabase
    .from("v_cobertura_municipal")
    .select(
      "municipio_id,municipio,departamento,vacuna,nombre_generico,dosis_aplicadas,anio,mes"
    )
    // orden: más reciente primero (anio/mes vienen como texto en tu view)
    .order("anio", { ascending: false })
    .order("mes", { ascending: false })
    .order("dosis_aplicadas", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as CoberturaRow[]
}