"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Loader2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Importação dos Componentes de Etapa
import { StepIdentidade } from "@/components/protocolo/step-identidade"
import { StepAluno } from "@/components/protocolo/step-aluno"
import { StepNutricaoBase } from "@/components/protocolo/step-nutricao-base"
import { StepRefeicoes } from "@/components/protocolo/step-refeicoes"
import { StepSuplementos } from "@/components/protocolo/step-suplementos"
import { StepHormonios } from "@/components/protocolo/step-hormonios"
import { StepTreino } from "@/components/protocolo/step-treino"
import { StepRevisao } from "@/components/protocolo/step-revisao"

// Importação do Serviço
import { protocoloService } from "@/services/protocolo-service"

const TOTAL_STEPS = 8

export default function NovoProtocoloPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    identidade: { nome: "", objetivo: "Cutting", inicio: new Date().toISOString(), validade: "", descricao: "" },
    aluno: { id: "", nome: "", peso: 0, altura: 0, nivelAtividade: "Moderado" },
    nutricao: { estrategia: "Estruturada", macros: { p: 0, c: 0, g: 0 }, totalCalorico: 0, consumoAgua: "", regrasGerais: "", refeicoes: [] },
    suplementos: [],
    manipulados: [],
    hormonios: [],
    treino: { 
      cardio: { tipo: "", frequencia: "", tempo: "", observacoes: "" },
      mobilidade: { quantidade: "", tipos: "" },
      estrutura: "",
      divisoes: [] 
    }
  })

  const next = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1))

// Substitua apenas a função handleFinalize dentro do seu page.tsx
const handleFinalize = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const payload = {
      alunoId: formData.aluno.id,
      nome: formData.identidade.nome,
      descricao: formData.identidade.descricao,
      objetivo: formData.identidade.objetivo,
      dataValidade: formData.identidade.validade ? new Date(formData.identidade.validade) : undefined,
      status: "ATIVO",
      
      // Nutrição: Ajustado de 'nome' para 'nomeRefeicao' e 'itens' para 'alimentos'
      refeicoes: formData.nutricao.refeicoes.map((ref: any) => ({
        nomeRefeicao: ref.nome, // O backend exige este nome
        horarioPrevisto: ref.horario,
        alimentos: ref.itens.map((it: any) => ({
          alimentoId: it.alimentoId,
          quantidade: Number(it.quantidade),
          unidadeMedida: it.unidade
        }))
      })),

      macros: formData.nutricao.macros,
      totalCalorico: formData.nutricao.totalCalorico,
      consumoAgua: formData.nutricao.consumoAgua,
      regrasGeraisNutricao: formData.nutricao.regrasGerais,

      suplementos: [...formData.suplementos, ...formData.manipulados],
      hormonios: formData.hormonios,

      // Treino: Mapeado para a estrutura planosTreino
      planosTreino: formData.treino.divisoes.map((div: any) => ({
        nomeDivisao: `Treino ${div.letra}`,
        orientacoes: formData.treino.estrutura,
        exercicios: div.exercicios.map((ex: any) => ({
          exercicioId: ex.exercicioId,
          series: Number(ex.series),
          repeticoes: ex.reps,
          intervaloDescanso: ex.descanso,
          observacoes: ex.obs
        }))
      }))
    };

    await protocoloService.create(payload as any);
    toast({ title: "Sucesso!", description: "Protocolo criado e enviado ao aluno." });
    router.push("/coach/protocolos");
  } catch (error) {
    console.error("Erro no envio:", error);
    toast({ variant: "destructive", title: "Dados Inválidos", description: "Verifique se todos os campos obrigatórios foram preenchidos." });
  } finally {
    setIsSubmitting(false);
  }
};

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
        
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
              Passo {currentStep} de {TOTAL_STEPS}
            </span>
            <Progress value={progress} className="w-32 h-1.5" />
          </div>
        </div>

        <div className="min-h-[500px] bg-white rounded-xl border shadow-sm p-5 md:p-8">
          {currentStep === 1 && <StepIdentidade data={formData.identidade} update={(d) => setFormData({...formData, identidade: d})} />}
          {currentStep === 2 && <StepAluno data={formData.aluno} update={(d) => setFormData({...formData, aluno: d})} />}
          {currentStep === 3 && <StepNutricaoBase data={formData.nutricao} update={(d) => setFormData({...formData, nutricao: d})} />}
          {currentStep === 4 && <StepRefeicoes data={formData.nutricao} update={(d) => setFormData({...formData, nutricao: d})} />}
          {currentStep === 5 && <StepSuplementos data={formData} update={(d) => setFormData({...formData, ...d})} />}
          {currentStep === 6 && <StepHormonios data={formData.hormonios} update={(d) => setFormData({...formData, hormonios: d})} />}
          {currentStep === 7 && <StepTreino data={formData.treino} update={(d) => setFormData({...formData, treino: d})} />}
          {currentStep === 8 && <StepRevisao data={formData} onEdit={(s) => setCurrentStep(s)} />}
        </div>

        <div className="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
          <Button variant="ghost" onClick={prev} disabled={currentStep === 1 || isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          
          <div className="flex gap-2">
            {currentStep < TOTAL_STEPS ? (
              <Button onClick={next} className="px-8 bg-[#004767] hover:bg-[#00354d]">
                Próxima Etapa <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinalize} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 px-8 text-white min-w-[180px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Finalizar e Ativar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}