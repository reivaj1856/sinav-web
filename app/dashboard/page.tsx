import { KpiCards } from "@/components/app/kpi-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <KpiCards
        items={[
          { title: "Dosis registradas (hoy)", value: "—", hint: "Filtrado por tus permisos (RLS)" },
          { title: "Pacientes atendidos (hoy)", value: "—" },
          { title: "Vacunas diferentes (30 días)", value: "—" },
          { title: "Importaciones pendientes", value: "—" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Próximo: tabla de últimas dosis registradas (desde vista segura).
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cobertura por municipio</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Próximo: gráfico desde <code>v_cobertura_municipal</code> (security_invoker=true).
          </CardContent>
        </Card>
      </div>
    </div>
  )
}