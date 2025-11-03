import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant?: string) => {
    const iconClasses = "h-5 w-5 flex-shrink-0"
    
    switch (variant) {
      case "success":
        return <CheckCircle2 className={`${iconClasses} text-green-600 dark:text-green-500`} />
      case "destructive":
        return <XCircle className={`${iconClasses} text-destructive-foreground`} />
      default:
        return <Info className={`${iconClasses} text-primary`} />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3 flex-1">
              {getIcon(props.variant || undefined)}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle className="text-base font-semibold">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
