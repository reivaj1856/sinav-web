import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { listarPacientes } from "@/lib/data/pacientes"
import PacientesTable from "@/components/features/pacientes/pacientes-table"

export default async function PacientesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const sp = (await searchParams) ?? {}
  const q = sp.q?.trim() ?? ""

  const pacientes = await listarPacientes({ q, limit: 50 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        description="Búsqueda y registro. La visibilidad se infiere por vacunación (RLS)."
        right={
          <Button asChild>
            <Link href="/pacientes/nuevo">Nuevo paciente</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Si tu tabla ya incluye search, puedes quitar este form */}
          <form className="flex gap-2" action="/pacientes" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por CI, nombre o apellido…"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
          </form>

          <PacientesTable items={pacientes} />
        </CardContent>
      </Card>
    </div>
  )
}