"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { ExercicioCard } from "@/components/exercicio-card"
import { ExercicioFormDialog } from "@/components/exercicio-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coachMenuItems } from "@/lib/menu-items"
// 💡 AGORA USAMOS O SERVICE REAL BASEADO EM API
import { exercicioService } from "@/services/exercicio-service" 
import type { Exercicio, ExercicioFormData, GrupoMuscular } from "@/types/exercicio"
import { toast } from "sonner"

// Defina os grupos musculares que aparecerão nas abas (Tabs)
const GRUPOS_TAB = ["todos", "peito", "costas", "ombros", "pernas", "biceps", "triceps", "abdomen"] as const

export default function ExerciciosPage() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  // O filtro agora será feito no backend, mas o frontend pode manter um filtro local
  // para 'searchQuery' e 'selectedGrupo' para otimizar a experiência do usuário.
  const [filteredExercicios, setFilteredExercicios] = useState<Exercicio[]>([]) 
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrupo, setSelectedGrupo] = useState<typeof GRUPOS_TAB[number]>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExercicio, setEditingExercicio] = useState<Exercicio | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 💡 FUNÇÃO PARA CARREGAR OS DADOS DO BACKEND
  const loadExercicios = async () => {
    try {
      setIsLoading(true)
      const params: any = { 
          // Parâmetros de paginação e filtros podem ser adicionados aqui
          // page: 1, limit: 100, // Limite para buscar todos por agora
      }
      if (selectedGrupo !== "todos") {
          params.grupoMuscular = selectedGrupo
      }
      if (searchQuery) {
          params.nomeExercicio = searchQuery
      }

      const result = await exercicioService.getAll(params) 
      
      setExercicios(result.exercicios)
      setFilteredExercicios(result.exercicios) // Filtro primário vem da API
      
    } catch (error) {
      toast.error("Erro ao carregar exercícios")
    } finally {
      setIsLoading(false)
    }
  }

  // 💡 Lógica de filtro local (mantida para refinar resultados da API)
  useEffect(() => {
    let currentList = exercicios
    
    // Filtro por termo de busca (após a busca inicial ou filtro da API)
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase()
        currentList = currentList.filter(ex => 
            ex.nome.toLowerCase().includes(lowerQuery)
        )
    }
    
    // Filtro por grupo (se a API não estiver filtrando, ou se a busca por grupo for local)
    // 💡 Para melhor performance, remova este filtro local e confie apenas no filtro da API.
    // 💡 Se mantiver, lembre-se de que selectedGrupo já está sendo usado na loadExercicios.
    
    setFilteredExercicios(currentList)
  }, [exercicios, searchQuery]) // Removi selectedGrupo daqui, ele deve acionar loadExercicios

  // 💡 Carregar exercícios na montagem e quando o grupo for alterado
  useEffect(() => {
    loadExercicios()
  }, [selectedGrupo, searchQuery]) // Recarrega sempre que o grupo ou busca mudar

  const handleAddExercicio = () => {
    setEditingExercicio(null)
    setIsDialogOpen(true)
  }

  const handleEditExercicio = (exercicio: Exercicio) => {
    setEditingExercicio(exercicio)
    setIsDialogOpen(true)
  }

  // 💡 Lógica de envio (CREATE/UPDATE)
  const handleSubmitForm = async (data: ExercicioFormData) => {
    setIsLoading(true)
    try {
      if (editingExercicio) {
        // UPDATE
        await exercicioService.update(editingExercicio.id, data)
        toast.success("Exercício atualizado com sucesso.")
      } else {
        // CREATE
        await exercicioService.create(data)
        toast.success("Exercício criado com sucesso.")
      }
      
      setIsDialogOpen(false)
      setEditingExercicio(null)
      await loadExercicios() // Recarregar a lista
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o exercício.")
    } finally {
      setIsLoading(false)
    }
  }

  // 💡 Lógica de exclusão (DELETE)
  const handleDeleteExercicio = async (id: string) => {
    setIsLoading(true)
    try {
      await exercicioService.delete(id)
      toast.success("Exercício excluído com sucesso.")
      await loadExercicios() // Recarregar a lista
    } catch (error) {
      toast.error("Ocorreu um erro ao excluir o exercício.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar Exercícios</h1>
          <Button onClick={handleAddExercicio} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exercício
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do exercício..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Tabs 
            value={selectedGrupo} 
            onValueChange={(value) => setSelectedGrupo(value as typeof GRUPOS_TAB[number])} 
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto overflow-x-auto justify-start">
              {GRUPOS_TAB.map(grupo => (
                  <TabsTrigger key={grupo} value={grupo} className="capitalize">
                      {grupo.replace("-", " ")}
                  </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Carregando..." : `${filteredExercicios.length} ${filteredExercicios.length === 1 ? "exercício" : "exercícios"} ${selectedGrupo !== "todos" ? `filtrado em ${selectedGrupo}` : ""}`}
        </p>

        {/* Grid */}
        {filteredExercicios.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum exercício encontrado.</p>
            <Button onClick={handleAddExercicio} variant="link" className="mt-2">
              Adicionar primeiro exercício
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercicios.map((exercicio) => (
              <ExercicioCard
                key={exercicio.id}
                exercicio={exercicio}
                onEdit={handleEditExercicio}
                onDelete={handleDeleteExercicio}
              />
            ))}
            {isLoading && (
              // Adiciona um placeholder de carregamento se necessário
              <div className="col-span-full text-center py-12">Carregando mais...</div>
            )}
          </div>
        )}
      </div>

      {/* Form Dialog */}
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