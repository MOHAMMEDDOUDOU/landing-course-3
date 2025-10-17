"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sparkles, LogOut, User } from "lucide-react"

export function Header() {
  const { user, logout, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">كورس AI للبرمجة</span>
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name || user.email} />
                    <AvatarFallback>{user.name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="ml-2 h-4 w-4" />
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild>
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
