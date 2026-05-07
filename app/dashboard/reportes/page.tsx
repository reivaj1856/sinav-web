import { PageHeader } from "@/components/app/page-header"
import { Card, CardContent } from "@/components/ui/card"

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Estadísticas desde vistas seguras (security_invoker=true) respetando RLS."
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Próximo: filtros (fecha, vacuna, municipio) + tablas/gráficos.
        </CardContent>
      </Card>
    </div>
  )
}