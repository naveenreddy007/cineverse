import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface FormSubmitProps {
  isSubmitting: boolean
  submitText: string
  submittingText: string
  className?: string
}

export function UIFormSubmit({ isSubmitting, submitText, submittingText, className = "" }: FormSubmitProps) {
  return (
    <Button
      type="submit"
      className={`w-full bg-neon-blue text-black hover:bg-neon-blue/80 ${className}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {submittingText}
        </>
      ) : (
        submitText
      )}
    </Button>
  )
}
