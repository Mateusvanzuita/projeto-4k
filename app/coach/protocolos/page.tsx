"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Copy, Trash2, Eye } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { protocoloService } from "@/services/protocolo-service"
import { alunoService } from "@/services/aluno-service"
import type { Protocolo, StatusProtocolo } from "@/types/protocolo"
import type { Aluno } from "@/types/aluno"
import { STATUS_PROTOCOLO_LABELS } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"

export default function ProtocolosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [protocolos, setProtocolos] = useState<Protocolo[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusProtocolo | "todos">("todos")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [protocolosData, alunosData] = await Promise.all([protocoloService.getAll(), alunoService.getAll()])
      setProtocolos(protocolosData)
      setAlunos(alunosData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os protocolos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getAlunoById = (alunoId: string) => {
    return alunos.find((a) => a.id === alunoId)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este protocolo?")) return

    try {
      await protocoloService.delete(id)
      setProtocolos(protocolos.filter((p) => p.id !== id))
      toast({
        title: "Sucesso",
        description: "Protocolo excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o protocolo.",
        variant: "destructive",
      })
    }
  }

  const handleClone = async (id: string) => {
    try {
      const cloned = await protocoloService.clone(id)
      setProtocolos([cloned, ...protocolos])
      toast({
        title: "Sucesso",
        description: "Protocolo clonado com sucesso.",
      })
      router.push(`/coach/protocolos/${cloned.id}/editar`)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível clonar o protocolo.",
        variant: "destructive",
      })
    }
  }

  const filteredProtocolos = protocolos.filter((protocolo) => {
    const aluno = getAlunoById(protocolo.alunoId)
    const matchesSearch = aluno?.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || protocolo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={() => router.push("/coach/protocolos/novo")}
      onNavigateAlunos={() => router.push("/coach/alunos")}
      onNavigateRelatorios={() => router.push("/coach/relatorios")}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Protocolos</h1>
            <p className="text-sm text-muted-foreground">Gerencie os protocolos dos seus alunos</p>
          </div>
          <Button onClick={() => router.push("/coach/protocolos/novo")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Protocolo
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusProtocolo | "todos")}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="ativo">Ativos</TabsTrigger>
            <TabsTrigger value="rascunho">Rascunhos</TabsTrigger>
            <TabsTrigger value="pausado">Pausados</TabsTrigger>
            <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : filteredProtocolos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || statusFilter !== "todos"
              ? "Nenhum protocolo encontrado com os filtros aplicados."
              : "Nenhum protocolo cadastrado ainda."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProtocolos.map((protocolo) => {
              const aluno = getAlunoById(protocolo.alunoId)
              return (
                <Card key={protocolo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {aluno?.nomeCompleto.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{aluno?.nomeCompleto || "Aluno não encontrado"}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(protocolo.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          protocolo.status === "ativo"
                            ? "default"
                            : protocolo.status === "rascunho"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {STATUS_PROTOCOLO_LABELS[protocolo.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {protocolo.planoAlimentar && <Badge variant="outline">Dieta</Badge>}
                      {protocolo.planoTreino && <Badge variant="outline">Treino</Badge>}
                      {protocolo.planoSuplementacao && <Badge variant="outline">Suplementos</Badge>}
                      {protocolo.planoHormonios && <Badge variant="outline">Hormônios</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => router.push(`/coach/protocolos/${protocolo.id}`)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleClone(protocolo.id)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(protocolo.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
