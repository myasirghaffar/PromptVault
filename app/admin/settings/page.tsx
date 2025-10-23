import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Configure your platform settings</p>
        </div>

        <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm py-6">
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Manage your application configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Settings page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
