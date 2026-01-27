"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { alunoMenuItems } from "@/lib/menu-items"
import { fotoService, RegistroEvolucao } from "@/services/foto-service"
import { Camera, Plus, History, Trash2, Scale, MessageSquare, Calendar, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function EnviarFotoPage() {
  const [historico, setHistorico] = useState<RegistroEvolucao[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Estados do Formulário
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [peso, setPeso] = useState("")
  const [observacao, setObservacao] = useState("")

  useEffect(() => {
    loadHistorico()
  }, [])

  const loadHistorico = async () => {
    try {
      setLoading(true)
      const data = await fotoService.getHistorico()
      setHistorico(data)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (selectedFiles.length + files.length > 5) {
        alert("Você pode selecionar no máximo 5 fotos.")
        return
      }
      setSelectedFiles([...selectedFiles, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    console.log("🚀 Iniciando processo de envio...");
    if (selectedFiles.length === 0 || !peso) {
      alert("Por favor, selecione ao menos uma foto e informe o seu peso.");
      return;
    }

    try {
      setEnviando(true);
      const formData = new FormData();
      formData.append("peso", peso);
      formData.append("observacao", observacao);

      selectedFiles.forEach((file, index) => {
        console.log(`📸 Anexando foto ${index + 1}: ${file.name}`);
        formData.append("fotos", file); 
      });

      await fotoService.enviarFotos(formData);
      
      console.log("✅ Envio realizado com sucesso!");
      setSelectedFiles([]);
      setPeso("");
      setObservacao("");
      setShowUpload(false);
      loadHistorico();
    } catch (error) {
      console.error("❌ Erro no envio:", error);
      alert("Erro ao enviar fotos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppLayout menuItems={alunoMenuItems}>
      <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto pb-24">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" /> Evolução
          </h1>
          <Button 
            onClick={() => setShowUpload(!showUpload)}
            className="rounded-full font-bold gap-2"
            variant={showUpload ? "outline" : "default"}
          >
            {showUpload ? "Cancelar" : <><Plus className="h-4 w-4" /> Registrar Foto</>}
          </Button>
        </div>

        {/* Formulário de Upload */}
        {showUpload && (
          <Card className="border-2 border-primary/20 shadow-xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-sm uppercase tracking-widest font-black text-slate-500">
                Nova Atualização
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold flex items-center gap-2"><Scale className="h-4 w-4" /> Peso Atual (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 85.5" 
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Observação (Opcional)</Label>
                  <Textarea 
                    placeholder="Como você se sente hoje?" 
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="font-bold">Fotos (Máx 5)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-100">
                        <img 
                          src={URL.createObjectURL(file)} 
                          className="w-full h-full object-cover" 
                          alt="Preview" 
                        />
                        <button 
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {selectedFiles.length < 5 && (
                      <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <Plus className="h-6 w-6 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400">ADD</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 rounded-2xl font-black text-lg" 
                disabled={enviando}
                onClick={handleSubmit}
              >
                {enviando ? "Enviando..." : "SALVAR ATUALIZAÇÃO"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-600">
            <History className="h-5 w-5" /> Histórico de Evolução
          </h2>

          {loading ? (
            <div className="text-center py-10 animate-pulse text-slate-400">Carregando histórico...</div>
          ) : historico.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Nenhuma foto enviada ainda.</div>
          ) : (
            historico.map((reg) => (
              <Card key={reg.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white mb-4">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-bold">
                        {format(new Date(reg.dataCriacao), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-black text-primary">
                      {reg.peso} KG
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {reg.fotos.map((foto, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="cursor-zoom-in"
                        // 💡 Ao clicar, definimos a URL completa no estado do modal
                        onClick={() => setSelectedImage(`${API_URL}${foto.url}`)}
                      >
                        <img 
                          src={`${API_URL}${foto.url}`} 
                          className="h-24 w-24 object-cover rounded-xl shadow-sm border border-slate-100 hover:opacity-80 transition-opacity" 
                          alt="Evolução"
                        />
                      </div>
                    ))}
                  </div>

                  {reg.observacao && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                      "{reg.observacao}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 🖼️ Modal de Visualização (Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20">
            <X className="h-8 w-8" />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            alt="Visualização"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </AppLayout>
  )
}