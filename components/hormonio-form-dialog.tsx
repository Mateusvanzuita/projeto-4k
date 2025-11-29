// src/components/hormonio-form-dialog.tsx (SEM ALTERAÇÕES RELEVANTES)

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Hormonio, HormonioFormData } from "@/types/hormonio"
// Importa todas as constantes atualizadas
import { CATEGORIAS_HORMONIO, VIAS_ADMINISTRACAO, TIPOS_HORMONIO } from "@/types/hormonio" 

interface HormonioFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: HormonioFormData) => void
  hormonio?: Hormonio | null
  isLoading?: boolean
}

export function HormonioFormDialog({
  open,
  onOpenChange,
  onSubmit,
  hormonio,
  isLoading = false,
}: HormonioFormDialogProps) {
  // Estado inicial refletindo os campos exatos do backend
  const [formData, setFormData] = useState<HormonioFormData>({
    nome: "",
    tipo: "ESTEROIDE", 
    categoria: "ANABOLICO",
    viaAdministracao: "INTRAMUSCULAR",
    observacoes: "",
    contraindicacoes: "",
    efeitosColaterais: "",
  })

  useEffect(() => {
    if (hormonio) {
      setFormData({
        nome: hormonio.nome,
        tipo: hormonio.tipo,
        categoria: hormonio.categoria,
        viaAdministracao: hormonio.viaAdministracao,
        observacoes: hormonio.observacoes || "",
        contraindicacoes: hormonio.contraindicacoes || "",
        efeitosColaterais: hormonio.efeitosColaterais || "",
      })
    } else {
      // Resetar para valores padrão
      setFormData({
        nome: "",
        tipo: "ESTEROIDE", 
        categoria: "ANABOLICO",
        viaAdministracao: "INTRAMUSCULAR",
        observacoes: "",
        contraindicacoes: "",
        efeitosColaterais: "",
      })
    }
  }, [hormonio, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">{hormonio ? "Editar Hormônio" : "Adicionar Hormônio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Hormônio *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Testosterona Cipionato"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Campo Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value as HormonioFormData["tipo"] })}
                disabled={isLoading}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_HORMONIO.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value as HormonioFormData["categoria"] })}
                disabled={isLoading}
              >
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_HORMONIO.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campo Via de Administração */}
          <div className="space-y-2">
            <Label htmlFor="viaAdministracao">Via de Administração *</Label>
            <Select
              value={formData.viaAdministracao}
              onValueChange={(value) =>
                setFormData({ ...formData, viaAdministracao: value as HormonioFormData["viaAdministracao"] })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="viaAdministracao">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIAS_ADMINISTRACAO.map((via) => (
                  <SelectItem key={via.value} value={via.value}>
                    {via.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Campos de Observações, Contraindicações e Efeitos Colaterais */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o hormônio..."
              rows={2}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contraindicacoes">Contraindicações</Label>
            <Textarea
              id="contraindicacoes"
              value={formData.contraindicacoes}
              onChange={(e) => setFormData({ ...formData, contraindicacoes: e.target.value })}
              placeholder="Contraindicações para o uso..."
              rows={2}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="efeitosColaterais">Efeitos Colaterais</Label>
            <Textarea
              id="efeitosColaterais"
              value={formData.efeitosColaterais}
              onChange={(e) => setFormData({ ...formData, efeitosColaterais: e.target.value })}
              placeholder="Possíveis efeitos colaterais..."
              rows={2}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90">
              {isLoading ? "Salvando..." : hormonio ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}