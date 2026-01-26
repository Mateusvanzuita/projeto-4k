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
  Camera,
  LogOut,
} from "lucide-react"

// Coach menu items
export const coachMenuItems = [
  {
    label: "Início",
    icon: <Home className="h-5 w-5" />,
    href: "/coach/dashboard",
  },
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
  // {
  //   label: "Perfil",
  //   icon: <UserCircle className="h-5 w-5" />,
  //   href: "/coach/perfil",
  // },
  {
  label: "Sair",
  icon: <LogOut className="h-5 w-5" />,
  href: "#",
  variant: "logout" // Usaremos isso para identificar a ação especial
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
    label: "Meu Protocolo",
    icon: <ClipboardList className="h-5 w-5" />,
    href: "/aluno/protocolo",
  },
  {
    label: "Enviar Fotos",
    icon: <Camera className="h-5 w-5" />,
    href: "/aluno/fotos",
  },
  // {
  //   label: "Chat com Coach",
  //   icon: <MessageSquare className="h-5 w-5" />,
  //   href: "/aluno/chat",
  // },
  {
    label: "Meu Perfil",
    icon: <UserCircle className="h-5 w-5" />,
    href: "/aluno/perfil",
  },
  {
  label: "Sair",
  icon: <LogOut className="h-5 w-5" />,
  href: "#",
  variant: "logout" // Usaremos isso para identificar a ação especial
},
]

