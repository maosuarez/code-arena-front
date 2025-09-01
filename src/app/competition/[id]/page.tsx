"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Trophy,
  ExternalLink,
  Play,
  CheckCircle,
  AlertCircle,
  Filter,
  EyeOff,
  Users,
  MessageCircle,
  Send,
  UserPlus,
  Zap,
  Target,
  Award,
  MoreVertical,
  Lightbulb,
  Flag,
  BookOpen,
  Minimize2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"

// Mock data
const competitionData = {
  id: "weekly-algo-basic",
  title: "Torneo Semanal - Algoritmos Básicos",
  description: "Competencia de 2 horas con problemas de dificultad Easy y Medium",
  endTime: new Date(Date.now() + 83 * 60 * 1000), // 1h 23m from now
  totalDuration: 120, // 2 hours in minutes
}

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    points: 10,
    tags: ["Array", "Hash Table"],
    status: "solved",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "medium",
    points: 30,
    tags: ["Linked List", "Math"],
    status: "in-progress",
    leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    points: 30,
    tags: ["Hash Table", "String", "Sliding Window"],
    status: "not-attempted",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    points: 50,
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    status: "not-attempted",
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
  {
    id: 5,
    title: "Reverse Integer",
    difficulty: "easy",
    points: 10,
    tags: ["Math"],
    status: "not-attempted",
    leetcodeUrl: "https://leetcode.com/problems/reverse-integer/",
  },
  {
    id: 6,
    title: "Container With Most Water",
    difficulty: "medium",
    points: 30,
    tags: ["Array", "Two Pointers", "Greedy"],
    status: "not-attempted",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
  },
]

const teamMembers = [
  { id: 1, name: "Ana García", avatar: "AG", status: "online", leetcode: "ana_codes" },
  { id: 2, name: "Carlos López", avatar: "CL", status: "online", leetcode: "carlos_dev" },
  { id: 3, name: "María Rodríguez", avatar: "MR", status: "away", leetcode: "maria_algo" },
]

const submissions = [
  { id: 1, problem: "Two Sum", status: "AC", time: "12:34", member: "Ana García" },
  { id: 2, problem: "Add Two Numbers", status: "WA", time: "15:22", member: "Carlos López" },
  { id: 3, problem: "Two Sum", status: "TLE", time: "08:15", member: "María Rodríguez" },
]

const chatMessages = [
  { id: 1, member: "Ana García", message: "¡Terminé Two Sum! 🎉", time: "12:35" },
  { id: 2, member: "Carlos López", message: "Ayuda con Add Two Numbers, no pasa el caso 3", time: "15:23" },
  { id: 3, member: "María Rodríguez", message: "Revisando el enfoque de sliding window", time: "16:45" },
]

