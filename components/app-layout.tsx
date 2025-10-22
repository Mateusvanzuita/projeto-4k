"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, Plus, Users, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
}

interface AppLayoutProps {
  children: React.ReactNode
  menuItems: MenuItem[]
  onCreateProtocol?: () => void
  onNavigateAlunos?: () => void
  onNavigateRelatorios?: () => void
}

export function AppLayout({
  children,
  menuItems,
  onCreateProtocol,
  onNavigateAlunos,
  onNavigateRelatorios,
}: AppLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Format current date
  const getCurrentDate = () => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    const now = new Date()
    const dayName = days[now.getDay()]
    const day = now.getDate()
    const month = months[now.getMonth()]

    return `${dayName}, ${day} de ${month}`
  }

  const handleMenuItemClick = (href: string) => {
    router.push(href)
    setIsDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="bg-primary text-white p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{user?.name || "Usuário"}</h2>
                    <p className="text-sm text-white/80">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-primary/80"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-accent transition-colors"
                      onClick={() => handleMenuItemClick(item.href)}
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
            <p className="text-sm font-medium">Olá, {user?.name || "Usuário"}</p>
            <p className="text-xs text-white/80">{getCurrentDate()}</p>
          </div>

          <Button variant="ghost" size="icon" className="text-white hover:bg-primary/80 relative">
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-secondary rounded-full" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40">
        <div className="flex items-center justify-around px-4 py-2">
          {/* Alunos Button */}
          <Link href={"/coach/alunos"}>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 px-4"
            onClick={onNavigateAlunos}
          >
            <Users className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-medium">Alunos</span>
          </Button>
          </Link>
          {/* Create Protocol Button (Central) */}
          <Link href={"/coach/protocolos"}>
          <Button
            className="relative -mt-8 h-14 w-14 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
            onClick={onCreateProtocol}
          >
            <Plus className="h-6 w-6 text-primary" />
          </Button>
          </Link>
          {/* Relatórios Button */}
          <Link href={"/coach/relatorios"}>
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 px-4"
            onClick={onNavigateRelatorios}
          >
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-medium">Relatórios</span>
          </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
