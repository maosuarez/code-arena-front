"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserPlus, Hash } from "lucide-react"

interface JoinTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinTeamModal({ open, onOpenChange }: JoinTeamModalProps) {
  const [teamCode, setTeamCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamCode.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onOpenChange(false)

    // Reset form
    setTeamCode("")
  }

  const formatTeamCode = (value: string) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    // Add dashes every 4 characters
    return cleaned.replace(/(.{4})/g, "$1-").replace(/-$/, "")
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTeamCode(e.target.value)
    if (formatted.length <= 13) {
      // 12 chars + 2 dashes
      setTeamCode(formatted)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-secondary" />
            Unirse a Equipo
          </DialogTitle>
          <DialogDescription>Ingresa el código de invitación que te compartió tu equipo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoinTeam} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-code" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Código del equipo
            </Label>
            <Input
              id="team-code"
              value={teamCode}
              onChange={handleCodeChange}
              placeholder="ABCD-EFGH-IJKL"
              className="text-center text-lg font-mono tracking-wider"
              required
            />
            <p className="text-xs text-muted-foreground text-center">
              El código debe tener 12 caracteres (formato: XXXX-XXXX-XXXX)
            </p>
          </div>

          {/* Example */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground mb-2">Ejemplo de código:</p>
            <code className="text-sm font-mono bg-background px-2 py-1 rounded border">FIRE-2024-ALGO</code>
          </div>

          <Button
            type="submit"
            className="w-full bg-transparent"
            variant="outline"
            disabled={isLoading || teamCode.length < 13}
          >
            {isLoading ? "Uniéndose..." : "Unirse al Equipo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
