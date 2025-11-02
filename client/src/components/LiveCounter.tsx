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
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Carrello {cartNumber}</h3>
            </div>
            
            {destination && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                <Badge variant="secondary" className="gap-1" data-testid="badge-destination">
                  <MapPin className="h-3 w-3" />
                  {destination}
                </Badge>
                {tag && (
                  <Badge variant="secondary" className="gap-1" data-testid="badge-tag">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                )}
                {bucketType && (
                  <Badge variant="secondary" className="gap-1" data-testid="badge-bucket">
                    <Database className="h-3 w-3" />
                    {bucketType}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div 
                className={cn(
                  "text-4xl md:text-5xl font-bold tabular-nums",
                  isComplete && "text-green-600 dark:text-green-500",
                  isNearComplete && "text-amber-600 dark:text-amber-500"
                )}
                data-testid="text-counter"
              >
                {current} <span className="text-muted-foreground">/ {total}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">pacchi</p>
            </div>

            <div className="relative h-24 w-24">
              <svg className="transform -rotate-90 h-24 w-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
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
                    "transition-all duration-300",
                    isComplete && "text-green-600 dark:text-green-500",
                    isNearComplete && "text-amber-600 dark:text-amber-500",
                    !isComplete && !isNearComplete && "text-primary"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold tabular-nums">{Math.round(percentage)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
