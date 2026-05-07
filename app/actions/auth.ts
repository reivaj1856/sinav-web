"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { z } from "zod"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().refine((value) => value.length >= 8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
})

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    // En el siguiente paso lo conectamos a toast/UI de errores.
    throw new Error("Credenciales inválidas")
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) throw new Error(error.message)

  redirect("/dashboard")
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}