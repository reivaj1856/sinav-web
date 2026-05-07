import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

type CookieLike = { name: string; value: string }

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // En Next 16 algunos runtimes no exponen getAll(), pero el store sí suele tener get(name)
        getAll(): CookieLike[] {
          // Intento 1: si existe getAll (en algunos casos sí)
          const anyStore = cookieStore as any
          if (typeof anyStore.getAll === "function") {
            return anyStore.getAll().map((c: any) => ({ name: c.name, value: c.value }))
          }

          // Intento 2: iteración
          try {
            const all: CookieLike[] = []
            for (const c of anyStore as any) {
              if (c?.name && typeof c.value === "string") all.push({ name: c.name, value: c.value })
            }
            return all
          } catch {
            // Intento 3 (fallback): no hay forma genérica de listar cookies => retorna vacío
            return []
          }
        },

        setAll(cookiesToSet) {
          // En Server Actions normalmente SÍ deja setear cookies
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}