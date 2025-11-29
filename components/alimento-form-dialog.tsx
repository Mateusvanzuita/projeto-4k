"use client"

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

const categorias: { value: TipoAlimento; label: string }[] = [
  { value: "CARBOIDRATO", label: "Carboidrato" },
  { value: "PROTEINA", label: "Proteína" },
  { value: "GORDURA", label: "Gordura" },
  { value: "FRUTA", label: "Fruta" },
  { value: "VEGETAL", label: "Vegetal" },
  { value: "LATICINIO", label: "Laticínio" },
  { value: "OUTRO", label: "Outro" },
]

export function AlimentoFormDialog({ open, onOpenChange, onSubmit, alimento, isLoading }: AlimentoFormDialogProps) {
  const [formData, setFormData] = useState<AlimentoFormData>({
    nome: "",
    categoria: "OUTRO",
    observacoes: "",
  })

  useEffect(() => {
    if (alimento) {
      setFormData({
        nome: alimento.nome,
        categoria: alimento.categoria,
        observacoes: alimento.observacoes || "",
      })
    } else {
      setFormData({
        nome: "",
        categoria: "OUTRO",
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
            {alimento
              ? "Atualize as informações do alimento."
              : "Preencha os dados do novo alimento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value: TipoAlimento) => setFormData({ ...formData, categoria: value })}
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
