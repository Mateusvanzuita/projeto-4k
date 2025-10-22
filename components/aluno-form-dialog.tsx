"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Aluno, AlunoFormData, Sexo, Plano, TipoPlano, Objetivo, FrequenciaFotos } from "@/types/aluno"
import { SEXO_LABELS, PLANO_LABELS, TIPO_PLANO_LABELS, OBJETIVO_LABELS, FREQUENCIA_FOTOS_LABELS } from "@/types/aluno"

interface AlunoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AlunoFormData) => void
  aluno?: Aluno
  isLoading?: boolean
}

export function AlunoFormDialog({ open, onOpenChange, onSubmit, aluno, isLoading }: AlunoFormDialogProps) {
  const [formData, setFormData] = useState<AlunoFormData>({
    nomeCompleto: aluno?.nomeCompleto || "",
    idade: aluno?.idade || 18,
    sexo: aluno?.sexo || "masculino",
    altura: aluno?.altura || 170,
    peso: aluno?.peso || 70,
    email: aluno?.email || "",
    senha: "",
    contato: aluno?.contato || "",
    plano: aluno?.plano || "mensal",
    tipoPlano: aluno?.tipoPlano || "full",
    objetivo: aluno?.objetivo || "hipertrofia",
    jaTreinava: aluno?.jaTreinava || false,
    restricaoAlimentar: aluno?.restricaoAlimentar || "",
    restricaoExercicio: aluno?.restricaoExercicio || "",
    historicoMedico: aluno?.historicoMedico || "",
    frequenciaFotos: aluno?.frequenciaFotos || "quinzenal",
    observacoes: aluno?.observacoes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{aluno ? "Editar Aluno" : "Adicionar Novo Aluno"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pessoais">Pessoais</TabsTrigger>
              <TabsTrigger value="plano">Plano</TabsTrigger>
              <TabsTrigger value="restricoes">Restrições</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoais" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    min="10"
                    max="120"
                    value={formData.idade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idade: Number.parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value: Sexo) => setFormData({ ...formData, sexo: value })}
                  >
                    <SelectTrigger id="sexo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SEXO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    min="100"
                    max="250"
                    value={formData.altura}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        altura: Number.parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    min="30"
                    max="300"
                    step="0.1"
                    value={formData.peso}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        peso: Number.parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contato">Contato *</Label>
                <Input
                  id="contato"
                  type="tel"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  placeholder="(11) 98765-4321"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>
            </TabsContent>

            <TabsContent value="plano" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plano">Plano *</Label>
                  <Select
                    value={formData.plano}
                    onValueChange={(value: Plano) => setFormData({ ...formData, plano: value })}
                  >
                    <SelectTrigger id="plano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLANO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoPlano">Tipo de Plano *</Label>
                  <Select
                    value={formData.tipoPlano}
                    onValueChange={(value: TipoPlano) => setFormData({ ...formData, tipoPlano: value })}
                  >
                    <SelectTrigger id="tipoPlano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIPO_PLANO_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Select
                  value={formData.objetivo}
                  onValueChange={(value: Objetivo) => setFormData({ ...formData, objetivo: value })}
                >
                  <SelectTrigger id="objetivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(OBJETIVO_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jaTreinava">Já treinava antes? *</Label>
                <Select
                  value={formData.jaTreinava ? "sim" : "nao"}
                  onValueChange={(value) => setFormData({ ...formData, jaTreinava: value === "sim" })}
                >
                  <SelectTrigger id="jaTreinava">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="restricoes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="restricaoAlimentar">Restrição Alimentar</Label>
                <Textarea
                  id="restricaoAlimentar"
                  value={formData.restricaoAlimentar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restricaoAlimentar: e.target.value,
                    })
                  }
                  placeholder="Ex: Intolerância à lactose, vegetariano..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restricaoExercicio">Restrição com Exercício</Label>
                <Textarea
                  id="restricaoExercicio"
                  value={formData.restricaoExercicio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restricaoExercicio: e.target.value,
                    })
                  }
                  placeholder="Ex: Problema no joelho, não pode fazer agachamento..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historicoMedico">Histórico Médico</Label>
                <Textarea
                  id="historicoMedico"
                  value={formData.historicoMedico}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      historicoMedico: e.target.value,
                    })
                  }
                  placeholder="Ex: Cirurgias, doenças crônicas, medicamentos..."
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4 mt-4">
              {!aluno && (
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha de Primeiro Acesso *</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Senha que o aluno usará no primeiro login"
                    required={!aluno}
                    autoComplete="new-password"
                  />
                  <p className="text-sm text-muted-foreground">
                    Esta senha será usada pelo aluno no primeiro acesso à plataforma
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="frequenciaFotos">Frequência de Fotos *</Label>
                <Select
                  value={formData.frequenciaFotos}
                  onValueChange={(value: FrequenciaFotos) => setFormData({ ...formData, frequenciaFotos: value })}
                >
                  <SelectTrigger id="frequenciaFotos">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FREQUENCIA_FOTOS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
                  placeholder="Observações gerais sobre o aluno..."
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : aluno ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
