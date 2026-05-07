"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import Papa from "papaparse"
import { CsvRowSchema, type CsvRow } from "@/lib/validators/importacion"

function normalizeRecord(r: Record<string, any>) {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(r)) {
    const key = k.trim()
    if (typeof v === "string") {
      const vv = v.trim()
      out[key] = vv === "" ? undefined : vv
    } else {
      out[key] = v
    }
  }
  return out
}

function parseCsv(text: string) {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })
  if (parsed.errors?.length) {
    throw new Error(parsed.errors[0].message)
  }
  return parsed.data.map(normalizeRecord)
}

export async function prevalidarCsvAction(formData: FormData) {
  const file = formData.get("file") as File | null
  if (!file) return { ok: false, error: "Archivo no encontrado." }
  if (!file.name.toLowerCase().endsWith(".csv")) return { ok: false, error: "Formato inválido. Debe ser .csv" }

  const text = await file.text()
  let rowsRaw: Record<string, any>[]
  try {
    rowsRaw = parseCsv(text)
  } catch (e: any) {
    return { ok: false, error: `CSV inválido: ${e.message}` }
  }

  // Validación explícita de headers esperados (fail fast)
  const expected = [
    "paciente_id",
    "vacuna_id",
    "establecimiento_id",
    "numero_dosis",
    "fecha_aplicacion",
    "lote",
    "via_aplicada",
    "observaciones",
  ]
  const first = rowsRaw[0] ?? {}
  const headers = Object.keys(first)
  const missing = expected.filter(h => !headers.includes(h))
  if (missing.length) {
    return { ok: false, error: `CSV inválido: faltan columnas: ${missing.join(", ")}` }
  }

  const valid: CsvRow[] = []
  const errors: Array<{ row: number; error: string; data: any }> = []

  rowsRaw.forEach((r, idx) => {
    const rowNumber = idx + 2 // header en fila 1
    const res = CsvRowSchema.safeParse(r)
    if (!res.success) {
      errors.push({
        row: rowNumber,
        error: res.error.issues[0]?.message ?? "Fila inválida",
        data: r,
      })
    } else {
      valid.push(res.data)
    }
  })

  return {
    ok: true,
    summary: { total: rowsRaw.length, valid: valid.length, invalid: errors.length },
    sample: valid.slice(0, 20),
    errors: errors.slice(0, 50),
    validRows: valid,
  }
}

export async function ejecutarImportacionAction(validRows: CsvRow[]) {
  const supabase = await createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) return { ok: false, error: "Sesión inválida." }

  const { data: imp, error: impErr } = await supabase
    .from("importaciones_csv")
    .insert({ importado_por: authData.user.id, estado: "pendiente" })
    .select("id")
    .single()

  if (impErr || !imp?.id) return { ok: false, error: "No se pudo crear la importación." }

  const { data: rpcData, error: rpcError } = await supabase.rpc("importar_vacunacion_csv", {
    p_importacion_id: imp.id,
    p_registros: validRows,
  })

  if (rpcError) return { ok: false, error: rpcError.message }
  return { ok: true, data: rpcData, importacion_id: imp.id }
}