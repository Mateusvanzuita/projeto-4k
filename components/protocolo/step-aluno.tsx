"use client"

import { useEffect } from "react"
import { AlunoSelector } from "@/components/aluno-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Scale, Ruler, Activity } from "lucide-react"
import { alunoService } from "@/services/aluno-service"

interface StepAlunoProps {
  data: {
    id: string
    nome?: string
    peso: number
    altura: number
    nivelAtividade: string
  }
  update: (data: any) => void
}

export function StepAluno({ data, update }: StepAlunoProps) {
  
  // Efeito para preencher/sobrescrever automaticamente na troca de aluno
  useEffect(() => {
    if (!data.id) return;

    const fetchAndPopulate = async () => {
      try {
        const aluno = await alunoService.getById(data.id);
        if (aluno) {
          // 🚨 CORREÇÃO: Sempre sobrescreve os dados quando o ID muda
          update({
            ...data,
            nome: aluno.nomeCompleto,
            // Pega o peso do cadastro do aluno
            peso: aluno.peso || 0,
            // Converte metros (1.89) para cm (189) se necessário
            altura: aluno.altura ? (aluno.altura < 3 ? aluno.altura * 100 : aluno.altura) : 0
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do aluno:", error);
      }
    };

    fetchAndPopulate();
  }, [data.id]); // Dispara sempre que o ID mudar

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-[#004767]">
          <User className="h-6 w-6" /> Vínculo do Aluno
        </h2>
        <p className="text-muted-foreground text-sm">Identifique o atleta e confirme os dados biométricos.</p>
      </div>

      <div className="grid gap-6">
        {/* Seletor de Aluno */}
        <div className="space-y-2 px-1">
          <Label className="text-xs font-bold uppercase opacity-70">Aluno Correspondente</Label>
          <AlunoSelector 
            onValueChange={(id) => update({ ...data, id })} 
            value={data.id}
          />
        </div>

        {/* Grid de Dados Biométricos - Refatorado para evitar poluição visual */}
        <Card className="border-slate-200 shadow-sm mx-1">
          <CardHeader className="bg-slate-50/50 border-b py-3 px-4">
            <CardTitle className="text-[10px] font-bold uppercase opacity-60 flex items-center gap-2 tracking-widest">
              Dados para Cálculo de Macros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-blue-500" /> Peso Atual (kg)
                </Label>
                <Input 
                  type="number" 
                  step="0.1"
                  className="h-10 font-medium"
                  placeholder="Ex: 90"
                  value={data.peso || ""} 
                  onChange={(e) => update({ ...data, peso: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-blue-500" /> Altura (cm)
                </Label>
                <Input 
                  type="number" 
                  className="h-10 font-medium"
                  placeholder="Ex: 189"
                  value={data.altura || ""} 
                  onChange={(e) => update({ ...data, altura: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-blue-500" /> Nível de Atividade
                </Label>
                <Select 
                  value={data.nivelAtividade} 
                  onValueChange={(v) => update({ ...data, nivelAtividade: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentário">Sedentário</SelectItem>
                    <SelectItem value="Leve">Leve (1-2x semana)</SelectItem>
                    <SelectItem value="Moderado">Moderado (3-5x semana)</SelectItem>
                    <SelectItem value="Intenso">Intenso (6-7x semana)</SelectItem>
                    <SelectItem value="Atleta">Atleta / Trabalho Pesado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}