"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { AlimentoCard } from "@/components/alimento-card"
import { AlimentoFormDialog } from "@/components/alimento-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coachMenuItems } from "@/lib/menu-items"
import { alimentoService } from "@/services/alimento-service"
import type { Alimento, AlimentoFormData } from "@/types/alimento"
import { useToast } from "@/hooks/use-toast"

export default function AlimentosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [filteredAlimentos, setFilteredAlimentos] = useState<Alimento[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlimento, setEditingAlimento] = useState<Alimento | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load alimentos
  useEffect(() => {
    loadAlimentos()
  }, [])

  // Filter alimentos
  useEffect(() => {
    filterAlimentos()
  }, [alimentos, searchQuery, selectedTipo])

  const loadAlimentos = async () => {
    try {
      const data = await alimentoService.getAll()
      setAlimentos(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alimentos.",
        variant: "destructive",
      })
    }
  }

  const filterAlimentos = () => {
    let filtered = [...alimentos]

    // Filter by tipo
    if (selectedTipo !== "todos") {
      filtered = filtered.filter((a) => a.tipo === selectedTipo)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.nome.toLowerCase().includes(query) ||
          a.tipo.toLowerCase().includes(query) ||
          a.observacoes?.toLowerCase().includes(query),
      )
    }

    setFilteredAlimentos(filtered)
  }

  const handleAddAlimento = () => {
    setEditingAlimento(null)
    setIsDialogOpen(true)
  }

  const handleEditAlimento = (alimento: Alimento) => {
    setEditingAlimento(alimento)
    setIsDialogOpen(true)
  }

  const handleDeleteAlimento = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este alimento?")) return

    try {
      await alimentoService.delete(id)
      await loadAlimentos()
      toast({
        title: "Sucesso",
        description: "Alimento excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o alimento.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitForm = async (data: AlimentoFormData) => {
    setIsLoading(true)
    try {
      if (editingAlimento) {
        await alimentoService.update(editingAlimento.id, data)
        toast({
          title: "Sucesso",
          description: "Alimento atualizado com sucesso.",
        })
      } else {
        await alimentoService.create(data)
        toast({
          title: "Sucesso",
          description: "Alimento adicionado com sucesso.",
        })
      }
      await loadAlimentos()
      setIsDialogOpen(false)
      setEditingAlimento(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o alimento.",
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
            <h1 className="text-3xl font-bold text-foreground">Alimentos</h1>
            <p className="text-muted-foreground mt-1">Gerencie o banco de alimentos</p>
          </div>
          <Button onClick={handleAddAlimento} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <Tabs value={selectedTipo} onValueChange={setSelectedTipo} className="w-full">
          <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="carboidrato">Carbo</TabsTrigger>
            <TabsTrigger value="proteina">Proteína</TabsTrigger>
            <TabsTrigger value="gordura">Gordura</TabsTrigger>
            <TabsTrigger value="fibra">Fibra</TabsTrigger>
            <TabsTrigger value="vegetal">Vegetal</TabsTrigger>
            <TabsTrigger value="fruta">Fruta</TabsTrigger>
            <TabsTrigger value="outro">Outro</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredAlimentos.length} {filteredAlimentos.length === 1 ? "alimento" : "alimentos"}{" "}
          {selectedTipo !== "todos" && `na categoria ${selectedTipo}`}
        </p>

        {/* Grid */}
        {filteredAlimentos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum alimento encontrado.</p>
            <Button onClick={handleAddAlimento} variant="link" className="mt-2">
              Adicionar primeiro alimento
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlimentos.map((alimento) => (
              <AlimentoCard
                key={alimento.id}
                alimento={alimento}
                onEdit={handleEditAlimento}
                onDelete={handleDeleteAlimento}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <AlimentoFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitForm}
        alimento={editingAlimento}
        isLoading={isLoading}
      />
    </AppLayout>
  )
}
