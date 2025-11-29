// src/app/coach/hormonios/page.tsx (ATUALIZADO)

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { HormonioFormDialog } from "@/components/hormonio-form-dialog"
import { HormonioCard } from "@/components/hormonio-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { coachMenuItems } from "@/lib/menu-items"
import { hormonioService } from "@/services/hormonio-service"
import type { Hormonio, HormonioFormData, CategoriaHormonio } from "@/types/hormonio"
import { toast } from "sonner"

export default function HormoniosPage() {
  const router = useRouter()
  const [hormonios, setHormonios] = useState<Hormonio[]>([])
  const [filteredHormonios, setFilteredHormonios] = useState<Hormonio[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaHormonio | "todos">("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHormonio, setEditingHormonio] = useState<Hormonio | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadHormonios()
  }, [])

  useEffect(() => {
    // Garante que o filtro seja aplicado sempre que a lista muda ou o filtro muda
    filterHormonios()
  }, [hormonios, searchTerm, selectedCategoria])

  const loadHormonios = async () => {
    try {
      // Inicia o carregamento
      setIsLoading(true) 
      const data = await hormonioService.getAll()
      setHormonios(data)
    } catch (error) {
      toast.error("Erro ao carregar hormônios")
    } finally {
      // Finaliza o carregamento
      setIsLoading(false)
    }
  }

  const filterHormonios = () => {
    let filtered = hormonios

    if (searchTerm) {
      filtered = filtered.filter((h) => h.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // A categoria "todos" deve ser tratada como um filtro nulo.
    if (selectedCategoria !== "todos") {
      filtered = filtered.filter((h) => h.categoria === selectedCategoria)
    }

    setFilteredHormonios(filtered)
  }

  const handleSubmit = async (data: HormonioFormData) => {
    setIsLoading(true)
    try {
      if (editingHormonio) {
        await hormonioService.update(editingHormonio.id, data)
        toast.success("Hormônio atualizado!")
      } else {
        await hormonioService.create(data)
        toast.success("Hormônio adicionado!")
      }
      
      // ✅ CORREÇÃO 2: Fecha o modal e limpa o estado após sucesso
      setIsDialogOpen(false)
      setEditingHormonio(null)
      
      // ✅ CORREÇÃO 3: Recarrega a lista para exibição imediata
      await loadHormonios()
      
    } catch (error) {
      // Adicionado log do erro para debug mais fácil
      console.error("Erro no handleSubmit:", error)
      toast.error("Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (hormonio: Hormonio) => {
    setEditingHormonio(hormonio)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await hormonioService.delete(id)
      toast.success("Hormônio excluído!")
      await loadHormonios()
    } catch (error) {
      toast.error("Erro ao excluir")
    }
  }

  const handleAddNew = () => {
    setEditingHormonio(null)
    setIsDialogOpen(true)
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
          <h1 className="text-2xl font-bold text-primary">Hormônios</h1>
          <Button 
            onClick={handleAddNew} 
            // ✅ CORREÇÃO 1: Botão com cor primária visível
            className="bg-primary hover:bg-primary/90 text-white shadow-md" 
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Hormônio
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar hormônios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* ✅ CORREÇÃO 1: Filtros Rápidos (Tabs) já corrigidos com scroll horizontal */}
        <Tabs value={selectedCategoria} onValueChange={(v) => setSelectedCategoria(v as typeof selectedCategoria)}>
          <TabsList className="w-full flex flex-nowrap overflow-x-auto justify-start p-1 h-auto"> 
            <TabsTrigger value="todos" className="whitespace-nowrap">Todos</TabsTrigger>
            <TabsTrigger value="ANABOLICO" className="whitespace-nowrap">Anabólico</TabsTrigger>
            <TabsTrigger value="PEPTIDEO_TERAPEUTICO" className="whitespace-nowrap">Peptídeo</TabsTrigger>
            <TabsTrigger value="T3" className="whitespace-nowrap">Tireoide</TabsTrigger>
            <TabsTrigger value="SOMATOTROPINA" className="whitespace-nowrap">GH</TabsTrigger>
            <TabsTrigger value="MODULADOR_HORMONAL" className="whitespace-nowrap">Modulador</TabsTrigger>
            <TabsTrigger value="OUTRO" className="whitespace-nowrap">Outro</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm text-muted-foreground">
          {filteredHormonios.length} {filteredHormonios.length === 1 ? "hormônio encontrado" : "hormônios encontrados"}
        </div>

        {/* Exibe o indicador de carregamento se a lista estiver vazia e estiver carregando */}
        {isLoading && hormonios.length === 0 ? (
           <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando hormônios...</p>
          </div>
        ) : filteredHormonios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum hormônio encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHormonios.map((hormonio) => (
              <HormonioCard key={hormonio.id} hormonio={hormonio} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <HormonioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        hormonio={editingHormonio}
        isLoading={isLoading}
      />
    </AppLayout>
  )
}