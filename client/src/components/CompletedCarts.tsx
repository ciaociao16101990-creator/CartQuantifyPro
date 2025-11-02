import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, MapPin, Tag, Database, Package } from "lucide-react";
import type { PackageItem } from "./PackageList";

export interface CompletedCart {
  id: string;
  cartNumber: number;
  destination: string;
  tag: string;
  bucketType: string;
  totalPackages: number;
  packages: PackageItem[];
  completedAt: Date;
}

interface CompletedCartsProps {
  carts: CompletedCart[];
}

export default function CompletedCarts({ carts }: CompletedCartsProps) {
  if (carts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carrelli Completati</CardTitle>
          <CardDescription>Nessun carrello completato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
            <p>I carrelli completati appariranno qui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Carrelli Completati</CardTitle>
        <CardDescription>{carts.length} {carts.length === 1 ? 'carrello completato' : 'carrelli completati'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {carts.map((cart) => (
            <AccordionItem key={cart.id} value={cart.id} data-testid={`accordion-cart-${cart.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 text-left">
                    <span className="font-semibold" data-testid={`text-cart-number-${cart.id}`}>
                      Carrello {cart.cartNumber}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {cart.totalPackages} pacchi
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <MapPin className="h-3 w-3" />
                        {cart.destination}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {cart.tag}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Database className="h-3 w-3" />
                      {cart.bucketType}
                    </Badge>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-sm font-medium">
                      Pacchi nel Carrello
                    </div>
                    <div className="divide-y">
                      {cart.packages.map((pkg, idx) => (
                        <div 
                          key={`${cart.id}-pkg-${idx}`} 
                          className="px-4 py-3 flex items-center justify-between gap-4"
                          data-testid={`completed-package-${cart.id}-${idx}`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-sm">{pkg.variety}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {pkg.length} cm
                            </Badge>
                            <span className="text-sm font-semibold tabular-nums min-w-[3ch] text-right">
                              {pkg.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
