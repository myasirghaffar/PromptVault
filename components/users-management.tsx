"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Shield, ShieldOff, Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  is_admin: boolean
  created_at: string
}

interface UsersManagementProps {
  users: User[]
}

export function UsersManagement({ users: initialUsers }: UsersManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "remove" : "grant"} admin access?`)) {
      return
    }

    setUpdatingId(userId)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("profiles").update({ is_admin: !currentStatus }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((u) => (u.id === userId ? { ...u, is_admin: !currentStatus } : u)))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.id} className="border-purple-500/20 bg-card/50 backdrop-blur-xl py-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 py-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg">{user.email}</CardTitle>
                  {user.is_admin && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <CardDescription>Joined {new Date(user.created_at).toLocaleDateString()}</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleAdmin(user.id, user.is_admin)}
                disabled={updatingId === user.id}
                className={
                  user.is_admin
                    ? "border-red-500/30 hover:bg-red-500/10 text-red-400 cursor-pointer"
                    : "border-purple-500/30 hover:bg-purple-500/10 text-purple-400 cursor-pointer"
                }
              >
                {updatingId === user.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user.is_admin ? (
                  <>
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Make Admin
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
