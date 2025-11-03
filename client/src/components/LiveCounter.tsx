import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Tag, Database, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveCounterProps {
  current: number;
  total: number;
  destination?: string;
  tag?: string;
  bucketType?: string;
}

export default function LiveCounter({ 
  current, 
  total, 
  destination,
  tag,
  bucketType 
}: LiveCounterProps) {
  const percentage = (current / total) * 100;
  const isNearComplete = current >= 60 && current < total;
  const isComplete = current >= total;

  return (
    <Card className={cn(
      "w-full sticky top-0 z-40 shadow-xl border-2 transition-all duration-300",
      isComplete && "border-green-500/30 bg-green-500/5 dark:bg-green-500/10",
      isNearComplete && "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10",
      !isComplete && !isNearComplete && "border-primary/20"
    )}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                isComplete && "bg-green-500/10 dark:bg-green-500/20",
                isNearComplete && "bg-amber-500/10 dark:bg-amber-500/20",
                !isComplete && !isNearComplete && "bg-primary/10 dark:bg-primary/20"
              )}>
                <ShoppingCart className={cn(
                  "h-6 w-6",
                  isComplete && "text-green-600 dark:text-green-500",
                  isNearComplete && "text-amber-600 dark:text-amber-500",
                  !isComplete && !isNearComplete && "text-primary"
                )} />
              </div>
              <div>
                <h3 className="text-xl md:text-lg font-bold">Carrello in corso</h3>
                <p className="text-xs text-muted-foreground">
                  {isComplete ? "Completato!" : isNearComplete ? "Quasi completo" : "In lavorazione"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div 
                  className={cn(
                    "text-3xl md:text-5xl font-bold tabular-nums leading-none",
                    isComplete && "text-green-600 dark:text-green-500",
                    isNearComplete && "text-amber-600 dark:text-amber-500",
                    !isComplete && !isNearComplete && "text-primary"
                  )}
                  data-testid="text-counter"
                >
                  {current}<span className="text-xl md:text-3xl text-muted-foreground">/{total}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">pacchi</p>
              </div>

              <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
                <svg className="transform -rotate-90 h-20 w-20 md:h-24 md:w-24">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="none"
                    className="text-muted/20 md:hidden"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
                    className={cn(
                      "transition-all duration-500 md:hidden",
                      isComplete && "text-green-600 dark:text-green-500",
                      isNearComplete && "text-amber-600 dark:text-amber-500",
                      !isComplete && !isNearComplete && "text-primary"
                    )}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20 hidden md:block"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                    className={cn(
                      "transition-all duration-500 hidden md:block",
                      isComplete && "text-green-600 dark:text-green-500",
                      isNearComplete && "text-amber-600 dark:text-amber-500",
                      !isComplete && !isNearComplete && "text-primary"
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-base md:text-lg font-bold tabular-nums",
                    isComplete && "text-green-600 dark:text-green-500",
                    isNearComplete && "text-amber-600 dark:text-amber-500",
                    !isComplete && !isNearComplete && "text-primary"
                  )}>{Math.round(percentage)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {destination && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 text-xs h-7" data-testid="badge-destination">
                <MapPin className="h-3.5 w-3.5" />
                {destination}
              </Badge>
              {tag && (
                <Badge variant="secondary" className="gap-1.5 text-xs h-7" data-testid="badge-tag">
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </Badge>
              )}
              {bucketType && (
                <Badge variant="secondary" className="gap-1.5 text-xs h-7" data-testid="badge-bucket">
                  <Database className="h-3.5 w-3.5" />
                  {bucketType}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
