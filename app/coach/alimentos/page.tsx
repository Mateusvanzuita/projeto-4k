"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { AlimentoCard } from "@/components/alimento-card"
import { AlimentoFormDialog } from "@/components/alimento-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coachMenuItems } from "@/lib/menu-items"
import { alimentoService } from "@/services/alimento-service"
import type { Alimento, AlimentoFormData } from "@/types/alimento"
import { toast } from "sonner"

export default function AlimentosPage() {
  const router = useRouter()
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTipo, setSelectedTipo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlimento, setEditingAlimento] = useState<Alimento | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const loadAlimentos = useCallback(async (page = 1) => {
    try {
      setIsFetching(true)
      const { alimentos, pagination: pg } = await alimentoService.getAll({ 
        page, 
        limit: 10,
        tipo: selectedTipo !== "todos" ? selectedTipo : undefined,
        nome: searchQuery || undefined
      })
      
      setAlimentos(alimentos)
      if (pg) {
        setPagination({
          page: pg.page,
          totalPages: pg.totalPages,
          total: pg.total,
          limit: pg.limit
        })
      }
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error)
      toast.error("Não foi possível carregar os alimentos.")
    } finally {
      setIsFetching(false)
    }
  }, [selectedTipo, searchQuery])

  useEffect(() => {
    loadAlimentos(1)
  }, [selectedTipo, searchQuery, loadAlimentos])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadAlimentos(newPage)
      window.scrollTo(0, 0)
    }
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
    try {
      await alimentoService.delete(id)
      await loadAlimentos(pagination.page)
      toast.success("Alimento excluído com sucesso.")
    } catch (error) {
      toast.error("Não foi possível excluir o alimento.")
    }
  }

  const handleSubmitForm = async (data: AlimentoFormData) => {
    setIsLoading(true)
    try {
      if (editingAlimento) {
        await alimentoService.update(editingAlimento.id, data)
        toast.success("Alimento atualizado com sucesso.")
      } else {
        await alimentoService.create(data)
        toast.success("Alimento adicionado com sucesso.")
      }
      await loadAlimentos(1)
      setIsDialogOpen(false)
      setEditingAlimento(null)
    } catch (error) {
      toast.error("Não foi possível salvar o alimento.")
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
      <div className="p-4 space-y-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alimentos</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-tight">Gerencie o banco de alimentos</p>
          </div>
          <Button onClick={handleAddAlimento} size="lg" className="rounded-2xl">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Container de Filtros */}
        <div className="space-y-6 mb-12"> {/* mb-12 garante o afastamento necessário */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          <Tabs value={selectedTipo} onValueChange={setSelectedTipo} className="w-full">
            {/* 🛠️ Filtros atualizados conforme o Select do Dialog */}
            <TabsList className="w-full h-auto flex flex-wrap grid grid-cols-4 lg:grid-cols-8 gap-1 bg-muted p-1">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="CARBOIDRATO">Carbo</TabsTrigger>
              <TabsTrigger value="PROTEINA">Proteína</TabsTrigger>
              <TabsTrigger value="GORDURA">Gordura</TabsTrigger>
              <TabsTrigger value="FRUTA">Fruta</TabsTrigger>
              <TabsTrigger value="VEGETAL">Vegetal</TabsTrigger>
              <TabsTrigger value="LATICINIO">Laticínio</TabsTrigger>
              <TabsTrigger value="OUTRO">Outro</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Seção de Conteúdo (Listagem) */}
        <div className="pt-8 border-t"> {/* pt-8 adiciona respiro extra após a linha */}
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium uppercase tracking-tighter">Buscando alimentos...</p>
            </div>
          ) : alimentos.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground font-medium">Nenhum alimento encontrado.</p>
              <Button onClick={handleAddAlimento} variant="link" className="mt-2 text-primary font-bold">
                Adicionar primeiro alimento
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alimentos.map((alimento) => (
                  <AlimentoCard
                    key={alimento.id}
                    alimento={alimento}
                    onEdit={handleEditAlimento}
                    onDelete={handleDeleteAlimento}
                  />
                ))}
              </div>

              {/* Controles de Paginação */}
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