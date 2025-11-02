import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Tag, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveCounterProps {
  current: number;
  total: number;
  cartNumber: number;
  destination?: string;
  tag?: string;
  bucketType?: string;
}

export default function LiveCounter({ 
  current, 
  total, 
  cartNumber,
  destination,
  tag,
  bucketType 
}: LiveCounterProps) {
  const percentage = (current / total) * 100;
  const isNearComplete = current >= 60 && current < total;
  const isComplete = current >= total;

  return (
    <Card className="w-full sticky top-0 z-40 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
              <h3 className="text-xl md:text-lg font-semibold">Carrello {cartNumber}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div 
                  className={cn(
                    "text-3xl md:text-5xl font-bold tabular-nums leading-none",
                    isComplete && "text-green-600 dark:text-green-500",
                    isNearComplete && "text-amber-600 dark:text-amber-500"
                  )}
                  data-testid="text-counter"
                >
                  {current}<span className="text-xl md:text-3xl text-muted-foreground">/{total}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">pacchi</p>
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
                      "transition-all duration-300 md:hidden",
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
                      "transition-all duration-300 hidden md:block",
                      isComplete && "text-green-600 dark:text-green-500",
                      isNearComplete && "text-amber-600 dark:text-amber-500",
                      !isComplete && !isNearComplete && "text-primary"
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base md:text-lg font-semibold tabular-nums">{Math.round(percentage)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {destination && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 text-xs" data-testid="badge-destination">
                <MapPin className="h-3 w-3" />
                {destination}
              </Badge>
              {tag && (
                <Badge variant="secondary" className="gap-1 text-xs" data-testid="badge-tag">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              )}
              {bucketType && (
                <Badge variant="secondary" className="gap-1 text-xs" data-testid="badge-bucket">
                  <Database className="h-3 w-3" />
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
