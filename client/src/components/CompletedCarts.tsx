import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, MapPin, Tag, Database, Package, Flower2, Ruler, ShoppingCart } from "lucide-react";
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
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <CardTitle className="text-xl">Carrelli Completati</CardTitle>
            <CardDescription className="text-xs">
              {carts.length} {carts.length === 1 ? 'carrello completato' : 'carrelli completati'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {carts.map((cart) => (
            <AccordionItem 
              key={cart.id} 
              value={cart.id} 
              data-testid={`accordion-cart-${cart.id}`}
              className="border rounded-lg overflow-hidden bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline p-4 hover-elevate">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 text-left">
                    <span className="font-bold text-lg" data-testid={`text-cart-number-${cart.id}`}>
                      Carrello {cart.cartNumber}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="text-xs font-semibold bg-green-600 dark:bg-green-600 text-white">
                        {cart.totalPackages} pacchi
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {cart.destination}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        {cart.tag}
                      </Badge>
                      <Badge variant="secondary" className="text-xs gap-1.5">
                        <Database className="h-3.5 w-3.5" />
                        {cart.bucketType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-2 mt-2">
                  <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Dettaglio Pacchi
                  </div>
                  {cart.packages.map((pkg, idx) => (
                    <div 
                      key={`${cart.id}-pkg-${idx}`} 
                      className="flex items-center gap-3 p-3 rounded-md border bg-card hover-elevate transition-all"
                      data-testid={`completed-package-${cart.id}-${idx}`}
                    >
                      <div className="h-10 w-10 rounded-md bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Flower2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm block">{pkg.variety}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                          <Ruler className="h-3 w-3" />
                          <span className="text-xs">{pkg.length} cm</span>
                        </div>
                      </div>
                      <Badge className="h-7 px-3 text-sm font-bold tabular-nums bg-primary text-primary-foreground">
                        {pkg.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
