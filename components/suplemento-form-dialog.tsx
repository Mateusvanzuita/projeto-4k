"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Suplemento, type SuplementoFormData, TIPOS_SUPLEMENTO } from "@/types/suplemento"

interface SuplementoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SuplementoFormData) => void
  suplemento?: Suplemento | null
  isLoading?: boolean
}

export function SuplementoFormDialog({
  open,
  onOpenChange,
  onSubmit,
  suplemento,
  isLoading = false,
}: SuplementoFormDialogProps) {
  const [formData, setFormData] = useState<SuplementoFormData>({
    nome: "",
    tipo: "suplemento",
    doseRecomendada: "",
    marca: "",
    observacoes: "",
  })

  useEffect(() => {
    if (suplemento) {
      setFormData({
        nome: suplemento.nome,
        tipo: suplemento.tipo,
        doseRecomendada: suplemento.doseRecomendada,
        marca: suplemento.marca,
        observacoes: suplemento.observacoes || "",
      })
    } else {
      setFormData({
        nome: "",
        tipo: "suplemento",
        doseRecomendada: "",
        marca: "",
        observacoes: "",
      })
    }
  }, [suplemento, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{suplemento ? "Editar Suplemento" : "Adicionar Suplemento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Whey Protein"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value as any })}>
              <SelectTrigger>
                <SelectValue />
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

          <div className="space-y-2">
            <Label htmlFor="doseRecomendada">Dose Recomendada *</Label>
            <Input
              id="doseRecomendada"
              value={formData.doseRecomendada}
              onChange={(e) => setFormData({ ...formData, doseRecomendada: e.target.value })}
              placeholder="Ex: 30g ou 2 cápsulas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marca">Marca / Fornecedor *</Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Ex: Optimum Nutrition"
              required
            />
          </div>

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
