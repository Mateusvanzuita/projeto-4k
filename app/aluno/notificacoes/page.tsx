"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { notificacaoService, Notificacao } from "@/services/notificacao-service"
import { Bell, BellOff, Clock, Loader2, Info, Camera, CalendarClock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function NotificacoesPage() {
  // 💡 Inicializa sempre como um array vazio para evitar erros de undefined
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotificacoes()
  }, [])

  const loadNotificacoes = async () => {
    try {
      setLoading(true)
      const data = await notificacaoService.getAll()
      setNotificacoes(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    const success = await notificacaoService.markAsRead(id)
    if (success) {
      setNotificacoes(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    }
  }

  const getIcon = (message: string) => {
    const msg = message.toLowerCase()
    if (msg.includes("foto") || msg.includes("atualização")) return <Camera className="h-5 w-5" />
    if (msg.includes("plano") || msg.includes("renovação")) return <CalendarClock className="h-5 w-5" />
    return <Info className="h-5 w-5" />
  }

  return (
    <AppLayout menuItems={alunoMenuItems}>
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 pb-24">
        
        <div className="flex justify-between items-center pt-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> Notificações
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Central de Avisos</p>
          </div>
          {/* 💡 Adicionado opcional chaining (?.) para segurança total */}
          {notificacoes?.length > 0 && notificacoes.some(n => !n.read) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary font-black text-[10px] uppercase tracking-tighter"
              onClick={() => notificacaoService.markAllAsRead().then(loadNotificacoes)}
            >
              Ler todas
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-bold uppercase text-[10px] tracking-widest">Buscando avisos...</p>
          </div>
        ) : !notificacoes || notificacoes.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <BellOff className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Nenhuma notificação por aqui.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificacoes.map((notif) => (
              <Card 
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.read)}
                className={`border-none transition-all cursor-pointer rounded-[24px] overflow-hidden ${
                  notif.read ? 'bg-white opacity-70' : 'bg-white shadow-xl ring-1 ring-primary/10'
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 p-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'
                    }`}>
                      {getIcon(notif.message)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-black uppercase tracking-tight ${
                          notif.read ? 'text-slate-500' : 'text-slate-900'
                        }`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${
                        notif.read ? 'text-slate-400 italic' : 'text-slate-600 font-medium'
                      }`}>
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-1.5 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}