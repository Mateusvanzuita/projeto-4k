"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { HormonioCard } from "@/components/hormonio-card"
import { HormonioFormDialog } from "@/components/hormonio-form-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { coachMenuItems } from "@/lib/menu-items"
import { hormonioService } from "@/services/hormonio-service"
import type { Hormonio, HormonioFormData } from "@/types/hormonio"
import { toast } from "sonner"

export default function HormoniosPage() {
  const router = useRouter()
  const [hormonios, setHormonios] = useState<Hormonio[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  // Filtro de categoria mantido no estado interno como "todos" para a busca funcionar, mas oculto na UI
  const [selectedCategoria] = useState<string>("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHormonio, setEditingHormonio] = useState<Hormonio | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const loadHormonios = useCallback(async (page = 1) => {
    try {
      setIsFetching(true);
      const params: any = { 
        page, 
        limit: 10 
      };
      
      if (selectedCategoria !== "todos") params.categoria = selectedCategoria;
      if (searchQuery) params.nome = searchQuery; 

      const result = await hormonioService.getAll(params); 
      
      const data = Array.isArray(result) ? result : (result.data || result.hormonios || [])
      setHormonios(data);
      
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Erro ao carregar hormônios");
    } finally {
      setIsFetching(false);
    }
  }, [selectedCategoria, searchQuery]);

  useEffect(() => {
    loadHormonios(1)
  }, [selectedCategoria, searchQuery, loadHormonios])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadHormonios(newPage)
      window.scrollTo(0, 0)
    }
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
      setIsDialogOpen(false)
      loadHormonios(1)
    } catch (error) {
      toast.error("Erro ao salvar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 space-y-4 pb-20">
        
        {/* 1. Header: Título e Botão Adicionar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hormônios</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium uppercase tracking-tight">
              Gerencie seu banco de hormonologia
            </p>
          </div>
          <Button onClick={() => { setEditingHormonio(null); setIsDialogOpen(true); }} size="lg" className="rounded-2xl">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* 2. Campo de Busca (Filtros ocultos conforme solicitado) */}
        <div className="space-y-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do hormônio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* 3. Listagem */}
        <div className="pt-4 border-t">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium uppercase tracking-tighter">Buscando hormônios...</p>
            </div>
          ) : hormonios.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-muted-foreground font-medium">Nenhum hormônio encontrado.</p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hormonios.map((h) => (
                  <HormonioCard 
                    key={h.id} 
                    hormonio={h} 
                    onEdit={(item) => { setEditingHormonio(item); setIsDialogOpen(true); }} 
                    onDelete={(id) => hormonioService.delete(id).then(() => loadHormonios())} 
                  />
                ))}
              </div>

              {/* 4. Paginação Estilizada */}
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