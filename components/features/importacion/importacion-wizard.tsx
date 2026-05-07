"use client"

import { useState } from "react"
import { prevalidarCsvAction, ejecutarImportacionAction } from "@/app/actions/importacion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ImportacionWizard() {
  const [pending, setPending] = useState(false)
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload")
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [result, setResult] = useState<any>(null)

  async function onPrevalidate(formData: FormData) {
    try {
      setPending(true)
      setError(null)
      const res = await prevalidarCsvAction(formData)
      setPending(false)

      if (!res?.ok) {
        setError(res?.error ?? 'Error en prevalidación')
        return
      }
      setPreview(res)
      setStep("preview")
    } catch (err: any) {
      setPending(false)
      setError(err?.message ?? String(err))
    }
  }

  async function onExecute() {
    if (!preview?.validRows) return
    try {
      setPending(true)
      setError(null)
      const res = await ejecutarImportacionAction(preview.validRows)
      setPending(false)

      if (!res?.ok) {
        setError(res?.error ?? 'Error en ejecución')
        return
      }
      setResult(res)
      setStep("done")
    } catch (err: any) {
      setPending(false)
      setError(err?.message ?? String(err))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await onPrevalidate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Importación CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "upload" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="file" type="file" accept=".csv" required />
            <Button type="submit" disabled={pending}>
              {pending ? "Validando..." : "Prevalidar CSV"}
            </Button>
          </form>
        ) : null}

        {step === "preview" ? (
          <div className="space-y-3">
            <div className="text-sm">
              Total: <b>{preview.summary.total}</b> • Válidas: <b>{preview.summary.valid}</b> • Inválidas:{" "}
              <b>{preview.summary.invalid}</b>
            </div>

            {preview.errors?.length ? (
              <div className="rounded-md border p-3 text-sm">
                <div className="mb-2 font-medium">Errores (muestra)</div>
                <ul className="space-y-1 text-muted-foreground">
                  {preview.errors.map((e: any) => (
                    <li key={e.row}>
                      Fila {e.row}: {e.error}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex gap-2">
              <Button onClick={onExecute} disabled={pending || preview.summary.valid === 0}>
                {pending ? "Importando..." : "Ejecutar importación"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStep("upload")
                  setPreview(null)
                  setError(null)
                }}
                disabled={pending}
              >
                Volver
              </Button>
            </div>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="space-y-2 text-sm">
            <div className="font-medium">Importación finalizada</div>
            <div className="text-muted-foreground">
              Exitosos: {result.data?.exitosos ?? "—"} • Errores: {result.data?.errores ?? "—"}
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setStep("upload")
                setPreview(null)
                setResult(null)
                setError(null)
              }}
            >
              Nueva importación
            </Button>
          </div>
        ) : null}

        {error ? <div className="text-sm text-destructive">{error}</div> : null}
      </CardContent>
    </Card>
  )
}