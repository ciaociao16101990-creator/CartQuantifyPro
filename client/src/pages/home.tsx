import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import CartSetup from "@/components/CartSetup";
import LiveCounter from "@/components/LiveCounter";
import AddPackageForm from "@/components/AddPackageForm";
import PackageList, { type PackageItem } from "@/components/PackageList";
import EditPackageDialog from "@/components/EditPackageDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Cart, Package } from "@shared/schema";

interface CartSetupData {
  destination: string;
  tag: string;
  bucketType: string;
}

type CartWithPackages = Cart & { packages: Package[] };

export default function Home() {
  const { toast } = useToast();
  
  const [cartStarted, setCartStarted] = useState(false);
  const [currentCartId, setCurrentCartId] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Fetch all carts
  const { data: allCarts = [] } = useQuery<CartWithPackages[]>({
    queryKey: ['/api/carts'],
  });

  // Fetch current cart packages with polling to detect backend auto-completion
  const { data: currentCartData } = useQuery<CartWithPackages>({
    queryKey: ['/api/carts', currentCartId],
    enabled: !!currentCartId,
    refetchInterval: currentCartId ? 2000 : false, // Poll every 2 seconds
  });

  const [, setLocation] = useLocation();
  
  const currentCart = currentCartData;
  const packages = currentCart?.packages || [];
  const currentTotal = packages.reduce((sum, pkg) => sum + pkg.quantity, 0);
  const maxPackages = currentCart?.maxPackages || 72;
  const completedCarts = allCarts.filter(c => c.isCompleted === 1);
  // Numerazione basata solo sui carrelli completati: se 0 completati -> Carrello 1, se 3 completati -> Carrello 4
  const currentCartNumber = completedCarts.length + 1;

  // Create cart mutation
  const createCartMutation = useMutation({
    mutationFn: async (setup: CartSetupData) => {
      const res = await apiRequest('POST', '/api/carts', {
        cartNumber: currentCartNumber,
        destination: setup.destination,
        tag: setup.tag,
        bucketType: setup.bucketType,
        totalPackages: 0,
        maxPackages: 72,
        isCompleted: 0,
      });
      return await res.json() as Cart;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts'] });
      setCurrentCartId(data.id);
      setCartStarted(true);
      toast({
        variant: "success",
        title: "Carrello avviato",
        description: `Carrello ${data.cartNumber} pronto per l'aggiunta di pacchi`,
      });
    },
  });

  // Add package mutation
  const addPackageMutation = useMutation({
    mutationFn: async (pkg: { variety: string; length: number; quantity: number }) => {
      if (!currentCartId) throw new Error("No cart selected");
      
      const res = await apiRequest('POST', '/api/packages', {
        cartId: currentCartId,
        ...pkg,
      });
      return await res.json() as Package;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/carts', currentCartId] });
      
      toast({
        variant: "success",
        title: "Pacco aggiunto",
        description: `${variables.variety} - ${variables.length}cm (Qty: ${variables.quantity})`,
      });
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async (pkg: PackageItem) => {
      const res = await apiRequest('PATCH', `/api/packages/${pkg.id}`, {
        variety: pkg.variety,
        length: pkg.length,
        quantity: pkg.quantity,
      });
      return await res.json() as Package;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/carts', currentCartId] });
      setShowEditDialog(false);
      
      toast({
        variant: "success",
        title: "Pacco aggiornato",
        description: `${variables.variety} - ${variables.length}cm (Qty: ${variables.quantity})`,
      });
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      await apiRequest('DELETE', `/api/packages/${packageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/carts', currentCartId] });
      
      toast({
        title: "Pacco eliminato",
        description: "Il pacco è stato rimosso dal carrello",
      });
    },
  });


  // Check if current cart was auto-completed by backend
  useEffect(() => {
    if (currentCart && currentCart.isCompleted === 1) {
      // Cart was completed, show toast
      toast({
        variant: "success",
        title: `Carrello ${currentCart.cartNumber} completato!`,
        description: `Automaticamente avviato Carrello ${currentCart.cartNumber + 1}`,
      });
      
      // Auto-start new cart with same settings
      setTimeout(() => {
        createCartMutation.mutate({
          destination: currentCart.destination,
          tag: currentCart.tag,
          bucketType: currentCart.bucketType,
        });
      }, 500);
    }
  }, [currentCart?.isCompleted]);

  const handleStartCart = (setup: CartSetupData) => {
    createCartMutation.mutate(setup);
  };

  const handleResetCart = () => {
    if (packages.length > 0) {
      setShowResetDialog(true);
    } else {
      confirmReset();
    }
  };

  const confirmReset = () => {
    setCartStarted(false);
    setCurrentCartId(null);
    setShowResetDialog(false);
    toast({
      variant: "default",
      title: "Carrello resettato",
      description: "Puoi configurare un nuovo carrello",
    });
  };

  const handleAddPackage = (pkg: { variety: string; length: number; quantity: number }) => {
    const newTotal = currentTotal + pkg.quantity;
    
    if (newTotal > maxPackages) {
      toast({
        title: "Limite superato",
        description: `Il carrello può contenere massimo ${maxPackages} pacchi. Spazio rimanente: ${maxPackages - currentTotal}`,
        variant: "destructive",
      });
      return;
    }

    addPackageMutation.mutate(pkg);
  };

  const handleEditPackage = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedPkg: PackageItem) => {
    const oldPackage = packages.find(p => p.id === updatedPkg.id);
    if (!oldPackage) return;

    const quantityDiff = updatedPkg.quantity - oldPackage.quantity;
    const newTotal = currentTotal + quantityDiff;

    if (newTotal > maxPackages) {
      toast({
        title: "Limite superato",
        description: `Il carrello può contenere massimo ${maxPackages} pacchi`,
        variant: "destructive",
      });
      return;
    }

    updatePackageMutation.mutate(updatedPkg);
  };

  const handleDeletePackage = (id: string) => {
    deletePackageMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl space-y-4 md:space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold">Gestione Carrelli</h1>
            <p className="text-sm md:text-base text-muted-foreground">Sistema di tracciamento pacchi fiori</p>
          </div>
          
          <div className="flex items-center gap-2">
            {cartStarted && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleResetCart}
                className="flex-shrink-0 h-12 md:h-11"
                data-testid="button-back-to-setup"
              >
                <ChevronLeft className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Modifica</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation("/carrelli-completati")}
              className="relative flex-shrink-0 h-12 w-12 md:h-11 md:w-11"
              aria-label="Vedi carrelli completati"
              data-testid="button-view-completed-carts"
            >
              <ShoppingCart className="h-5 w-5" />
              {completedCarts.length > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs font-bold"
                >
                  {completedCarts.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {!cartStarted ? (
          <CartSetup onStartCart={handleStartCart} />
        ) : currentCart ? (
          <>
            <LiveCounter
              current={currentTotal}
              total={maxPackages}
              cartNumber={currentCart.cartNumber}
              destination={currentCart.destination}
              tag={currentCart.tag}
              bucketType={currentCart.bucketType}
            />

            <AddPackageForm
              onAddPackage={handleAddPackage}
              disabled={currentTotal >= maxPackages}
            />

            <PackageList
              packages={packages.map(p => ({
                id: p.id,
                variety: p.variety,
                length: p.length,
                quantity: p.quantity,
              }))}
              onEdit={handleEditPackage}
              onDelete={handleDeletePackage}
            />
          </>
        ) : null}

        <EditPackageDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          package={editingPackage}
          onSave={handleSaveEdit}
        />

        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent className="max-w-[95vw] md:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Conferma Reset</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Hai {packages.length} {packages.length === 1 ? 'pacco' : 'pacchi'} nel carrello corrente.
                Tornare alla configurazione cancellerà tutti i pacchi non salvati. Sei sicuro?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="h-12 md:h-11 text-base md:text-sm">
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmReset}
                className="h-12 md:h-11 text-base md:text-sm"
                data-testid="button-confirm-reset"
              >
                Sì, Resetta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
