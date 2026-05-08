import { createSupabaseServerClient } from "@/lib/supabase/server"

export type PacienteRow = {
  id: string
  ci: string | null
  nombre: string
  apellido: string
  fecha_nacimiento: string
  sexo: string
  municipio_id: number | null
  direccion: string | null
  telefono: string | null
  created_at: string
  updated_at: string
}

export async function listarPacientes(params?: { q?: string; limit?: number }) {
  const supabase = await createSupabaseServerClient()

  const limit = params?.limit ?? 25
  const q = params?.q?.trim()

  let query = supabase
    .from("pacientes")
    .select(
      "id,ci,nombre,apellido,fecha_nacimiento,sexo,municipio_id,direccion,telefono,created_at,updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit)

  if (q) {
    // OJO: escapamos comillas por seguridad
    const safe = q.replaceAll('"', '\\"')
    query = query.or(
      `nombre.ilike.%${safe}%,apellido.ilike.%${safe}%,ci.ilike.%${safe}%`
    )
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data ?? []) as PacienteRow[]
}