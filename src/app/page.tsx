"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Trophy, Code, Search, Settings, ExternalLink, Eye, Play, Star, Sparkles } from "lucide-react"
import { LoginModal } from "@/components/auth/login-modal"
import { CreateTeamModal } from "@/components/team/create-team-modal"
import { JoinTeamModal } from "@/components/team/join-team-modal"
import { CompetitionDetailsModal } from "@/components/competition/competition-details-modal"
import { toast } from "sonner"

export default function HomePage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false)
  const [joinTeamModalOpen, setJoinTeamModalOpen] = useState(false)
  const [competitionDetailsOpen, setCompetitionDetailsOpen] = useState(false)
  const [leetcodeUsername, setLeetcodeUsername] = useState("")
  const [isLeetcodeConnected, setIsLeetcodeConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleSaveLeetcode = async () => {
    if (!leetcodeUsername.trim()) return

    setIsConnecting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLeetcodeConnected(true)
    setIsConnecting(false)
    toast(`Tu cuenta ${leetcodeUsername} ha sido vinculada exitosamente.`)
  }

  const sampleCompetition = {
    title: "Torneo Semanal - Algoritmos Básicos",
    description: "Competencia de 2 horas con problemas de dificultad Easy y Medium",
    status: "active" as const,
    duration: "2 horas",
    teams: 15,
    problems: 6,
    rules: [
      "Cada equipo puede tener máximo 4 integrantes",
      "Solo se permite usar LeetCode para resolver problemas",
      "Las soluciones deben ser validadas automáticamente",
      "Prohibido compartir código entre equipos",
      "El tiempo de penalización por respuesta incorrecta es de 5 minutos",
      "Los empates se resuelven por tiempo total de resolución",
    ],
    scoring: {
      easy: 10,
      medium: 30,
      hard: 50,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse rounded-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-bounce">
            <Sparkles className="h-4 w-4" />
            Plataforma de competencias en vivo
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
            Bienvenido a <span className="text-accent animate-pulse">CodeArena</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Compite en equipos, resuelve problemas de LeetCode y demuestra tus habilidades de programación en tiempo
            real
          </p>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/50">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl group-hover:text-accent transition-colors">Crear Equipo</CardTitle>
            <CardDescription>Forma tu equipo y personalízalo con nombre, color y avatar único</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
              onClick={() => setCreateTeamModalOpen(true)}
            >
              <Users className="mr-2 h-4 w-4" />
              Crear Nuevo Equipo
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-900 dark:to-green-950/50">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl group-hover:text-green-600 transition-colors">Unirse por Código</CardTitle>
            <CardDescription>¿Ya tienes un código de equipo? Únete en segundos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Ingresa el código del equipo"
              className="text-center text-lg font-mono border-2 focus:border-green-500 transition-colors"
            />
            <Button
              variant="outline"
              className="w-full border-2 border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-950 transition-all duration-300 transform hover:scale-[1.02] bg-transparent"
              size="lg"
              onClick={() => setJoinTeamModalOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Unirme al Equipo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* LeetCode Integration */}
      <Card className="max-w-2xl mx-auto hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-orange-50/30 dark:from-slate-900 dark:to-orange-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            Vincula tu LeetCode
          </CardTitle>
          <CardDescription>Conecta tu cuenta de LeetCode para validar automáticamente tus soluciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tu username de LeetCode"
              className="flex-1 border-2 focus:border-orange-500 transition-colors"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              disabled={isLeetcodeConnected || isConnecting}
            />
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px]"
              onClick={handleSaveLeetcode}
              disabled={isLeetcodeConnected || !leetcodeUsername.trim() || isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {isLeetcodeConnected ? "Conectado" : "Conectar"}
                </>
              )}
            </Button>
          </div>
          <div className="text-center">
            <Badge
              variant={isLeetcodeConnected ? "default" : "outline"}
              className={
                isLeetcodeConnected
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse"
                  : "text-muted-foreground"
              }
            >
              {isLeetcodeConnected ? `✓ LeetCode conectado (${leetcodeUsername})` : "⚠ No conectado"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Competitions */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-100 dark:to-blue-100 bg-clip-text text-transparent">
            Competencias Disponibles
          </h2>
          <p className="text-muted-foreground">Únete a las competencias activas o próximas</p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Sample Competition */}
          <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-0 bg-gradient-to-r from-white to-yellow-50/30 dark:from-slate-900 dark:to-yellow-950/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center animate-pulse">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    Torneo Semanal - Algoritmos Básicos
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Competencia de 2 horas con problemas de dificultad Easy y Medium
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-bounce">
                  🔴 En Vivo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                >
                  👥 15 equipos
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                >
                  🧩 6 problemas
                </Badge>
                <Badge
                  variant="outline"
                  className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-300 animate-pulse"
                >
                  ⏰ Termina en 1h 23m
                </Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompetitionDetailsOpen(true)}
                  className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-300"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Unirme Ahora
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Administrar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Competition */}
          <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] border-0 bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-12 -translate-x-12"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    Campeonato Mensual - Estructuras de Datos
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Competencia avanzada de 3 horas con problemas Medium y Hard
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shadow-md">
                  Próxima
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                >
                  🚀 Inicia en 2 días
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                >
                  🧩 8 problemas
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                >
                  💰 Premio: $500
                </Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-300 bg-transparent"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950 transition-all duration-300 bg-transparent"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrar Equipo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Problem Explorer */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 to-purple-900 dark:from-slate-100 dark:to-purple-100 bg-clip-text text-transparent">
            Explorar Problemas
          </h2>
          <p className="text-muted-foreground">Practica con problemas de LeetCode organizados por dificultad</p>
        </div>

        <Card className="max-w-4xl mx-auto hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar problemas por nombre, etiqueta o dificultad..."
                  className="w-full pl-10 border-2 focus:border-purple-500 transition-colors"
                />
              </div>
              <Button
                variant="outline"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                className="text-green-600 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950 bg-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Fácil (234)
              </Button>
              <Button
                variant="outline"
                className="text-yellow-600 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-950 bg-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                Medio (567)
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 bg-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                Difícil (189)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <CreateTeamModal open={createTeamModalOpen} onOpenChange={setCreateTeamModalOpen} />
      <JoinTeamModal open={joinTeamModalOpen} onOpenChange={setJoinTeamModalOpen} />
      <CompetitionDetailsModal
        open={competitionDetailsOpen}
        onOpenChange={setCompetitionDetailsOpen}
        competition={sampleCompetition}
      />
    </div>
  )
}
