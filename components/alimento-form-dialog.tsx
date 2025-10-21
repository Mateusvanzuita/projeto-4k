"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Alimento, AlimentoFormData, TipoAlimento } from "@/types/alimento"

interface AlimentoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AlimentoFormData) => Promise<void>
  alimento?: Alimento | null
  isLoading?: boolean
}

const tiposAlimento: { value: TipoAlimento; label: string }[] = [
  { value: "carboidrato", label: "Carboidrato" },
  { value: "proteina", label: "Proteína" },
  { value: "gordura", label: "Gordura" },
  { value: "fibra", label: "Fibra" },
  { value: "vegetal", label: "Vegetal" },
  { value: "fruta", label: "Fruta" },
  { value: "outro", label: "Outro" },
]

export function AlimentoFormDialog({ open, onOpenChange, onSubmit, alimento, isLoading }: AlimentoFormDialogProps) {
  const [formData, setFormData] = useState<AlimentoFormData>({
    nome: "",
    tipo: "carboidrato",
    calorias: 0,
    quantidadePadrao: 100,
    unidadeMedida: "g",
    observacoes: "",
  })

  useEffect(() => {
    if (alimento) {
      setFormData({
        nome: alimento.nome,
        tipo: alimento.tipo,
        calorias: alimento.calorias,
        quantidadePadrao: alimento.quantidadePadrao,
        unidadeMedida: alimento.unidadeMedida,
        observacoes: alimento.observacoes || "",
      })
    } else {
      setFormData({
        nome: "",
        tipo: "carboidrato",
        calorias: 0,
        quantidadePadrao: 100,
        unidadeMedida: "g",
        observacoes: "",
      })
    }
  }, [alimento, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{alimento ? "Editar Alimento" : "Adicionar Alimento"}</DialogTitle>
          <DialogDescription>
            {alimento ? "Atualize as informações do alimento." : "Preencha os dados do novo alimento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Alimento *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Arroz Branco"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TipoAlimento) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposAlimento.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calorias">Calorias *</Label>
              <Input
                id="calorias"
                type="number"
                min="0"
                value={formData.calorias}
                onChange={(e) => setFormData({ ...formData, calorias: Number(e.target.value) })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidadePadrao">Quantidade Padrão *</Label>
              <Input
                id="quantidadePadrao"
                type="number"
                min="0"
                value={formData.quantidadePadrao}
                onChange={(e) => setFormData({ ...formData, quantidadePadrao: Number(e.target.value) })}
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadeMedida">Unidade de Medida *</Label>
            <Select
              value={formData.unidadeMedida}
              onValueChange={(value: "g" | "ml") => setFormData({ ...formData, unidadeMedida: value })}
            >
              <SelectTrigger id="unidadeMedida">
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">Gramas (g)</SelectItem>
                <SelectItem value="ml">Mililitros (ml)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais (opcional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : alimento ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
