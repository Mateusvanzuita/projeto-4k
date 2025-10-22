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
import type { Suplemento, SuplementoFormData, TipoSuplemento } from "@/types/suplemento"
import { suplementoService } from "@/services/suplemento-service"
import { coachMenuItems } from "@/lib/menu-items"
import { useToast } from "@/hooks/use-toast"

export default function SuplementosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [suplementos, setSuplementos] = useState<Suplemento[]>([])
  const [filteredSuplementos, setFilteredSuplementos] = useState<Suplemento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<TipoSuplemento | "todos">("todos")
  const [marcaFilter, setMarcaFilter] = useState<string>("todas")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSuplemento, setEditingSuplemento] = useState<Suplemento | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSuplementos()
  }, [])

  useEffect(() => {
    filterSuplementos()
  }, [suplementos, searchTerm, tipoFilter, marcaFilter])

  const loadSuplementos = async () => {
    try {
      const data = await suplementoService.getAll()
      setSuplementos(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar suplementos",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const filterSuplementos = () => {
    let filtered = suplementos

    if (searchTerm) {
      filtered = filtered.filter((s) => s.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (tipoFilter !== "todos") {
      filtered = filtered.filter((s) => s.tipo === tipoFilter)
    }

    if (marcaFilter !== "todas") {
      filtered = filtered.filter((s) => s.marca === marcaFilter)
    }

    setFilteredSuplementos(filtered)
  }

  const handleSubmit = async (data: SuplementoFormData) => {
    setIsLoading(true)
    try {
      if (editingSuplemento) {
        await suplementoService.update(editingSuplemento.id, data)
        toast({
          title: "Suplemento atualizado",
          description: "As alterações foram salvas com sucesso",
        })
      } else {
        await suplementoService.create(data)
        toast({
          title: "Suplemento adicionado",
          description: "O suplemento foi cadastrado com sucesso",
        })
      }
      await loadSuplementos()
      setIsDialogOpen(false)
      setEditingSuplemento(null)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (suplemento: Suplemento) => {
    setEditingSuplemento(suplemento)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este suplemento?")) return

    try {
      await suplementoService.delete(id)
      toast({
        title: "Suplemento excluído",
        description: "O suplemento foi removido com sucesso",
      })
      await loadSuplementos()
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      })
    }
  }

  const marcas = ["todas", ...Array.from(new Set(suplementos.map((s) => s.marca)))]

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

          <Select value={marcaFilter} onValueChange={setMarcaFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((marca) => (
                <SelectItem key={marca} value={marca}>
                  {marca === "todas" ? "Todas as marcas" : marca}
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
