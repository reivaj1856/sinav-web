"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { RegistrarDosisSchema } from "@/lib/validators/vacunacion"

function daysBetween(a: Date, b: Date) {
  const ms = a.getTime() - b.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export async function registrarDosisAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    return { ok: false, error: "Sesión inválida. Vuelve a ingresar." }
  }

  const raw = Object.fromEntries(formData.entries())
  const parsed = RegistrarDosisSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos", issues: parsed.error.flatten() }
  }

  const input = parsed.data

  // 1) Prevalidación: traer paciente y vacuna (para feedback rápido)
  //    (RLS aplica: si el usuario no puede ver al paciente/vacuna, fallará)
  const [{ data: paciente, error: pErr }, { data: vacuna, error: vErr }] =
    await Promise.all([
      supabase
        .from("pacientes")
        .select("id, fecha_nacimiento, nombre, apellido")
        .eq("id", input.paciente_id)
        .single(),
      supabase
        .from("catalogo_vacunas_pai")
        .select("id, abreviatura, edad_minima_dias, edad_maxima_dias, dosis_total_esquema, intervalo_minimo_dias, activo")
        .eq("id", input.vacuna_id)
        .eq("activo", true)
        .single(),
    ])

  if (pErr || !paciente) return { ok: false, error: "Paciente no encontrado o no visible por permisos." }
  if (vErr || !vacuna) return { ok: false, error: "Vacuna no encontrada o inactiva." }

  const fechaAplicacion = new Date(input.fecha_aplicacion + "T00:00:00Z")
  const fechaNac = new Date(paciente.fecha_nacimiento + "T00:00:00Z")
  const edadDias = daysBetween(fechaAplicacion, fechaNac)

  if (edadDias < vacuna.edad_minima_dias) {
    return {
      ok: false,
      error: `Validación PAI: paciente muy joven para ${vacuna.abreviatura}. Mínimo ${vacuna.edad_minima_dias} días.`,
    }
  }
  if (vacuna.edad_maxima_dias != null && edadDias > vacuna.edad_maxima_dias) {
    return {
      ok: false,
      error: `Validación PAI: fuera de rango para ${vacuna.abreviatura}. Máximo ${vacuna.edad_maxima_dias} días.`,
    }
  }
  if (input.numero_dosis > vacuna.dosis_total_esquema) {
    return {
      ok: false,
      error: `Validación PAI: ${vacuna.abreviatura} tiene máximo ${vacuna.dosis_total_esquema} dosis.`,
    }
  }

  // 2) Llamada RPC transaccional (la BD impone las reglas finales)
  const { data: rpcData, error: rpcError } = await supabase.rpc("registrar_vacunacion", {
    p_paciente_id: input.paciente_id,
    p_vacuna_id: input.vacuna_id,
    p_establecimiento_id: input.establecimiento_id,
    p_numero_dosis: input.numero_dosis,
    p_fecha_aplicacion: input.fecha_aplicacion,
    p_lote: input.lote || null,
    p_via_aplicada: (input.via_aplicada || null) as any,
    p_sitio_anatomico: input.sitio_anatomico || null,
    p_temperatura_cadena: typeof input.temperatura_cadena === "number" ? input.temperatura_cadena : null,
    p_observaciones: input.observaciones || null,
  })

  if (rpcError) {
    // Mensajes ya vienen “clínicos” desde SQL (SQLERRM)
    return { ok: false, error: rpcError.message }
  }

  return { ok: true, data: rpcData }
}