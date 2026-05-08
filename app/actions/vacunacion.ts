"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export type RegistrarDosisInput = {
  paciente_id: string
  vacuna_id: number
  establecimiento_id: string
  numero_dosis: number
  fecha_aplicacion: string // YYYY-MM-DD
  lote?: string | null
  via_aplicada?: string | null
  sitio_anatomico?: string | null
  temperatura_cadena?: number | null
  observaciones?: string | null
}

export async function registrarDosisAction(input: RegistrarDosisInput) {
  const supabase = await createSupabaseServerClient()

  const { data: authData, error: authErr } = await supabase.auth.getUser()
  if (authErr || !authData?.user) {
    return { ok: false, error: "Sesión inválida." }
  }

  const payload = {
    paciente_id: input.paciente_id,
    vacuna_id: input.vacuna_id,
    establecimiento_id: input.establecimiento_id,
    numero_dosis: input.numero_dosis,
    fecha_aplicacion: input.fecha_aplicacion,
    lote: input.lote ?? null,
    via_aplicada: input.via_aplicada ?? null,
    sitio_anatomico: input.sitio_anatomico ?? null,
    temperatura_cadena: input.temperatura_cadena ?? null,
    observaciones: input.observaciones ?? null,
    aplicado_por: authData.user.id, // NOT NULL
  }

  const { error } = await supabase.from("vacunacion_santa_cruz").insert(payload)
  if (error) return { ok: false, error: error.message }

  return { ok: true }
}