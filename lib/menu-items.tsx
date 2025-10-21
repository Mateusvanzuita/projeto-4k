import {
  Apple,
  Dumbbell,
  Pill,
  Syringe,
  Users,
  FileText,
  ClipboardList,
  UserCircle,
  Home,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react"

// Coach menu items
export const coachMenuItems = [
  {
    label: "Alimentos",
    icon: <Apple className="h-5 w-5" />,
    href: "/coach/alimentos",
  },
  {
    label: "Exercícios",
    icon: <Dumbbell className="h-5 w-5" />,
    href: "/coach/exercicios",
  },
  {
    label: "Suplementos/Manipulados",
    icon: <Pill className="h-5 w-5" />,
    href: "/coach/suplementos",
  },
  {
    label: "Hormônios",
    icon: <Syringe className="h-5 w-5" />,
    href: "/coach/hormonios",
  },
  {
    label: "Alunos",
    icon: <Users className="h-5 w-5" />,
    href: "/coach/alunos",
  },
  {
    label: "Relatórios",
    icon: <FileText className="h-5 w-5" />,
    href: "/coach/relatorios",
  },
  {
    label: "Protocolos",
    icon: <ClipboardList className="h-5 w-5" />,
    href: "/coach/protocolos",
  },
  {
    label: "Perfil",
    icon: <UserCircle className="h-5 w-5" />,
    href: "/coach/perfil",
  },
]

// Aluno menu items
export const alunoMenuItems = [
  {
    label: "Início",
    icon: <Home className="h-5 w-5" />,
    href: "/aluno/dashboard",
  },
  {
    label: "Meus Treinos",
    icon: <Dumbbell className="h-5 w-5" />,
    href: "/aluno/treinos",
  },
  {
    label: "Minha Dieta",
    icon: <Apple className="h-5 w-5" />,
    href: "/aluno/dieta",
  },
  {
    label: "Evolução",
    icon: <TrendingUp className="h-5 w-5" />,
    href: "/aluno/evolucao",
  },
  {
    label: "Agenda",
    icon: <Calendar className="h-5 w-5" />,
    href: "/aluno/agenda",
  },
  {
    label: "Mensagens",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/aluno/mensagens",
  },
  {
    label: "Perfil",
    icon: <UserCircle className="h-5 w-5" />,
    href: "/aluno/perfil",
  },
]
