"use client"

import { logoutAction } from "@/app/actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu({ displayName }: { displayName: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logoutAction} className="w-full">
            <button className="w-full text-left">Cerrar sesión</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}