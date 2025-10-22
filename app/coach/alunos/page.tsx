"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { AlunoCard } from "@/components/aluno-card"
import { AlunoFormDialog } from "@/components/aluno-form-dialog"
import { alunoService } from "@/services/aluno-service"
import { coachMenuItems } from "@/lib/menu-items"
import { useToast } from "@/hooks/use-toast"
import type { Aluno, AlunoFormData, Objetivo } from "@/types/aluno"

export default function AlunosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [objetivoFilter, setObjetivoFilter] = useState<Objetivo | "todos">("todos")
  const [planoFilter, setPlanoFilter] = useState<string>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | undefined>()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAlunos()
  }, [])

  useEffect(() => {
    filterAlunos()
  }, [alunos, searchTerm, objetivoFilter, planoFilter])

  const loadAlunos = async () => {
    try {
      setIsLoading(true)
      const data = await alunoService.getAll()
      setAlunos(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar alunos",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterAlunos = () => {
    let filtered = alunos

    if (searchTerm) {
      filtered = filtered.filter(
        (aluno) =>
          aluno.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          aluno.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (objetivoFilter !== "todos") {
      filtered = filtered.filter((aluno) => aluno.objetivo === objetivoFilter)
    }

    if (planoFilter !== "todos") {
      filtered = filtered.filter((aluno) => aluno.tipoPlano === planoFilter)
    }

    setFilteredAlunos(filtered)
  }

  const handleAddAluno = () => {
    setEditingAluno(undefined)
    setIsDialogOpen(true)
  }

  const handleEditAluno = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setIsDialogOpen(true)
  }

  const handleDeleteAluno = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return

    try {
      await alunoService.delete(id)
      setAlunos(alunos.filter((a) => a.id !== id))
      toast({
        title: "Aluno excluído",
        description: "O aluno foi removido com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir aluno",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (data: AlunoFormData) => {
    try {
      setIsSaving(true)

      if (editingAluno) {
        const updated = await alunoService.update(editingAluno.id, data)
        setAlunos(alunos.map((a) => (a.id === updated.id ? updated : a)))
        toast({
          title: "Aluno atualizado",
          description: "As informações foram salvas com sucesso",
        })
      } else {
        const newAluno = await alunoService.create(data)
        setAlunos([newAluno, ...alunos])
        toast({
          title: "Aluno adicionado",
          description: "O novo aluno foi cadastrado com sucesso",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar aluno",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAlunoClick = (id: string) => {
    router.push(`/coach/alunos/${id}`)
  }

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
            <h1 className="text-2xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">Gerencie seus alunos e acompanhe o progresso</p>
          </div>
          <Button onClick={handleAddAluno}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Aluno
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={planoFilter} onValueChange={setPlanoFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo de Plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Planos</SelectItem>
              <SelectItem value="treino">Treino</SelectItem>
              <SelectItem value="dieta">Dieta</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={objetivoFilter} onValueChange={(value) => setObjetivoFilter(value as Objetivo | "todos")}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="perda_peso">Perda de Peso</TabsTrigger>
            <TabsTrigger value="hipertrofia">Hipertrofia</TabsTrigger>
            <TabsTrigger value="definicao">Definição</TabsTrigger>
            <TabsTrigger value="saude">Saúde</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reabilitacao">Reabilitação</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando alunos...</div>
        ) : filteredAlunos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || objetivoFilter !== "todos" || planoFilter !== "todos"
              ? "Nenhum aluno encontrado com os filtros aplicados"
              : "Nenhum aluno cadastrado ainda"}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredAlunos.length} {filteredAlunos.length === 1 ? "aluno" : "alunos"}
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAlunos.map((aluno) => (
                <AlunoCard
                  key={aluno.id}
                  aluno={aluno}
                  onEdit={handleEditAluno}
                  onDelete={handleDeleteAluno}
                  onClick={handleAlunoClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <AlunoFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        aluno={editingAluno}
        isLoading={isSaving}
      />
    </AppLayout>
  )
}
