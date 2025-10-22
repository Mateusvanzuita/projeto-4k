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
import { CATEGORIAS_HORMONIO, VIAS_ADMINISTRACAO } from "@/types/hormonio"

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
  const [formData, setFormData] = useState<HormonioFormData>({
    nome: "",
    categoria: "anabolico",
    dose: "",
    frequencia: "",
    viaAdministracao: "injetavel",
    tempoMeiaVida: "",
    fabricante: "",
    observacoes: "",
  })

  useEffect(() => {
    if (hormonio) {
      setFormData({
        nome: hormonio.nome,
        categoria: hormonio.categoria,
        dose: hormonio.dose,
        frequencia: hormonio.frequencia,
        viaAdministracao: hormonio.viaAdministracao,
        tempoMeiaVida: hormonio.tempoMeiaVida || "",
        fabricante: hormonio.fabricante || "",
        observacoes: hormonio.observacoes || "",
      })
    } else {
      setFormData({
        nome: "",
        categoria: "anabolico",
        dose: "",
        frequencia: "",
        viaAdministracao: "injetavel",
        tempoMeiaVida: "",
        fabricante: "",
        observacoes: "",
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
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Testosterona Cipionato"
              required
              disabled={isLoading}
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dose">Dose *</Label>
              <Input
                id="dose"
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                placeholder="Ex: 250mg"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência *</Label>
              <Input
                id="frequencia"
                value={formData.frequencia}
                onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                placeholder="Ex: 2x/semana"
                required
                disabled={isLoading}
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempoMeiaVida">Tempo de Meia-Vida</Label>
              <Input
                id="tempoMeiaVida"
                value={formData.tempoMeiaVida}
                onChange={(e) => setFormData({ ...formData, tempoMeiaVida: e.target.value })}
                placeholder="Ex: 8 dias"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                placeholder="Ex: Landerlan"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o hormônio..."
              rows={3}
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
