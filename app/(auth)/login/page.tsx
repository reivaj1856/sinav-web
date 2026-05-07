import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { loginAction } from "@/app/actions/auth"

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (data.user) redirect("/dashboard")

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Ingresar</CardTitle>
          <p className="text-sm text-muted-foreground">
            Acceso institucional — Sistema Nacional de Vacunación
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" action={loginAction}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button className="w-full" type="submit">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}