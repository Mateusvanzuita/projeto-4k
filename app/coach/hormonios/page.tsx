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
import { useToast } from "@/hooks/use-toast"

export default function HormoniosPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    filterHormonios()
  }, [hormonios, searchTerm, selectedCategoria])

  const loadHormonios = async () => {
    try {
      const data = await hormonioService.getAll()
      setHormonios(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar hormônios",
        description: "Não foi possível carregar a lista de hormônios.",
        variant: "destructive",
      })
    }
  }

  const filterHormonios = () => {
    let filtered = hormonios

    if (searchTerm) {
      filtered = filtered.filter((h) => h.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    }

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
        toast({
          title: "Hormônio atualizado",
          description: "O hormônio foi atualizado com sucesso.",
        })
      } else {
        await hormonioService.create(data)
        toast({
          title: "Hormônio adicionado",
          description: "O hormônio foi adicionado com sucesso.",
        })
      }
      await loadHormonios()
      setIsDialogOpen(false)
      setEditingHormonio(null)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o hormônio.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (hormonio: Hormonio) => {
    setEditingHormonio(hormonio)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este hormônio?")) return

    try {
      await hormonioService.delete(id)
      toast({
        title: "Hormônio excluído",
        description: "O hormônio foi excluído com sucesso.",
      })
      await loadHormonios()
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o hormônio.",
        variant: "destructive",
      })
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
          <Button onClick={handleAddNew} className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Hormônio
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar hormônios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={selectedCategoria} onValueChange={(v) => setSelectedCategoria(v as typeof selectedCategoria)}>
          <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="anabolico">Anabólico</TabsTrigger>
            <TabsTrigger value="peptideo">Peptídeo</TabsTrigger>
            <TabsTrigger value="tireoidiano">Tireoidiano</TabsTrigger>
            <TabsTrigger value="gh">GH</TabsTrigger>
            <TabsTrigger value="outro">Outro</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm text-muted-foreground">
          {filteredHormonios.length} {filteredHormonios.length === 1 ? "hormônio encontrado" : "hormônios encontrados"}
        </div>

        {filteredHormonios.length === 0 ? (
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
