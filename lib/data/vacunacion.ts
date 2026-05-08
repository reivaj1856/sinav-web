import { createSupabaseServerClient } from "@/lib/supabase/server"

export type VacunaPai = {
  id: number
  nombre_comercial: string
  abreviatura: string
  via_administracion: string
  activo: boolean | null
}

export type Establecimiento = {
  id: string
  nombre: string
  municipio_id: number
}

export type PacientePick = {
  id: string
  ci: string | null
  nombre: string
  apellido: string
  fecha_nacimiento: string
}

export async function getVacunacionFormData() {
  const supabase = await createSupabaseServerClient()

  const [{ data: vacunas, error: vacErr }, { data: estabs, error: estErr }, { data: pacientes, error: pacErr }] =
    await Promise.all([
      supabase
        .from("catalogo_vacunas_pai")
        .select("id,nombre_comercial,abreviatura,via_administracion,activo")
        .eq("activo", true)
        .order("id", { ascending: true }),
      supabase
        .from("establecimientos")
        .select("id,nombre,municipio_id")
        .order("nombre", { ascending: true })
        .limit(200),
      supabase
        .from("pacientes")
        .select("id,ci,nombre,apellido,fecha_nacimiento")
        .order("created_at", { ascending: false })
        .limit(200),
    ])

  if (vacErr) throw new Error(vacErr.message)
  if (estErr) throw new Error(estErr.message)
  if (pacErr) throw new Error(pacErr.message)

  return {
    vacunas: (vacunas ?? []) as VacunaPai[],
    establecimientos: (estabs ?? []) as Establecimiento[],
    pacientes: (pacientes ?? []) as PacientePick[],
  }
}