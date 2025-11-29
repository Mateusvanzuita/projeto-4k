"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { SuplementoFormDialog } from "@/components/suplemento-form-dialog"
import { SuplementoCard } from "@/components/suplemento-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { CATEGORIAS_SUPLEMENTO, CategoriaSuplemento, type Suplemento, type SuplementoFormData, type TipoSuplemento } from "@/types/suplemento"
import { suplementoService } from "@/services/suplemento-service"
import { coachMenuItems } from "@/lib/menu-items"
import { toast } from "sonner"

export default function SuplementosPage() {
  const router = useRouter()
  const [suplementos, setSuplementos] = useState<Suplemento[]>([])
  const [filteredSuplementos, setFilteredSuplementos] = useState<Suplemento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [marcaFilter, setMarcaFilter] = useState<string>("todas")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSuplemento, setEditingSuplemento] = useState<Suplemento | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tipoFilter, setTipoFilter] = useState<TipoSuplemento | "todos">("todos")
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaSuplemento | "todos">("todos") 

  useEffect(() => {
    loadSuplementos()
  }, [])

  useEffect(() => {
    filterSuplementos()
  }, [suplementos, searchTerm, tipoFilter, marcaFilter])

  const loadSuplementos = async () => {
    try {
      const response = await suplementoService.getAll()
      setSuplementos(response.suplementos) 
    } catch (error) {
      toast.error("Erro ao carregar suplementos")
    }
  }

  const filterSuplementos = () => {
      let filtered = suplementos

      // 1. Search filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (s) =>
            (s.nomeSuplemento?.toLowerCase().includes(lowerSearchTerm)) || 
            (s.nomeManipulado?.toLowerCase().includes(lowerSearchTerm)) || 
            (s.observacoes?.toLowerCase().includes(lowerSearchTerm)) ||
            (s.contraindicacoes?.toLowerCase().includes(lowerSearchTerm)) // Novo campo no filtro
        )
      }

      // 2. Type filter
      if (tipoFilter !== "todos") {
        filtered = filtered.filter((s) => s.tipo === tipoFilter)
      }
      
      // 3. Category filter (NOVO)
      if (categoriaFilter !== "todos") {
        filtered = filtered.filter((s) => s.categoria === categoriaFilter)
      }
      
      setFilteredSuplementos(filtered)
  }

  const handleSubmit = async (data: SuplementoFormData) => {
    setIsLoading(true)
    try {
      if (editingSuplemento) {
        await suplementoService.update(editingSuplemento.id, data)
        toast.success("Suplemento atualizado")
      } else {
        await suplementoService.create(data)
        toast.success("Suplemento adicionado")
      }
      await loadSuplementos()
      setIsDialogOpen(false)
      setEditingSuplemento(null)
    } catch (error) {
      toast.error("Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (suplemento: Suplemento) => {
    setEditingSuplemento(suplemento)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await suplementoService.delete(id)
      toast.success("Suplemento excluído")
      await loadSuplementos()
    } catch (error) {
      toast.error("Erro ao excluir")
    }
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
            <h1 className="text-2xl font-bold">Suplementos</h1>
            <p className="text-sm text-muted-foreground">Gerencie suplementos e manipulados</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar suplementos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs value={tipoFilter} onValueChange={(v) => setTipoFilter(v as any)} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="suplemento">Suplementos</TabsTrigger>
              <TabsTrigger value="manipulado">Manipulados</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
      value={categoriaFilter}
          onValueChange={(value) => setCategoriaFilter(value as CategoriaSuplemento | "todos")}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Categorias</SelectItem>
            {CATEGORIAS_SUPLEMENTO.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredSuplementos.length}{" "}
          {filteredSuplementos.length === 1 ? "suplemento encontrado" : "suplementos encontrados"}
        </div>

        {filteredSuplementos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum suplemento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuplementos.map((suplemento) => (
              <SuplementoCard key={suplemento.id} suplemento={suplemento} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <SuplementoFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingSuplemento(null)
        }}
        onSubmit={handleSubmit}
        suplemento={editingSuplemento}
        isLoading={isLoading}
      />
    </AppLayout>
  )
}
