"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { AlunoCard } from "@/components/aluno-card"
import { AlunoFormDialog } from "@/components/aluno-form-dialog"
import { alunoService } from "@/services/aluno-service"
import { coachMenuItems } from "@/lib/menu-items"
import { toast } from "sonner"
import type { Aluno, AlunoFormData } from "@/types/aluno"

export default function AlunosPage() {
  const router = useRouter()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [planoFilter, setPlanoFilter] = useState<string>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | undefined>()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAlunos()
  }, [])

  useEffect(() => {
    filterAlunos()
  }, [alunos, searchTerm, planoFilter])

  const loadAlunos = async () => {
    try {
      setIsLoading(true)
      const data = await alunoService.getAll()
      setAlunos(data)
    } catch (error) {
      toast.error("Erro ao carregar alunos")
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
          aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (aluno.objetivo && aluno.objetivo.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (planoFilter !== "todos") {
      filtered = filtered.filter((aluno) => aluno.tipoPlano === planoFilter.toUpperCase())
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
    try {
      await alunoService.delete(id)
      setAlunos(alunos.filter((a) => a.id !== id))
      toast.success("Aluno excluído com sucesso")
    } catch (error) {
      toast.error("Erro ao excluir aluno")
    }
  }

  const handleSubmit = async (data: AlunoFormData) => {
    try {
      setIsSaving(true)

      if (editingAluno) {
        const updated = await alunoService.update(editingAluno.id, data)
        setAlunos(alunos.map((a) => (a.id === updated.id ? updated : a)))
        toast.success("Aluno atualizado")
      } else {
        const newAluno = await alunoService.create(data)
        setAlunos([newAluno, ...alunos])
        toast.success("Aluno adicionado")
      }

      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Erro ao salvar aluno")
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
              placeholder="Buscar por nome, email ou objetivo..."
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

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando alunos...</div>
        ) : filteredAlunos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || planoFilter !== "todos"
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
