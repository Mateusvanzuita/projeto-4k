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
import { exercicioService } from "@/services/exercicio-service"
import type { Exercicio, ExercicioFormData } from "@/types/exercicio"
import { useToast } from "@/hooks/use-toast"

export default function ExerciciosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [exercicios, setExercicios] = useState<Exercicio[]>([])
  const [filteredExercicios, setFilteredExercicios] = useState<Exercicio[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrupo, setSelectedGrupo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExercicio, setEditingExercicio] = useState<Exercicio | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load exercicios
  useEffect(() => {
    loadExercicios()
  }, [])

  // Filter exercicios
  useEffect(() => {
    filterExercicios()
  }, [exercicios, searchQuery, selectedGrupo])

  const loadExercicios = async () => {
    try {
      const data = await exercicioService.getAll()
      setExercicios(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os exercícios.",
        variant: "destructive",
      })
    }
  }

  const filterExercicios = () => {
    let filtered = [...exercicios]

    // Filter by grupo muscular
    if (selectedGrupo !== "todos") {
      filtered = filtered.filter((e) => e.grupoMuscular === selectedGrupo)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.nome.toLowerCase().includes(query) ||
          e.grupoMuscular.toLowerCase().includes(query) ||
          e.equipamento.toLowerCase().includes(query) ||
          e.observacoes?.toLowerCase().includes(query),
      )
    }

    setFilteredExercicios(filtered)
  }

  const handleAddExercicio = () => {
    setEditingExercicio(null)
    setIsDialogOpen(true)
  }

  const handleEditExercicio = (exercicio: Exercicio) => {
    setEditingExercicio(exercicio)
    setIsDialogOpen(true)
  }

  const handleDeleteExercicio = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return

    try {
      await exercicioService.delete(id)
      await loadExercicios()
      toast({
        title: "Sucesso",
        description: "Exercício excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o exercício.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitForm = async (data: ExercicioFormData) => {
    setIsLoading(true)
    try {
      if (editingExercicio) {
        await exercicioService.update(editingExercicio.id, data)
        toast({
          title: "Sucesso",
          description: "Exercício atualizado com sucesso.",
        })
      } else {
        await exercicioService.create(data)
        toast({
          title: "Sucesso",
          description: "Exercício adicionado com sucesso.",
        })
      }
      await loadExercicios()
      setIsDialogOpen(false)
      setEditingExercicio(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o exercício.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout
      menuItems={coachMenuItems}
      onCreateProtocol={() => router.push("/coach/protocolos/novo")}
      onNavigateAlunos={() => router.push("/coach/alunos")}
      onNavigateRelatorios={() => router.push("/coach/relatorios")}
    >
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exercícios</h1>
            <p className="text-muted-foreground mt-1">Gerencie o banco de exercícios</p>
          </div>
          <Button onClick={handleAddExercicio} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, grupo muscular ou equipamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <Tabs value={selectedGrupo} onValueChange={setSelectedGrupo} className="w-full">
          <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="peito">Peito</TabsTrigger>
            <TabsTrigger value="costas">Costas</TabsTrigger>
            <TabsTrigger value="ombros">Ombros</TabsTrigger>
            <TabsTrigger value="pernas">Pernas</TabsTrigger>
            <TabsTrigger value="biceps">Bíceps</TabsTrigger>
            <TabsTrigger value="triceps">Tríceps</TabsTrigger>
            <TabsTrigger value="abdomen">Abdômen</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredExercicios.length} {filteredExercicios.length === 1 ? "exercício" : "exercícios"}{" "}
          {selectedGrupo !== "todos" && `no grupo ${selectedGrupo}`}
        </p>

        {/* Grid */}
        {filteredExercicios.length === 0 ? (
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
