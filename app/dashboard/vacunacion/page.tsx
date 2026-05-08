// app/dashboard/vacunacion/page.tsx
import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent } from "@/components/ui/card"
import RegistrarDosisForm from "@/components/features/vacunacion/registrar-dosis-form"
import { getVacunacionFormData } from "@/lib/data/vacunacion"

export default async function VacunacionPage() {
  const { vacunas, establecimientos, pacientes } = await getVacunacionFormData()

  return (
    <div className="space-y-6">
      <PageHeader title="Vacunación" description="Registrar dosis aplicada." />

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            Debug: vacunas={vacunas.length} establecimientos={establecimientos.length} pacientes={pacientes.length}
          </div>

          <RegistrarDosisForm
            vacunas={vacunas}
            establecimientos={establecimientos}
            pacientes={pacientes}
          />
        </CardContent>
      </Card>
    </div>
  )
}