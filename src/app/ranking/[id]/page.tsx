"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  Medal,
  Crown,
  Users,
  User,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Zap,
  Target,
  Clock,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for teams
const teamsData = [
  {
    id: 1,
    name: "Los Algoritmos Supremos",
    avatar: "🚀",
    color: "blue",
    members: ["Ana García", "Carlos López", "María Rodríguez", "Luis Martín"],
    points: 120,
    solves: 4,
    totalTime: "2:45:30",
    lastSolve: "Container With Most Water",
    lastSolveTime: "2:43:15",
    penalties: 2,
    achievements: ["first-blood", "speed-demon"],
    isLastSolver: false,
  },
  {
    id: 2,
    name: "Code Warriors",
    avatar: "⚡",
    color: "red",
    members: ["Pedro Sánchez", "Laura Jiménez", "Diego Torres"],
    points: 110,
    solves: 3,
    totalTime: "2:12:45",
    lastSolve: "Add Two Numbers",
    lastSolveTime: "2:10:30",
    penalties: 1,
    achievements: ["consistent"],
    isLastSolver: true,
  },
  {
    id: 3,
    name: "Binary Beasts",
    avatar: "🔥",
    color: "green",
    members: ["Sofia Ruiz", "Miguel Ángel", "Carmen Vega", "Javier Moreno"],
    points: 100,
    solves: 3,
    totalTime: "2:55:20",
    lastSolve: "Two Sum",
    lastSolveTime: "1:45:10",
    penalties: 3,
    achievements: ["hard-solver"],
    isLastSolver: false,
  },
  {
    id: 4,
    name: "Recursive Rebels",
    avatar: "💎",
    color: "purple",
    members: ["Elena Castro", "Roberto Silva"],
    points: 90,
    solves: 2,
    totalTime: "1:58:35",
    lastSolve: "Reverse Integer",
    lastSolveTime: "1:55:20",
    penalties: 0,
    achievements: ["clean-code"],
    isLastSolver: false,
  },
  {
    id: 5,
    name: "Stack Overflow",
    avatar: "🎯",
    color: "orange",
    members: ["Andrés Morales", "Patricia Herrera", "Fernando Ruiz"],
    points: 80,
    solves: 2,
    totalTime: "2:30:15",
    lastSolve: "Longest Substring",
    lastSolveTime: "2:28:45",
    penalties: 4,
    achievements: [],
    isLastSolver: false,
  },
]

// Mock data for individual ranking
const individualsData = [
  {
    id: 1,
    name: "Ana García",
    team: "Los Algoritmos Supremos",
    avatar: "AG",
    points: 50,
    solves: 2,
    totalTime: "1:25:30",
    lastSolve: "Container With Most Water",
    lastSolveTime: "2:28:45",
    achievements: ["first-blood"],
  },
  {
    id: 2,
    name: "Pedro Sánchez",
    team: "Code Warriors",
    avatar: "PS",
    points: 45,
    solves: 2,
    totalTime: "1:12:45",
    lastSolve: "Add Two Numbers",
    lastSolveTime: "2:28:45",
    achievements: ["speed-demon"],
  },
  {
    id: 3,
    name: "Sofia Ruiz",
    team: "Binary Beasts",
    avatar: "SR",
    points: 40,
    solves: 2,
    totalTime: "1:55:20",
    lastSolve: "Two Sum",
    lastSolveTime: "2:28:45",
    achievements: ["hard-solver"],
  },
  {
    id: 4,
    name: "Carlos López",
    team: "Los Algoritmos Supremos",
    avatar: "CL",
    points: 35,
    solves: 1,
    totalTime: "0:45:15",
    lastSolve: "Two Sum",
    lastSolveTime: "2:28:45",
    achievements: [],
  },
  {
    id: 5,
    name: "Laura Jiménez",
    team: "Code Warriors",
    avatar: "LJ",
    points: 35,
    solves: 1,
    totalTime: "1:02:30",
    lastSolve: "Reverse Integer",
    lastSolveTime: "2:28:45",
    achievements: ["consistent"],
  },
]

const achievements = {
  "first-blood": { name: "Primera Sangre", icon: "🩸", description: "Primer equipo en resolver un problema" },
  "speed-demon": { name: "Demonio de Velocidad", icon: "⚡", description: "Resolución más rápida" },
  "hard-solver": { name: "Domador de Difíciles", icon: "💪", description: "Mayor cantidad de problemas difíciles" },
  consistent: { name: "Consistente", icon: "🎯", description: "Sin penalizaciones" },
  "clean-code": { name: "Código Limpio", icon: "✨", description: "Sin intentos fallidos" },
}

