"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, Filter } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { ExercicioCard } from "@/components/exercicio-card"
import { ExercicioFormDialog } from "@/components/exercicio-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coachMenuItems } from "@/lib/menu-items"
import { exercicioService } from "@/services/exercicio-service" 
import type { Exercicio, ExercicioFormData } from "@/types/exercicio"
import { toast } from "sonner"

// Grupos musculares alinhados ao seu backend
const GRUPOS_TAB = ["todos", "peito", "costas", "ombros", "pernas", "biceps", "triceps", "abdomen"] as const

export default function ExerciciosPage() {
  const router = useRouter()
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrupo, setSelectedGrupo] = useState<typeof GRUPOS_TAB[number]>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExercicio, setEditingExercicio] = useState<Exercicio | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const loadExercicios = useCallback(async (page = 1) => {
    try {
      setIsFetching(true)
      const params: any = { 
          page, 
          limit: 10,
      }
      if (selectedGrupo !== "todos") {
          params.grupoMuscular = selectedGrupo.toUpperCase()
      }
      if (searchQuery) {
          params.nomeExercicio = searchQuery
      }

      const result = await exercicioService.getAll(params) 
      
      setExercicios(result.exercicios)
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (error) {
      toast.error("Erro ao carregar exercícios")
    } finally {
      setIsFetching(false)
    }
  }, [selectedGrupo, searchQuery])

  useEffect(() => {
    loadExercicios(1)
  }, [selectedGrupo, searchQuery, loadExercicios])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadExercicios(newPage)
      window.scrollTo(0, 0)
    }
  }

  const handleAddExercicio = () => {
    setEditingExercicio(null)
    setIsDialogOpen(true)
  }

  const handleEditExercicio = (exercicio: Exercicio) => {
    setEditingExercicio(exercicio)
    setIsDialogOpen(true)
  }

  const handleSubmitForm = async (data: ExercicioFormData) => {
    setIsLoading(true)
    try {
      if (editingExercicio) {
        await exercicioService.update(editingExercicio.id, data)
        toast.success("Exercício atualizado com sucesso.")
      } else {
        await exercicioService.create(data)
        toast.success("Exercício criado com sucesso.")
      }
      setIsDialogOpen(false)
      setEditingExercicio(null)
      loadExercicios(1)
    } catch (error) {
      toast.error("Erro ao salvar o exercício.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExercicio = async (id: string) => {
    try {
      await exercicioService.delete(id)
      toast.success("Exercício excluído com sucesso.")
      loadExercicios(pagination.page)
    } catch (error) {
      toast.error("Erro ao excluir o exercício.")
    }
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 space-y-4 pb-20">
        {/* Header Identêntico ao de Alimentos */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exercícios</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-tight">
              Gerencie seu banco de treinos
            </p>
          </div>
          <Button onClick={handleAddExercicio} size="lg" className="rounded-2xl">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Container de Filtros com a mesma estrutura de Alimentos */}
        <div className="space-y-6 mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do exercício..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <Tabs 
            value={selectedGrupo} 
            onValueChange={(value) => setSelectedGrupo(value as any)} 
            className="w-full"
          >
            <TabsList className="w-full h-auto flex flex-wrap grid grid-cols-4 lg:grid-cols-8 gap-1 bg-muted p-1">
              {GRUPOS_TAB.map(grupo => (
                <TabsTrigger key={grupo} value={grupo} className="capitalize py-2">
                  {grupo === "todos" ? "Todos" : grupo}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Seção de Listagem com Separação Visual */}
        <div className="pt-8 border-t">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium uppercase tracking-tighter">Buscando exercícios...</p>
            </div>
          ) : exercicios.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground font-medium">Nenhum exercício encontrado.</p>
              <Button onClick={handleAddExercicio} variant="link" className="mt-2 text-primary font-bold">
                Adicionar primeiro exercício
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercicios.map((exercicio) => (
                  <ExercicioCard
                    key={exercicio.id}
                    exercicio={exercicio}
                    onEdit={handleEditExercicio}
                    onDelete={handleDeleteExercicio}
                  />
                ))}
              </div>

              {/* Paginação Estilizada */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-10 mt-10">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
                    Página {pagination.page} de {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-12 w-12 border-slate-200"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex items-center gap-1.5 text-sm font-black">
                      <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl">
                        {pagination.page}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-12 w-12 border-slate-200"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ExercicioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitForm}
        exercicio={editingExercicio}
        isLoading={isLoading}
      />
    </AppLayout>
  )
}