import { z } from "zod"

export const RegistrarDosisSchema = z.object({
  paciente_id: z.string().uuid(),
  vacuna_id: z.coerce.number().int().positive(),
  establecimiento_id: z.string().uuid(),
  numero_dosis: z.coerce.number().int().min(1).max(10),
  fecha_aplicacion: z.string().min(10), // "YYYY-MM-DD"
  lote: z.string().max(80).optional().or(z.literal("")),
  via_aplicada: z.string().optional().or(z.literal("")),
  sitio_anatomico: z.string().max(80).optional().or(z.literal("")),
  temperatura_cadena: z
    .union([z.coerce.number(), z.nan()])
    .optional(),
  observaciones: z.string().max(500).optional().or(z.literal("")),
})

export type RegistrarDosisInput = z.infer<typeof RegistrarDosisSchema>