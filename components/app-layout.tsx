"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, Plus, Users, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/services/auth-service"
import { notificacaoService } from "@/services/notificacao-service"
import Link from "next/link"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
  variant?: string
}

interface AppLayoutProps {
  children: React.ReactNode
  menuItems: MenuItem[]
}

export function AppLayout({ children, menuItems }: AppLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  // Polling para o ícone do sino no layout
  useEffect(() => {
    const checkUnread = async () => {
      const data = await notificacaoService.getAll()
      setHasUnread(data.some(n => !n.read))
    }

    checkUnread()
    const interval = setInterval(checkUnread, 15000) // Verifica a cada 15s
    return () => clearInterval(interval)
  }, [])

  const getCurrentDate = () => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const now = new Date()
    return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`
  }

  const handleMenuItemClick = async (item: MenuItem) => {
    if (item.variant === "logout") {
      setIsDrawerOpen(false)
      await authService.logout()
      return
    }
    setIsDrawerOpen(false)
    router.push(item.href)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0" >
              <div className="flex flex-col h-full">
                <div className="bg-primary text-white p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{user?.name || ""}</h2>
                    <p className="text-sm text-white/80">{user?.email}</p>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                        item.variant === "logout" ? "text-red-500 hover:bg-red-50" : "hover:bg-accent"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 text-center">
            <p className="text-sm font-medium">Olá, {user?.name || ''}</p>
            <p className="text-xs text-white/80">{getCurrentDate()}</p>
          </div>

          <Link href={user?.userType === 'COACH' ? "/coach/notificacoes" : "/aluno/notificacoes"}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80 relative">
              <Bell className={`h-5 w-5 ${hasUnread ? "fill-white" : ""}`} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-primary rounded-full animate-pulse" />
              )}
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40">
        <div className="flex items-center justify-around px-4 py-2">
          <Link href={user?.userType === 'COACH' ? "/coach/alunos" : "/aluno/dashboard"}>
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs text-primary font-medium">
                {user?.userType === 'COACH' ? 'Alunos' : 'Início'}
              </span>
            </Button>
          </Link>
          <Link href={user?.userType === 'COACH' ? "/coach/protocolos" : "/aluno/protocolo"}>
            <Button className="relative -mt-8 h-14 w-14 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg">
              <Plus className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <Link href={user?.userType === 'COACH' ? "/coach/relatorios" : "/aluno/perfil"}>
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-4">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs text-primary font-medium">
                {user?.userType === 'COACH' ? 'Relatórios' : 'Perfil'}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}