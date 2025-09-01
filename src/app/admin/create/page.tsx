"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calendar,
  Clock,
  Trophy,
  Target,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  ArrowLeft,
  ArrowRight,
  Settings,
  HelpCircle,
  Zap,
  Award,
} from "lucide-react"
import { toast } from "sonner"

interface Problem {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  url: string
  slug: string
  isValid: boolean
  isValidating: boolean
}

interface TeamCode {
  id: string
  code: string
  teamName: string
  maxMembers: number
  currentMembers: number
}

export default function CreateCompetitionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1: General Data
  const [competitionName, setCompetitionName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [duration, setDuration] = useState("120") // minutes

  // Step 2: Scoring and Rules
  const [easyPoints, setEasyPoints] = useState("10")
  const [mediumPoints, setMediumPoints] = useState("30")
  const [hardPoints, setHardPoints] = useState("50")
  const [tiebreaker, setTiebreaker] = useState("time")
  const [hintsEnabled, setHintsEnabled] = useState(false)
  const [hintPenalty, setHintPenalty] = useState("5")
  const [wrongAttemptPenalty, setWrongAttemptPenalty] = useState(true)
  const [penaltyMinutes, setPenaltyMinutes] = useState("5")

  // Step 3: Problems
  const [problems, setProblems] = useState<Problem[]>([])
  const [newProblemUrl, setNewProblemUrl] = useState("")

  // Step 4: Teams
  const [teamCodes, setTeamCodes] = useState<TeamCode[]>([])
  const [maxTeamSize, setMaxTeamSize] = useState("4")
  const [numberOfTeams, setNumberOfTeams] = useState("20")

  const steps = [
    { number: 1, title: "Datos Generales", description: "Información básica del evento" },
    { number: 2, title: "Puntajes y Reglas", description: "Sistema de puntuación y configuración" },
    { number: 3, title: "Problemas", description: "Selección de problemas de LeetCode" },
    { number: 4, title: "Equipos", description: "Generación de códigos de equipo" },
  ]

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(competitionName && description && startDate && startTime && endDate && endTime)
      case 2:
        return !!(easyPoints && mediumPoints && hardPoints)
      case 3:
        return problems.length > 0 && problems.every((p) => p.isValid)
      case 4:
        return teamCodes.length > 0
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    } else {
      toast("Por favor completa todos los campos requeridos")
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const addProblem = async () => {
    if (!newProblemUrl.trim()) return

    const problemId = Date.now().toString()
    const newProblem: Problem = {
      id: problemId,
      title: "Validando...",
      difficulty: "medium",
      url: newProblemUrl,
      slug: extractSlugFromUrl(newProblemUrl),
      isValid: false,
      isValidating: true,
    }

    setProblems((prev) => [...prev, newProblem])
    setNewProblemUrl("")

    // Simulate validation
    setTimeout(() => {
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problemId
            ? {
                ...p,
                title: "Two Sum",
                difficulty: "easy",
                isValid: true,
                isValidating: false,
              }
            : p,
        ),
      )
      toast("El problema se ha añadido correctamente")
    }, 2000)
  }

  const removeProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id))
  }

  const extractSlugFromUrl = (url: string): string => {
    const match = url.match(/leetcode\.com\/problems\/([^/]+)/)
    return match ? match[1] : ""
  }

  const generateTeamCodes = () => {
    const codes: TeamCode[] = []
    const numTeams = Number.parseInt(numberOfTeams)

    for (let i = 1; i <= numTeams; i++) {
      codes.push({
        id: i.toString(),
        code: generateRandomCode(),
        teamName: `Equipo ${i}`,
        maxMembers: Number.parseInt(maxTeamSize),
        currentMembers: 0,
      })
    }

    setTeamCodes(codes)
    toast(`Se han generado ${numTeams} códigos de equipo`)
  }

  const generateRandomCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += "-"
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const exportInvitations = () => {
    const invitations = teamCodes.map((team) => ({
      teamCode: team.code,
      teamName: team.teamName,
      maxMembers: team.maxMembers,
      inviteLink: `https://codearena.com/join/${team.code}`,
    }))

    const dataStr = JSON.stringify(invitations, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "team-invitations.json"
    link.click()

    toast("El archivo se ha descargado correctamente")
  }

  const publishCompetition = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)

    toast("La competencia está ahora disponible para los participantes")
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Crear Nueva Competencia</h1>
            <p className="text-muted-foreground">Configura tu competencia de programación paso a paso</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="h-5 w-5" /> : <span>{step.number}</span>}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-0.5 mx-4 ${currentStep > step.number ? "bg-accent" : "bg-muted-foreground"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
            <div className="mt-2 text-center">
              <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-6">
              {/* Step 1: General Data */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="competition-name">
                        Nombre de la competencia *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="inline h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Nombre descriptivo que verán los participantes</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="competition-name"
                        value={competitionName}
                        onChange={(e) => setCompetitionName(e.target.value)}
                        placeholder="Torneo Semanal - Algoritmos Básicos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">
                        Duración (minutos) *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="inline h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tiempo total de la competencia en minutos</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="120"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe los objetivos y características de la competencia..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-accent" />
                        Fecha y Hora de Inicio *
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Fecha</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Hora</Label>
                          <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-accent" />
                        Fecha y Hora de Fin *
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="end-date">Fecha</Label>
                          <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-time">Hora</Label>
                          <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Scoring and Rules */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Sistema de Puntuación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="easy-points">Problemas Fáciles *</Label>
                        <Input
                          id="easy-points"
                          type="number"
                          value={easyPoints}
                          onChange={(e) => setEasyPoints(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medium-points">Problemas Medios *</Label>
                        <Input
                          id="medium-points"
                          type="number"
                          value={mediumPoints}
                          onChange={(e) => setMediumPoints(e.target.value)}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hard-points">Problemas Difíciles *</Label>
                        <Input
                          id="hard-points"
                          type="number"
                          value={hardPoints}
                          onChange={(e) => setHardPoints(e.target.value)}
                          placeholder="50"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-accent" />
                      Reglas de Desempate
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="tiebreaker">Criterio de desempate</Label>
                      <Select value={tiebreaker} onValueChange={setTiebreaker}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el criterio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Tiempo total de resolución</SelectItem>
                          <SelectItem value="problems">Número de problemas resueltos</SelectItem>
                          <SelectItem value="penalties">Menor número de penalizaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-accent" />
                      Configuración Avanzada
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="hints-enabled">Permitir pistas</Label>
                          <p className="text-sm text-muted-foreground">
                            Los equipos pueden solicitar pistas con penalización
                          </p>
                        </div>
                        <Switch id="hints-enabled" checked={hintsEnabled} onCheckedChange={setHintsEnabled} />
                      </div>

                      {hintsEnabled && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="hint-penalty">Penalización por pista (puntos)</Label>
                          <Input
                            id="hint-penalty"
                            type="number"
                            value={hintPenalty}
                            onChange={(e) => setHintPenalty(e.target.value)}
                            placeholder="5"
                            className="w-32"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="wrong-attempt-penalty">Penalización por intento fallido</Label>
                          <p className="text-sm text-muted-foreground">
                            Añadir tiempo de penalización por respuestas incorrectas
                          </p>
                        </div>
                        <Switch
                          id="wrong-attempt-penalty"
                          checked={wrongAttemptPenalty}
                          onCheckedChange={setWrongAttemptPenalty}
                        />
                      </div>

                      {wrongAttemptPenalty && (
                        <div className="ml-6 space-y-2">
                          <Label htmlFor="penalty-minutes">Penalización (minutos)</Label>
                          <Input
                            id="penalty-minutes"
                            type="number"
                            value={penaltyMinutes}
                            onChange={(e) => setPenaltyMinutes(e.target.value)}
                            placeholder="5"
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Problems */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-accent" />
                      Añadir Problemas de LeetCode
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={newProblemUrl}
                        onChange={(e) => setNewProblemUrl(e.target.value)}
                        placeholder="https://leetcode.com/problems/two-sum/"
                        className="flex-1"
                      />
                      <Button onClick={addProblem} disabled={!newProblemUrl.trim()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Problema
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pega la URL completa del problema de LeetCode. Se validará automáticamente.
                    </p>
                  </div>

                  {problems.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Problemas Añadidos ({problems.length})</h4>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {problems.map((problem) => (
                            <Card key={problem.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {problem.isValidating ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent" />
                                  ) : problem.isValid ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  <div>
                                    <p className="font-medium">{problem.title}</p>
                                    <p className="text-sm text-muted-foreground">{problem.slug}</p>
                                  </div>
                                  <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty === "easy"
                                      ? "Fácil"
                                      : problem.difficulty === "medium"
                                        ? "Medio"
                                        : "Difícil"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(problem.url, "_blank")}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Probar enlace</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeProblem(problem.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Teams */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Configuración de Equipos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-team-size">Tamaño máximo de equipo</Label>
                        <Input
                          id="max-team-size"
                          type="number"
                          value={maxTeamSize}
                          onChange={(e) => setMaxTeamSize(e.target.value)}
                          placeholder="4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number-of-teams">Número de equipos</Label>
                        <Input
                          id="number-of-teams"
                          type="number"
                          value={numberOfTeams}
                          onChange={(e) => setNumberOfTeams(e.target.value)}
                          placeholder="20"
                        />
                      </div>
                    </div>
                    <Button onClick={generateTeamCodes} className="bg-accent hover:bg-accent/90">
                      <Zap className="mr-2 h-4 w-4" />
                      Generar Códigos de Equipo
                    </Button>
                  </div>

                  {teamCodes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Códigos Generados ({teamCodes.length})</h4>
                        <Button variant="outline" onClick={exportInvitations}>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Invitaciones
                        </Button>
                      </div>
                      <ScrollArea className="h-64">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {teamCodes.map((team) => (
                            <Card key={team.id} className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-mono text-sm font-medium">{team.code}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {team.currentMembers}/{team.maxMembers} miembros
                                  </p>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        navigator.clipboard.writeText(team.code)
                                        toast( "El código ha sido copiado al portapapeles")
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copiar código</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="bg-accent hover:bg-accent/90"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={publishCompetition}
                  disabled={!validateStep(currentStep) || isLoading}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Publicar Competencia
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
