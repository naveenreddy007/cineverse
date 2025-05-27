import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SuccessMessageProps {
  title?: string
  message: string
}

export function UISuccessMessage({ title = "Success", message }: SuccessMessageProps) {
  return (
    <Alert className="bg-green-500/10 border-green-500/30 text-green-500">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
