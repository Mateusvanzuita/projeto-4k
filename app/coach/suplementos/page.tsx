"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { SuplementoCard } from "@/components/suplemento-card"
import { SuplementoFormDialog } from "@/components/suplemento-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { coachMenuItems } from "@/lib/menu-items"
import { suplementoService } from "@/services/suplemento-service" 
import { CATEGORIAS_SUPLEMENTO, type Suplemento, type SuplementoFormData, type TipoSuplemento, type CategoriaSuplemento } from "@/types/suplemento"
import { toast } from "sonner"

export default function SuplementosPage() {
  const router = useRouter()
  const [suplementos, setSuplementos] = useState<Suplemento[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [tipoFilter, setTipoFilter] = useState<TipoSuplemento | "todos">("todos")
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaSuplemento | "todos">("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSuplemento, setEditingSuplemento] = useState<Suplemento | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

const loadSuplementos = useCallback(async (page = 1) => {
    try {
      setIsFetching(true)
      
      // Montagem dos parâmetros conforme esperado pelo suplementoService e Backend
      const params: any = { 
          page, 
          limit: 10,
      }

      // Aplica filtro de tipo (Industrializado/Manipulado) se não for "todos"
      if (tipoFilter !== "todos") {
        params.tipo = tipoFilter
      }

      // Aplica filtro de categoria se não for "todos"
      if (categoriaFilter !== "todos") {
        params.categoria = categoriaFilter
      }

      // ✅ CORREÇÃO: Enviando como 'nome' para o service e backend processarem a busca
      if (searchQuery) {
        params.nome = searchQuery
      }

      const result = await suplementoService.getAll(params) 
      
      setSuplementos(result.suplementos)
      
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (error) {
      toast.error("Erro ao carregar suplementos")
      console.error("Erro na carga de suplementos:", error)
    } finally {
      setIsFetching(false)
    }
  }, [tipoFilter, categoriaFilter, searchQuery]) // Dependências garantem recarga ao mudar filtros ou busca

  useEffect(() => {
    loadSuplementos(1)
  }, [tipoFilter, categoriaFilter, searchQuery, loadSuplementos])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadSuplementos(newPage)
      window.scrollTo(0, 0)
    }
  }

  const handleAddSuplemento = () => {
    setEditingSuplemento(null)
    setIsDialogOpen(true)
  }

  const handleEditSuplemento = (suplemento: Suplemento) => {
    setEditingSuplemento(suplemento)
    setIsDialogOpen(true)
  }

  const handleSubmitForm = async (data: SuplementoFormData) => {
    setIsLoading(true)
    try {
      if (editingSuplemento) {
        await suplementoService.update(editingSuplemento.id, data)
        toast.success("Suplemento atualizado com sucesso.")
      } else {
        await suplementoService.create(data)
        toast.success("Suplemento criado com sucesso.")
      }
      setIsDialogOpen(false)
      setEditingSuplemento(null)
      loadSuplementos(1)
    } catch (error) {
      toast.error("Erro ao salvar o suplemento.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSuplemento = async (id: string) => {
    try {
      await suplementoService.delete(id)
      toast.success("Suplemento excluído com sucesso.")
      loadSuplementos(pagination.page)
    } catch (error) {
      toast.error("Erro ao excluir o suplemento.")
    }
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 space-y-4 pb-20">
        {/* Header Identêntico ao de Exercícios */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suplementos</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-tight">
              Gerencie seu banco de suplementos
            </p>
          </div>
          <Button onClick={handleAddSuplemento} size="lg" className="rounded-2xl">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Container de Filtros idêntico ao de Exercícios */}
        <div className="space-y-6 mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do suplemento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Tabs 
              value={tipoFilter} 
              onValueChange={(value) => setTipoFilter(value as any)} 
              className="w-full md:max-w-md"
            >
              <TabsList className="w-full h-auto grid grid-cols-3 gap-1 bg-muted p-1">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="suplemento">Industrializado</TabsTrigger>
                <TabsTrigger value="manipulado">Manipulado</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={categoriaFilter} onValueChange={(v) => setCategoriaFilter(v as any)}>
              <SelectTrigger className="h-12 w-full md:w-[250px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                {CATEGORIAS_SUPLEMENTO.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Seção de Listagem com Separação Visual */}
        <div className="pt-8 border-t">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium uppercase tracking-tighter">Buscando suplementos...</p>
            </div>
          ) : suplementos.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground font-medium">Nenhum suplemento encontrado.</p>
              <Button onClick={handleAddSuplemento} variant="link" className="mt-2 text-primary font-bold">
                Adicionar primeiro suplemento
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suplementos.map((suplemento) => (
                  <SuplementoCard
                    key={suplemento.id}
                    suplemento={suplemento}
                    onEdit={handleEditSuplemento}
                    onDelete={handleDeleteSuplemento}
                  />
                ))}
              </div>

              {/* Paginação Estilizada igual ao arquivo original */}
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

      <SuplementoFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitForm}
        suplemento={editingSuplemento}
        isLoading={isLoading}
      />
    </AppLayout>
  )
}