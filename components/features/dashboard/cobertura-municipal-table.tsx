import type { CoberturaRow } from "@/lib/data/cobertura"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function CoberturaMunicipalTable({ rows }: { rows: CoberturaRow[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Municipio</TableHead>
            <TableHead>Vacuna</TableHead>
            <TableHead className="text-right">Dosis</TableHead>
            <TableHead className="text-right">Período</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={`${r.municipio_id}-${r.vacuna}-${r.anio}-${r.mes}-${idx}`}>
              <TableCell>
                <div className="font-medium">{r.municipio}</div>
                <div className="text-xs text-muted-foreground">{r.departamento}</div>
              </TableCell>

              <TableCell>
                <div className="font-medium">{r.vacuna}</div>
                <div className="text-xs text-muted-foreground">{r.nombre_generico}</div>
              </TableCell>

              <TableCell className="text-right tabular-nums">{r.dosis_aplicadas}</TableCell>

              <TableCell className="text-right tabular-nums">
                {r.anio}-{String(r.mes).padStart(2, "0")}
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Sin datos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}