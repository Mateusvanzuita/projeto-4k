"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Suplemento, type SuplementoFormData, TIPOS_SUPLEMENTO, type TipoSuplemento, type CategoriaSuplemento, CATEGORIAS_SUPLEMENTO } from "@/types/suplemento"

interface SuplementoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SuplementoFormData) => void
  suplemento?: Suplemento | null
  isLoading?: boolean
}

const initialFormData: SuplementoFormData = {
  nomeSuplemento: "",
  nomeManipulado: "",
  tipo: "SUPLEMENTO", 
  categoria: "OUTRO" as CategoriaSuplemento, 
  observacoes: "",
  contraindicacoes: "", 
}

export function SuplementoFormDialog({
  open,
  onOpenChange,
  onSubmit,
  suplemento,
  isLoading = false,
}: SuplementoFormDialogProps) {
  const [formData, setFormData] = useState<SuplementoFormData>(initialFormData)

  useEffect(() => {
    if (suplemento) {
      setFormData({
        nomeSuplemento: suplemento.nomeSuplemento || "",
        nomeManipulado: suplemento.nomeManipulado || "",
        // Converta para UPPERCASE para bater com as chaves do SelectItem
        tipo: suplemento.tipo.toUpperCase() as TipoSuplemento,
        categoria: suplemento.categoria,
        observacoes: suplemento.observacoes || "",
        contraindicacoes: suplemento.contraindicacoes || "",
      })
    } else {
      setFormData(initialFormData)
    }
  }, [suplemento, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple frontend validation for required name based on type
    if (formData.tipo === "SUPLEMENTO" && !formData.nomeSuplemento?.trim()) {
      alert("Para tipo Suplemento, o nome do suplemento é obrigatório.")
      return
    }
    if (formData.tipo === "MANIPULADO" && !formData.nomeManipulado?.trim()) {
      alert("Para tipo Manipulado, o nome do manipulado é obrigatório.")
      return
    }
    
    // Clean up empty strings to be 'undefined' or omit for optional fields
    const dataToSubmit: SuplementoFormData = {
        ...formData,
        nomeSuplemento: formData.nomeSuplemento?.trim() || undefined,
        nomeManipulado: formData.nomeManipulado?.trim() || undefined,
        observacoes: formData.observacoes?.trim() || undefined,
        contraindicacoes: formData.contraindicacoes?.trim() || undefined,
    }
    
    // Ensure only one name field is sent (Prisma best practice)
    if (dataToSubmit.tipo === "SUPLEMENTO") {
        delete dataToSubmit.nomeManipulado
    } else {
        delete dataToSubmit.nomeSuplemento
    }
    
    onSubmit(dataToSubmit as SuplementoFormData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{suplemento ? "Atualizar Suplemento" : "Adicionar Novo Suplemento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Tipo (SUPLEMENTO/MANIPULADO) */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TipoSuplemento) => 
                setFormData(prev => ({ 
                  ...prev, 
                  tipo: value,
                  // Limpar o campo de nome que não será mais usado
                  nomeSuplemento: value === "MANIPULADO" ? "" : prev.nomeSuplemento,
                  nomeManipulado: value === "SUPLEMENTO" ? "" : prev.nomeManipulado,
                }))
              }
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_SUPLEMENTO.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoria (NOVO CAMPO) */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value: CategoriaSuplemento) => setFormData({ ...formData, categoria: value })}
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_SUPLEMENTO.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Nome do Suplemento / Manipulado (CONDICIONAL) */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              {formData.tipo === "SUPLEMENTO" ? "Nome do Suplemento" : "Nome do Manipulado"} *
            </Label>
            <Input
              id="nome"
              value={
                formData.tipo === "SUPLEMENTO"
                  ? formData.nomeSuplemento
                  : formData.nomeManipulado
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ...(formData.tipo === "SUPLEMENTO"
                    ? { nomeSuplemento: e.target.value }
                    : { nomeManipulado: e.target.value }),
                })
              }
              placeholder={
                formData.tipo === "SUPLEMENTO"
                  ? "Ex: Whey Protein Concentrado"
                  : "Ex: ZMA com Picolinato de Cromo"
              }
              required
            />
          </div>
          
          {/* Dose Recomendada e Marca Removidos */}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais..."
              rows={3}
            />
          </div>
          
          {/* Contraindicações (NOVO CAMPO) */}
          <div className="space-y-2">
            <Label htmlFor="contraindicacoes">Contraindicações</Label>
            <Textarea
              id="contraindicacoes"
              value={formData.contraindicacoes}
              onChange={(e) => setFormData({ ...formData, contraindicacoes: e.target.value })}
              placeholder="Alergias, restrições médicas, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : suplemento ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}