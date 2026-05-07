"use client"

import { useState } from "react"
import { registrarDosisAction } from "@/app/actions/vacunacion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  // En el siguiente paso esto lo poblamos desde DB (pacientes/vacunas/establecimiento actual)
  defaultEstablecimientoId?: string
}

export function RegistrarDosisForm({ defaultEstablecimientoId }: Props) {
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setPending(true)
    setResult(null)
    const res = await registrarDosisAction(formData)
    setPending(false)
    setResult(res.ok ? { ok: true } : { ok: false, error: res.error })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registrar dosis</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Paciente (UUID)</Label>
            <Input name="paciente_id" placeholder="uuid del paciente" required />
          </div>

          <div className="space-y-2">
            <Label>Vacuna (ID catálogo)</Label>
            <Input name="vacuna_id" placeholder="ej: 12" required />
          </div>

          <div className="space-y-2">
            <Label>Establecimiento (UUID)</Label>
            <Input
              name="establecimiento_id"
              defaultValue={defaultEstablecimientoId}
              placeholder="uuid del establecimiento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Número de dosis</Label>
            <Input name="numero_dosis" type="number" min={1} defaultValue={1} required />
          </div>

          <div className="space-y-2">
            <Label>Fecha de aplicación</Label>
            <Input name="fecha_aplicacion" type="date" required />
          </div>

          <div className="space-y-2">
            <Label>Lote (opcional)</Label>
            <Input name="lote" placeholder="lote" />
          </div>

          <div className="space-y-2">
            <Label>Vía aplicada (opcional)</Label>
            <Input name="via_aplicada" placeholder="IM / SC / ORAL ..." />
          </div>

          <div className="space-y-2">
            <Label>Temperatura cadena (opcional)</Label>
            <Input name="temperatura_cadena" type="number" step="0.1" placeholder="ej: 4.0" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Observaciones (opcional)</Label>
            <Input name="observaciones" placeholder="..." />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Registrando..." : "Registrar"}
            </Button>

            {result?.ok ? (
              <span className="text-sm text-green-700">Registro exitoso.</span>
            ) : result?.error ? (
              <span className="text-sm text-destructive">{result.error}</span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}