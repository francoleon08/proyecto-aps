interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors ${
              step === currentStep
                ? "bg-primary text-primary-foreground border-primary"
                : step < currentStep
                  ? "bg-primary/20 text-primary border-primary"
                  : "bg-card text-muted-foreground border-border"
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div className={`w-12 h-0.5 mx-1 ${step < currentStep ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
