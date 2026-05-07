import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        description="Búsqueda y registro. La visibilidad se infiere por vacunación (RLS)."
        right={<Button>Nuevo paciente</Button>}
      />

      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Próximo: tabla (ShadCN + TanStack) con búsqueda y paginación.
        </CardContent>
      </Card>
    </div>
  )
}