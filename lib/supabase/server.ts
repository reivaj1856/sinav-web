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
        getAll(): CookieLike[] {
          const anyStore = cookieStore as any

          if (typeof anyStore.getAll === "function") {
            return anyStore.getAll().map((c: any) => ({ name: c.name, value: c.value }))
          }

          try {
            const all: CookieLike[] = []
            for (const c of anyStore as any) {
              if (c?.name && typeof c.value === "string") all.push({ name: c.name, value: c.value })
            }
            return all
          } catch {
            return []
          }
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...(options ?? {}) })
            })
          } catch {
            // en algunos contextos no se puede mutar cookies
          }
        },
      },
    }
  )
}