export default function CompetitionPage({ params }: { params: { id: string } }) {
  const [timeLeft, setTimeLeft] = useState(83 * 60) // 1h 23m in seconds
  const [filteredProblems, setFilteredProblems] = useState(problems)
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [hideCompleted, setHideCompleted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [rulesModalOpen, setRulesModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [compactMode, setCompactMode] = useState(false)

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filter problems
  useEffect(() => {
    let filtered = problems

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter)
    }

    if (hideCompleted) {
      filtered = filtered.filter((p) => p.status !== "solved")
    }

    if (searchQuery) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredProblems(filtered)
  }, [difficultyFilter, hideCompleted, searchQuery])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    const totalTime = competitionData.totalDuration * 60
    const elapsed = totalTime - timeLeft
    return (elapsed / totalTime) * 100
  }

  const handleProblemAction = (problemId: number, action: string) => {
    const problem = problems.find((p) => p.id === problemId)
    if (!problem) return

    switch (action) {
      case "open-leetcode":
        window.open(problem.leetcodeUrl, "_blank")
        break
      case "mark-in-progress":
        toast(`${problem.title} marcado como en curso`)
        break
      case "validate-ac":
        toast( "Verificando tu envío en LeetCode")
        // Simulate validation
        setTimeout(() => {
          toast( `+${problem.points} puntos para tu equipo`)
        }, 2000)
        break
      case "request-hint":
        toast( "Se han descontado 5 puntos por la pista")
        break
    }
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return
    toast("Tu mensaje ha sido enviado al equipo")
    setChatMessage("")
  }

  const copyTeamLink = () => {
    navigator.clipboard.writeText("https://codearena.com/team/FIRE-2024-ALGO")
    toast("El enlace de invitación ha sido copiado al portapapeles")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950"
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950"
      case "hard":
        return "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Play className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold">{competitionData.title}</h1>
                <p className="text-sm text-muted-foreground">Termina en {formatTime(timeLeft)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${getProgressPercentage()}, 100`}
                      className="text-accent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setRulesModalOpen(true)}>
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Reglas
              </Button>
              <Button variant="outline" size="sm" onClick={() => setReportModalOpen(true)}>
                <Flag className="mr-2 h-4 w-4" />
                Reportar Problema
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Problems List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar problemas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="mr-2 h-4 w-4" />
                          Filtrar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setDifficultyFilter("all")}>Todos</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDifficultyFilter("easy")}>Fácil</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDifficultyFilter("medium")}>Medio</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDifficultyFilter("hard")}>Difícil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHideCompleted(!hideCompleted)}
                      className={hideCompleted ? "bg-accent text-accent-foreground" : ""}
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Ocultar Resueltos
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Problems */}
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(problem.status)}
                          <CardTitle className="text-base">{problem.title}</CardTitle>
                          <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty === "easy"
                              ? "Fácil"
                              : problem.difficulty === "medium"
                                ? "Medio"
                                : "Difícil"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {problem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-accent">{problem.points} pts</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProblemAction(problem.id, "open-leetcode")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir en LeetCode
                      </Button>
                      {problem.status === "not-attempted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProblemAction(problem.id, "mark-in-progress")}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Marcar en Curso
                        </Button>
                      )}
                      {problem.status !== "solved" && (
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => handleProblemAction(problem.id, "validate-ac")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Validar AC
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleProblemAction(problem.id, "request-hint")}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Pedir Pista (-5 pts)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Team Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Marcador del Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">40 pts</div>
                    <p className="text-sm text-muted-foreground">Posición #3 de 15 equipos</p>
                  </div>
                  <Progress value={65} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 problema resuelto</span>
                    <span>Top 3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Historial de Envíos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            submission.status === "AC"
                              ? "bg-green-500"
                              : submission.status === "WA"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{submission.problem}</p>
                          <p className="text-xs text-muted-foreground">{submission.member}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              submission.status === "AC"
                                ? "text-green-600 border-green-200"
                                : submission.status === "WA"
                                  ? "text-red-600 border-red-200"
                                  : "text-yellow-600 border-yellow-200"
                            }`}
                          >
                            {submission.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{submission.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Team Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  Chat del Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 mb-3">
                  <div className="space-y-2">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.member}</span>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Escribe un mensaje..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[80px]"
                  />
                  <Button size="sm" onClick={sendChatMessage} className="bg-accent hover:bg-accent/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Miembros del Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">@{member.leetcode}</p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.status === "online" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                    </div>
                  ))}
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={copyTeamLink}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invitar Miembro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 shadow-lg">
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/ranking/${params.id}`} className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Ver Ranking
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Zap className="mr-2 h-4 w-4" />
              Atajos (1/2/3)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCompactMode(!compactMode)}>
              <Minimize2 className="mr-2 h-4 w-4" />
              {compactMode ? "Modo Normal" : "Modo Compacto"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rules Modal */}
      <Dialog open={rulesModalOpen} onOpenChange={setRulesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reglas de la Competencia</DialogTitle>
            <DialogDescription>Normas y condiciones del torneo</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li>• Cada equipo puede tener máximo 4 integrantes</li>
              <li>• Solo se permite usar LeetCode para resolver problemas</li>
              <li>• Las soluciones deben ser validadas automáticamente</li>
              <li>• Prohibido compartir código entre equipos</li>
              <li>• Penalización de 5 minutos por respuesta incorrecta</li>
              <li>• Los empates se resuelven por tiempo total</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reportar Problema</DialogTitle>
            <DialogDescription>Describe el problema que encontraste</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea placeholder="Describe el problema en detalle..." className="min-h-[100px]" />
            <div className="flex gap-2">
              <Button className="flex-1 bg-accent hover:bg-accent/90">Enviar Reporte</Button>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
