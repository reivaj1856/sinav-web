import type { ActividadRow } from "@/lib/data/actividad"

function formatDia(dia: string) {
  const d = new Date(dia)
  // formato simple YYYY-MM-DD (evita problemas de locale)
  return d.toISOString().slice(0, 10)
}

export function ActividadRecienteTable({ rows }: { rows: ActividadRow[] }) {
  return (
    <div className="rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Día</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Establecimiento</th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Dosis</th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Pacientes</th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Vacunas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={`${r.establecimiento_id}-${r.dia}-${idx}`} className="border-b last:border-0">
              <td className="p-4 align-middle tabular-nums">{formatDia(r.dia)}</td>
              <td className="p-4 align-middle font-medium">{r.establecimiento}</td>
              <td className="p-4 align-middle text-right tabular-nums">{r.total_dosis}</td>
              <td className="p-4 align-middle text-right tabular-nums">{r.pacientes_atendidos}</td>
              <td className="p-4 align-middle text-right tabular-nums">{r.vacunas_diferentes}</td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="h-24 px-4 text-center text-muted-foreground">
                Sin actividad.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}