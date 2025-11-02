import { useState } from "react";
import CartSetup from "@/components/CartSetup";
import LiveCounter from "@/components/LiveCounter";
import AddPackageForm from "@/components/AddPackageForm";
import PackageList, { type PackageItem } from "@/components/PackageList";
import EditPackageDialog from "@/components/EditPackageDialog";
import CompletedCarts, { type CompletedCart } from "@/components/CompletedCarts";
import ExportButton from "@/components/ExportButton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Settings, ChevronLeft } from "lucide-react";
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

interface CartSetupData {
  destination: string;
  tag: string;
  bucketType: string;
}

export default function Home() {
  const { toast } = useToast();
  
  const [cartStarted, setCartStarted] = useState(false);
  const [currentCart, setCurrentCart] = useState<CartSetupData | null>(null);
  const [currentCartNumber, setCurrentCartNumber] = useState(1);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [completedCarts, setCompletedCarts] = useState<CompletedCart[]>([]);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const currentTotal = packages.reduce((sum, pkg) => sum + pkg.quantity, 0);
  const maxPackages = 72;

  const handleStartCart = (setup: CartSetupData) => {
    setCurrentCart(setup);
    setCartStarted(true);
    toast({
      title: "Carrello avviato",
      description: `Carrello ${currentCartNumber} pronto per l'aggiunta di pacchi`,
    });
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
    setCurrentCart(null);
    setPackages([]);
    setShowResetDialog(false);
    toast({
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

    const newPackage: PackageItem = {
      id: Date.now().toString(),
      ...pkg,
    };

    const updatedPackages = [...packages, newPackage];
    setPackages(updatedPackages);

    toast({
      title: "Pacco aggiunto",
      description: `${pkg.variety} - ${pkg.length}cm (Qty: ${pkg.quantity})`,
    });

    if (newTotal === maxPackages) {
      setTimeout(() => {
        completeCart(updatedPackages);
      }, 500);
    }
  };

  const completeCart = (finalPackages: PackageItem[]) => {
    if (!currentCart) return;

    const completedCart: CompletedCart = {
      id: Date.now().toString(),
      cartNumber: currentCartNumber,
      destination: currentCart.destination,
      tag: currentCart.tag,
      bucketType: currentCart.bucketType,
      totalPackages: finalPackages.reduce((sum, pkg) => sum + pkg.quantity, 0),
      packages: finalPackages,
      completedAt: new Date(),
    };

    setCompletedCarts([...completedCarts, completedCart]);
    setPackages([]);
    setCurrentCartNumber(currentCartNumber + 1);
    
    toast({
      title: `Carrello ${currentCartNumber} completato! ✓`,
      description: `Automaticamente avviato Carrello ${currentCartNumber + 1}`,
    });
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

    setPackages(packages.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    setShowEditDialog(false);
    
    toast({
      title: "Pacco aggiornato",
      description: `${updatedPkg.variety} - ${updatedPkg.length}cm (Qty: ${updatedPkg.quantity})`,
    });
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    toast({
      title: "Pacco eliminato",
      description: "Il pacco è stato rimosso dal carrello",
    });
  };

  const handleExport = async () => {
    console.log('Exporting all carts...', completedCarts);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Esportazione completata",
      description: `${completedCarts.length} carrelli esportati con successo`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl space-y-4 md:space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold">Gestione Carrelli</h1>
            <p className="text-sm md:text-base text-muted-foreground">Sistema di tracciamento pacchi fiori</p>
          </div>
          
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
        </div>

        {!cartStarted ? (
          <CartSetup onStartCart={handleStartCart} />
        ) : (
          <>
            <LiveCounter
              current={currentTotal}
              total={maxPackages}
              cartNumber={currentCartNumber}
              destination={currentCart?.destination}
              tag={currentCart?.tag}
              bucketType={currentCart?.bucketType}
            />

            <AddPackageForm
              onAddPackage={handleAddPackage}
              disabled={currentTotal >= maxPackages}
            />

            <PackageList
              packages={packages}
              onEdit={handleEditPackage}
              onDelete={handleDeletePackage}
            />
          </>
        )}

        {completedCarts.length > 0 && (
          <CompletedCarts carts={completedCarts} />
        )}

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

        <ExportButton
          cartCount={completedCarts.length}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
