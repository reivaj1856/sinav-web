import { KpiCards } from "@/components/app/kpi-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getDashboardKpis } from "@/lib/data/dashboard"
import { getActividadEstablecimiento } from "@/lib/data/actividad"
import { ActividadRecienteTable } from "@/components/features/dashboard/actividad-reciente-table"

import { getCoberturaMunicipal } from "@/lib/data/cobertura"
import { CoberturaMunicipalTable } from "@/components/features/dashboard/cobertura-municipal-table"

export default async function DashboardPage() {
  const [kpis, actividad, cobertura] = await Promise.all([
    getDashboardKpis(),
    getActividadEstablecimiento({ limit: 7 }),
    getCoberturaMunicipal({ limit: 10 }),
  ])

  return (
    <div className="space-y-6">
      <KpiCards
        items={[
          { title: "Dosis registradas (hoy)", value: kpis.dosisHoy.toString(), hint: "Filtrado por tus permisos (RLS)" },
          { title: "Pacientes atendidos (hoy)", value: kpis.pacientesHoy.toString() },
          { title: "Vacunas diferentes (30 días)", value: kpis.vacunas30.toString() },
          { title: "Importaciones pendientes", value: kpis.importacionesPendientes.toString() },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ActividadRecienteTable rows={actividad} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cobertura por municipio</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <CoberturaMunicipalTable rows={cobertura} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}