import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InfoMessageProps {
  title?: string
  message: string
}

export function UIInfoMessage({ title = "Information", message }: InfoMessageProps) {
  return (
    <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-500">
      <Info className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
