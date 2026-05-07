export type NavItem = {
  title: string
  href: string
  roles?: Array<"admin" | "medico" | "enfermeria" | "consulta">
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", roles: ["admin", "medico", "enfermeria", "consulta"] },
  { title: "Pacientes", href: "/dashboard/pacientes", roles: ["admin", "medico", "enfermeria", "consulta"] },
  { title: "Vacunación", href: "/dashboard/vacunacion", roles: ["admin", "medico", "enfermeria"] },
  { title: "Importación CSV", href: "/dashboard/importacion", roles: ["admin", "medico"] },
  { title: "Reportes", href: "/dashboard/reportes", roles: ["admin", "consulta", "medico", "enfermeria"] },
]