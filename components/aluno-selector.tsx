"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { alunoService } from "@/services/aluno-service"
import type { Aluno } from "@/types/aluno"
import { OBJETIVO_LABELS } from "@/types/aluno"

interface AlunoSelectorProps {
  value?: string
  onValueChange: (alunoId: string) => void
  onNovoAluno?: () => void
}

export function AlunoSelector({ value, onValueChange, onNovoAluno }: AlunoSelectorProps) {
  const [open, setOpen] = useState(false)
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlunos()
  }, [])

  const loadAlunos = async () => {
    try {
      const data = await alunoService.getAll()
      setAlunos(data.filter((a) => a.ativo))
    } catch (error) {
      console.error("Erro ao carregar alunos:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedAluno = alunos.find((a) => a.id === value)

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[60px] bg-transparent"
          >
            {selectedAluno ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedAluno.nomeCompleto.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedAluno.nomeCompleto}</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedAluno.idade} anos • {selectedAluno.peso}kg • {OBJETIVO_LABELS[selectedAluno.objetivo]}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Selecione um aluno...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar aluno..." />
            <CommandList>
              <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
              <CommandGroup>
                {alunos.map((aluno) => (
                  <CommandItem
                    key={aluno.id}
                    value={aluno.nomeCompleto}
                    onSelect={() => {
                      onValueChange(aluno.id)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === aluno.id ? "opacity-100" : "opacity-0")} />
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {aluno.nomeCompleto.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{aluno.nomeCompleto}</span>
                      <span className="text-xs text-muted-foreground">
                        {aluno.idade} anos • {OBJETIVO_LABELS[aluno.objetivo]}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {onNovoAluno && (
        <Button variant="outline" className="w-full bg-transparent" onClick={onNovoAluno}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      )}

      {selectedAluno && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {selectedAluno.nomeCompleto.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg">{selectedAluno.nomeCompleto}</h3>
                <p className="text-sm text-muted-foreground">{selectedAluno.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedAluno.idade} anos</Badge>
                <Badge variant="secondary">{selectedAluno.altura}cm</Badge>
                <Badge variant="secondary">{selectedAluno.peso}kg</Badge>
                <Badge variant="outline">{OBJETIVO_LABELS[selectedAluno.objetivo]}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
