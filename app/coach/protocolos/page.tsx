"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, Search, Copy, Trash2, Eye, Filter, MoreVertical, 
  FileText, AlertCircle, Clock, CheckCircle2, Edit3 
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter 
} from "@/components/ui/sheet"
import { protocoloService } from "@/services/protocolo-service"
import type { Protocolo } from "@/types/protocolo"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow, isBefore, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ProtocolosPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [protocolos, setProtocolos] = useState<Protocolo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("TODOS")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log("1. Iniciando chamada ao serviço getAll...");
      const response = await protocoloService.getAll();
      
      console.log("2. Resposta bruta do serviço:", response);

      // O service já mapeia (rawData.map), então a resposta deve ser o array direto
      let listaFinal: Protocolo[] = [];
      
      if (Array.isArray(response)) {
        listaFinal = response;
      } else if (response && typeof response === 'object' && (response as any).data) {
        listaFinal = (response as any).data;
      }

      console.log("3. Lista final tratada para o estado:", listaFinal);
      setProtocolos(listaFinal);
      
    } catch (error) {
      console.error("❌ Erro no loadData:", error);
      toast({ title: "Erro", description: "Falha na conexão com o servidor.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // 📊 Estatísticas
  const stats = useMemo(() => {
    const hoje = new Date()
    const s = {
      ativos: protocolos.filter(p => p.status === "ATIVO").length,
      vencendo: protocolos.filter(p => p.dataValidade && isBefore(new Date(p.dataValidade), addDays(hoje, 7)) && p.status === "ATIVO").length,
      atrasados: protocolos.filter(p => p.dataValidade && isBefore(new Date(p.dataValidade), hoje) && p.status === "ATIVO").length,
      rascunhos: protocolos.filter(p => p.status === "RASCUNHO").length
    }
    console.log("4. Estatísticas calculadas:", s);
    return s;
  }, [protocolos])

  // 🔍 Filtro
  const filteredProtocolos = useMemo(() => {
    const result = protocolos.filter((p) => {
      const nomeAluno = p.aluno?.nomeCompleto?.toLowerCase() || ""
      const nomeProtocolo = p.nome?.toLowerCase() || ""
      const busca = searchTerm.toLowerCase()
      
      const matchesSearch = nomeAluno.includes(busca) || nomeProtocolo.includes(busca)
      const matchesStatus = filterStatus === "TODOS" || p.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
    console.log(`5. Filtragem aplicada. Termo: "${searchTerm}", Status: "${filterStatus}". Resultados:`, result.length);
    return result;
  }, [protocolos, searchTerm, filterStatus])

  const getStatusIndicator = (protocolo: Protocolo) => {
    if (protocolo.status !== "ATIVO") return null
    const hoje = new Date()
    const validade = protocolo.dataValidade ? new Date(protocolo.dataValidade) : null
    if (validade && isBefore(validade, hoje)) return <Badge className="bg-red-500 text-white gap-1 text-[10px]"><AlertCircle className="h-3 w-3" /> ATRASADO</Badge>
    if (validade && isBefore(validade, addDays(hoje, 7))) return <Badge className="bg-amber-500 text-white gap-1 text-[10px]"><Clock className="h-3 w-3" /> VENCENDO</Badge>
    return <Badge className="bg-emerald-500 text-white gap-1 text-[10px]"><CheckCircle2 className="h-3 w-3" /> EM DIA</Badge>
  }

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Protocolos</h1>
          <Button onClick={() => router.push("/coach/protocolos/novo")} className="bg-[#004767] hover:bg-[#00354d] h-11">
            <Plus className="mr-2 h-5 w-5" /> Novo Protocolo
          </Button>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50/50 border-none shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-2xl font-black text-blue-600">{stats.ativos}</span><span className="text-[10px] uppercase font-bold text-slate-500">Ativos</span></CardContent></Card>
          <Card className="bg-amber-50/50 border-none shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-2xl font-black text-amber-600">{stats.vencendo}</span><span className="text-[10px] uppercase font-bold text-slate-500">Vencendo</span></CardContent></Card>
          <Card className="bg-red-50/50 border-none shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-2xl font-black text-red-600">{stats.atrasados}</span><span className="text-[10px] uppercase font-bold text-slate-500">Atrasados</span></CardContent></Card>
          <Card className="bg-slate-100 border-none shadow-sm"><CardContent className="p-4 flex flex-col items-center"><span className="text-2xl font-black text-slate-600">{stats.rascunhos}</span><span className="text-[10px] uppercase font-bold text-slate-500">Rascunhos</span></CardContent></Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar aluno ou protocolo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white border-slate-200"
            />
          </div>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 gap-2 border-slate-200">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Filtros</SheetTitle></SheetHeader>
              <div className="py-8 space-y-6">
                <Label className="text-xs font-bold uppercase text-slate-400">Status</Label>
                <div className="flex flex-col gap-2">
                  {["TODOS", "ATIVO", "RASCUNHO", "PAUSADO"].map((s) => (
                    <Button 
                      key={s} 
                      variant={filterStatus === s ? "default" : "outline"}
                      className={`justify-start h-11 ${filterStatus === s ? 'bg-[#004767]' : ''}`}
                      onClick={() => setFilterStatus(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <SheetFooter><Button className="w-full bg-[#004767]" onClick={() => setIsFilterOpen(false)}>Aplicar</Button></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004767]"></div>
             <p className="text-slate-400 text-sm font-medium">Sincronizando...</p>
          </div>
        ) : filteredProtocolos.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50/50 text-slate-400">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p className="italic">Nenhum protocolo encontrado.</p>
            <p className="text-[10px] mt-2">Protocolos no estado: {protocolos.length} | Filtrados: {filteredProtocolos.length}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProtocolos.map((p) => (
              <Card key={p.id} className="hover:border-slate-400 transition-all border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-slate-100 text-[#004767] font-black text-[10px]">
                          {p.aluno?.nomeCompleto?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{p.aluno?.nomeCompleto}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.nome}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/coach/protocolos/${p.id}/editar`)}>
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={async () => {
                            try {
                              await protocoloService.clone(p.id, p.nome);
                              toast({ title: "Clonado!", description: "Versão V2 criada como rascunho." });
                              loadData(); // Recarrega a lista
                            } catch (e) {
                              toast({ title: "Erro", description: "Falha ao clonar.", variant: "destructive" });
                            }
                          }}>
                            Duplicar (V2)
                          </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => protocoloService.delete(p.id).then(loadData)}>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIndicator(p)}
                    <Badge variant="secondary" className="text-[9px] font-black">{p.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50/50">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Vencimento</span>
                      <span className="text-xs font-bold text-slate-700">{p.dataValidade ? new Date(p.dataValidade).toLocaleDateString('pt-BR') : "Indefinido"}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Última Att.</span>
                      <span className="text-xs font-medium text-slate-500 italic">{formatDistanceToNow(new Date(p.dataCriacao), { addSuffix: true, locale: ptBR })}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-slate-50 hover:bg-[#004767] hover:text-white text-slate-600 text-[10px] font-black h-10 border border-slate-100" onClick={() => router.push(`/coach/protocolos/${p.id}`)}>
                    ABRIR PLANEJAMENTO
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}