export default function RankingPage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<"teams" | "individual">("teams")
  const [showMedals, setShowMedals] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [presentationMode, setPresentationMode] = useState(false)
  const [highlightLastSolve, setHighlightLastSolve] = useState(true)
  const [lastSolveAnimation, setLastSolveAnimation] = useState<number | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (highlightLastSolve) {
        const lastSolver = teamsData.find((team) => team.isLastSolver)
        if (lastSolver) {
          setLastSolveAnimation(lastSolver.id)
          setTimeout(() => setLastSolveAnimation(null), 3000)
        }
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [highlightLastSolve])

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{position}</span>
    }
  }

  const getTeamColorClass = (color: string) => {
    const colors = {
      blue: "border-l-blue-500 bg-blue-50 dark:bg-blue-950",
      red: "border-l-red-500 bg-red-50 dark:bg-red-950",
      green: "border-l-green-500 bg-green-50 dark:bg-green-950",
      purple: "border-l-purple-500 bg-purple-50 dark:bg-purple-950",
      orange: "border-l-orange-500 bg-orange-50 dark:bg-orange-950",
    }
    return colors[color as keyof typeof colors] || "border-l-gray-500 bg-gray-50 dark:bg-gray-950"
  }

  const currentData = viewMode === "teams" ? teamsData : individualsData

  return (
    <div className={cn("min-h-screen bg-background", presentationMode && "p-0")}>
      {/* Header */}
      {!presentationMode && (
        <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Ranking en Tiempo Real</h1>
                <p className="text-muted-foreground">Torneo Semanal - Algoritmos Básicos</p>
              </div>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "teams" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("teams")}
                    className={viewMode === "teams" ? "bg-accent hover:bg-accent/90" : ""}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Equipos
                  </Button>
                  <Button
                    variant={viewMode === "individual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("individual")}
                    className={viewMode === "individual" ? "bg-accent hover:bg-accent/90" : ""}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Individual
                  </Button>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="highlight-solve" checked={highlightLastSolve} onCheckedChange={setHighlightLastSolve} />
                    <Label htmlFor="highlight-solve" className="text-sm">
                      Resaltar último solve
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="show-medals" checked={showMedals} onCheckedChange={setShowMedals} />
                    <Label htmlFor="show-medals" className="text-sm">
                      Mostrar medallas
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={soundEnabled ? "" : "text-muted-foreground"}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresentationMode(!presentationMode)}
                    className="bg-transparent"
                  >
                    {presentationMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    Modo Presentación
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <div className={cn("container mx-auto px-4 py-6", presentationMode && "px-8 py-8")}>
        <div className="space-y-4">
          {/* Stats Cards */}
          {!presentationMode && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Equipos Activos</p>
                      <p className="text-2xl font-bold">15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Problemas Resueltos</p>
                      <p className="text-2xl font-bold">42</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tiempo Restante</p>
                      <p className="text-2xl font-bold">1:23:45</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Último Solve</p>
                      <p className="text-sm font-medium">Code Warriors</p>
                      <p className="text-xs text-muted-foreground">hace 2 min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Ranking List */}
          <div className="space-y-3">
            {currentData.map((item, index) => {
              const position = index + 1
              const isTeam = viewMode === "teams"
              const isHighlighted = highlightLastSolve && lastSolveAnimation === item.id

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "transition-all duration-500 border-l-4",
                    isTeam ? getTeamColorClass((item as any).color) : "border-l-accent bg-accent/5",
                    isHighlighted && "animate-pulse ring-2 ring-accent shadow-lg scale-[1.02]",
                    presentationMode && "text-lg",
                  )}
                >
                  <CardContent className={cn("p-4", presentationMode && "p-6")}>
                    <div className="flex items-center justify-between">
                      {/* Rank and Team/User Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">{getRankIcon(position)}</div>

                        <div className="flex items-center gap-3">
                          <div className={cn("text-2xl", presentationMode && "text-4xl")}>
                            {isTeam ? (item as any).avatar : ""}
                          </div>
                          {!isTeam && (
                            <Avatar className={cn("h-10 w-10", presentationMode && "h-12 w-12")}>
                              <AvatarFallback>{(item as any).avatar}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <h3 className={cn("font-semibold", presentationMode && "text-xl")}>{item.name}</h3>
                            {!isTeam && (
                              <p className={cn("text-sm text-muted-foreground", presentationMode && "text-base")}>
                                {(item as any).team}
                              </p>
                            )}
                            {isTeam && (
                              <p className={cn("text-sm text-muted-foreground", presentationMode && "text-base")}>
                                {(item as any).members.length} miembros
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className={cn("text-2xl font-bold text-accent", presentationMode && "text-3xl")}>
                            {item.points}
                          </p>
                          <p className={cn("text-xs text-muted-foreground", presentationMode && "text-sm")}>puntos</p>
                        </div>
                        <div className="text-center">
                          <p className={cn("text-xl font-semibold", presentationMode && "text-2xl")}>{item.solves}</p>
                          <p className={cn("text-xs text-muted-foreground", presentationMode && "text-sm")}>
                            resueltos
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={cn("text-sm font-mono", presentationMode && "text-base")}>{item.totalTime}</p>
                          <p className={cn("text-xs text-muted-foreground", presentationMode && "text-sm")}>tiempo</p>
                        </div>
                        {isTeam && (item as any).penalties > 0 && (
                          <div className="text-center">
                            <p className={cn("text-sm text-red-500", presentationMode && "text-base")}>
                              +{(item as any).penalties}
                            </p>
                            <p className={cn("text-xs text-muted-foreground", presentationMode && "text-sm")}>
                              penalizaciones
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Achievements */}
                      {showMedals && item.achievements && item.achievements.length > 0 && (
                        <div className="flex items-center gap-2">
                          {item.achievements.map((achievement) => (
                            <Badge
                              key={achievement}
                              variant="outline"
                              className={cn("flex items-center gap-1 text-xs", presentationMode && "text-sm px-3 py-1")}
                              title={achievements[achievement as keyof typeof achievements]?.description}
                            >
                              <span>{achievements[achievement as keyof typeof achievements]?.icon}</span>
                              <span className="hidden sm:inline">
                                {achievements[achievement as keyof typeof achievements]?.name}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Last Solve Info */}
                    {item.lastSolve && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Último problema: {item.lastSolve}</span>
                          <span>Resuelto en: {item.lastSolveTime}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Presentation Mode Footer */}
          {presentationMode && (
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4">
              <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    Actualización en tiempo real
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">En vivo</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPresentationMode(false)}
                  className="bg-transparent"
                >
                  <Minimize className="mr-2 h-4 w-4" />
                  Salir del Modo Presentación
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Legends */}
      {!presentationMode && showMedals && (
        <div className="container mx-auto px-4 pb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Leyenda de Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(achievements).map(([key, achievement]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
