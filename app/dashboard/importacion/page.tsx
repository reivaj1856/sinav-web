import { PageHeader } from "@/components/app/page-header"
import { ImportacionWizard } from "@/components/features/importacion/importacion-wizard"

export default function ImportacionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Importación CSV"
        description="Prevalidación por fila (Zod) + ejecución segura (Server Action → RPC importar_vacunacion_csv)."
      />
      <ImportacionWizard />
    </div>
  )
}