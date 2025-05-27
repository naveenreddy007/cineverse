import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WarningMessageProps {
  title?: string
  message: string
}

export function UIWarningMessage({ title = "Warning", message }: WarningMessageProps) {
  return (
    <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-500">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
