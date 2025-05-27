import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  title?: string
  message: string
}

export function UIErrorMessage({ title = "Error", message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-500">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
