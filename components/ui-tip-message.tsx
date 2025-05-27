import { Lightbulb } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TipMessageProps {
  title?: string
  message: string
}

export function UITipMessage({ title = "Tip", message }: TipMessageProps) {
  return (
    <Alert className="bg-purple-500/10 border-purple-500/30 text-purple-500">
      <Lightbulb className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
