import { z } from "zod"

const dateYYYYMMDD = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "fecha_aplicacion debe tener formato YYYY-MM-DD")

export const CsvRowSchema = z.object({
  paciente_id: z.string().uuid(),
  vacuna_id: z.coerce.number().int().positive(),
  establecimiento_id: z.string().uuid(),
  numero_dosis: z.coerce.number().int().min(1).max(10).default(1),
  fecha_aplicacion: dateYYYYMMDD,
  lote: z.string().max(80).optional().transform(v => (v?.trim() ? v.trim() : undefined)),
  via_aplicada: z.string().max(30).optional().transform(v => (v?.trim() ? v.trim() : undefined)),
  observaciones: z.string().max(500).optional().transform(v => (v?.trim() ? v.trim() : undefined)),
})

export type CsvRow = z.infer<typeof CsvRowSchema>