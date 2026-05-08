"use client"

import * as React from "react"
import type { VacunaPai, Establecimiento, PacientePick } from "@/lib/data/vacunacion"
import { registrarDosisAction } from "@/app/actions/vacunacion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = {
  vacunas: VacunaPai[]
  establecimientos: Establecimiento[]
  pacientes: PacientePick[]
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function RegistrarDosisForm({ vacunas, establecimientos, pacientes }: Props) {
  const [pacienteId, setPacienteId] = React.useState(pacientes[0]?.id ?? "")
  const [vacunaId, setVacunaId] = React.useState<number>(vacunas[0]?.id ?? 0)
  const [establecimientoId, setEstablecimientoId] = React.useState(establecimientos[0]?.id ?? "")

  const [numeroDosis, setNumeroDosis] = React.useState<number>(1)
  const [fechaAplicacion, setFechaAplicacion] = React.useState<string>(ymd(new Date()))
  const [lote, setLote] = React.useState<string>("")
  const [observaciones, setObservaciones] = React.useState<string>("")

  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [ok, setOk] = React.useState<string | null>(null)

  const disabled =
    pending ||
    !pacienteId ||
    !establecimientoId ||
    !vacunaId ||
    !fechaAplicacion ||
    numeroDosis < 1

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setOk(null)

    const res = await registrarDosisAction({
      paciente_id: pacienteId,
      vacuna_id: vacunaId,
      establecimiento_id: establecimientoId,
      numero_dosis: Number(numeroDosis),
      fecha_aplicacion: fechaAplicacion,
      lote: lote.trim() || null,
      observaciones: observaciones.trim() || null,
      // via_aplicada: opcional (si luego lo agregas en UI)
    })

    setPending(false)

    if (!res.ok) {
      setError(res.error ?? "No se pudo registrar la dosis.")
      return
    }

    setOk("Dosis registrada.")
    setLote("")
    setObservaciones("")
    setNumeroDosis(1)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {pacientes.length} pacientes · {vacunas.length} vacunas · {establecimientos.length} establecimientos
      </div>

      <Card className="p-4">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Paciente</span>
            <select
              className="h-9 rounded-md border bg-background px-2"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.ci ? `${p.ci} - ` : "") + `${p.apellido} ${p.nombre}`} ({p.fecha_nacimiento})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Vacuna</span>
            <select
              className="h-9 rounded-md border bg-background px-2"
              value={String(vacunaId)}
              onChange={(e) => setVacunaId(Number(e.target.value))}
            >
              {vacunas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.abreviatura} — {v.nombre_comercial} ({v.via_administracion})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Establecimiento</span>
            <select
              className="h-9 rounded-md border bg-background px-2"
              value={establecimientoId}
              onChange={(e) => setEstablecimientoId(e.target.value)}
            >
              {establecimientos.map((es) => (
                <option key={es.id} value={es.id}>
                  {es.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Fecha de aplicación</span>
            <input
              type="date"
              className="h-9 rounded-md border bg-background px-2"
              value={fechaAplicacion}
              onChange={(e) => setFechaAplicacion(e.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Número de dosis</span>
            <input
              type="number"
              min={1}
              className="h-9 rounded-md border bg-background px-2"
              value={numeroDosis}
              onChange={(e) => setNumeroDosis(Number(e.target.value))}
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Lote (opcional)</span>
            <input
              className="h-9 rounded-md border bg-background px-2"
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              placeholder="Ej: L-BCG-001"
            />
          </label>

          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-muted-foreground">Observaciones (opcional)</span>
            <textarea
              className="min-h-20 rounded-md border bg-background p-2"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas clínicas…"
            />
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={disabled}>
              {pending ? "Guardando..." : "Registrar dosis"}
            </Button>
            {error && <div className="text-sm text-destructive">{error}</div>}
            {ok && <div className="text-sm text-green-600">{ok}</div>}
          </div>
        </form>
      </Card>
    </div>
  )
}