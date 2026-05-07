import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VacunacionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registro de vacunación"
        description="Registro transaccional y validado (rangos PAI, duplicados, intervalos)."
        right={<Button>Registrar dosis</Button>}
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Próximo: formulario guiado + validación Zod + Server Action que llama RPC registrar_vacunacion.
        </CardContent>
      </Card>
    </div>
  )
}