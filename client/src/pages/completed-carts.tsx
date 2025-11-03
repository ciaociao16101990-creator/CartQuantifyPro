import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart, FileDown, Trash2, Flower2, Ruler } from "lucide-react";
import { useLocation } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Package {
  id: string;
  variety: string;
  length: number;
  quantity: number;
}

interface Cart {
  id: string;
  cartNumber: number;
  destination: string;
  tag: string | null;
  bucketType: string | null;
  totalPackages: number;
  isCompleted: number;
  packages: Package[];
}

export default function CompletedCarts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: carts = [], isLoading } = useQuery<Cart[]>({
    queryKey: ["/api/carts"],
    refetchInterval: 2000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (cartId: string) => {
      await apiRequest("DELETE", `/api/carts/${cartId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carts"] });
      toast({
        title: "Carrello eliminato",
        description: "Il carrello è stato eliminato con successo",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare il carrello",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export/excel");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carrelli_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Esportazione completata",
        description: `${completedCarts.length} carrelli esportati con successo`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Esportazione fallita",
        variant: "destructive",
      });
    }
  };

  const completedCarts = carts.filter(cart => cart.isCompleted === 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-5 w-5" />
            Indietro
          </Button>
          
          <Button
            onClick={handleExport}
            disabled={completedCarts.length === 0}
            className="gap-2"
            data-testid="button-export"
          >
            <FileDown className="h-5 w-5" />
            Esporta Tutto
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Carrelli Completati</h1>
            <p className="text-sm text-muted-foreground">
              {completedCarts.length} {completedCarts.length === 1 ? 'carrello completato' : 'carrelli completati'}
            </p>
          </div>
        </div>

        {completedCarts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Nessun carrello completato</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {completedCarts.map((cart) => (
              <AccordionItem key={cart.id} value={cart.id} className="border-0">
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <AccordionTrigger className="flex-1 hover:no-underline [&[data-state=open]>div>.chevron]:rotate-180">
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-10 w-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-500" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">Carrello {cart.cartNumber}</h3>
                              <Badge variant="default" className="bg-green-600 dark:bg-green-500 gap-1 h-7">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                {cart.totalPackages} pacchi
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <Badge variant="secondary" className="text-xs h-6">{cart.destination}</Badge>
                              {cart.tag && <Badge variant="secondary" className="text-xs h-6">{cart.tag}</Badge>}
                              {cart.bucketType && <Badge variant="secondary" className="text-xs h-6">{cart.bucketType}</Badge>}
                            </div>
                          </div>
                          <div className="chevron transition-transform duration-200">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive flex-shrink-0"
                            data-testid={`button-delete-cart-${cart.id}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Elimina Carrello {cart.cartNumber}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Questa azione non può essere annullata. Il carrello e tutti i suoi pacchi verranno eliminati definitivamente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-testid="button-cancel-delete">Annulla</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(cart.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-testid="button-confirm-delete"
                            >
                              Elimina
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  
                  <AccordionContent>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {cart.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover-elevate"
                        >
                          <div className="h-9 w-9 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <Flower2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{pkg.variety}</p>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Ruler className="h-3.5 w-3.5" />
                              <span>{pkg.length} cm</span>
                            </div>
                          </div>
                          <Badge variant="default" className="h-8 px-3 text-base font-semibold flex-shrink-0">
                            {pkg.quantity}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
