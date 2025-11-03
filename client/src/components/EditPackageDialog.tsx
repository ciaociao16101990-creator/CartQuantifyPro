import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VARIETIES, STEM_LENGTHS } from "@shared/schema";
import type { PackageItem } from "./PackageList";

interface EditPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: PackageItem | null;
  onSave: (pkg: PackageItem) => void;
}

export default function EditPackageDialog({ open, onOpenChange, package: pkg, onSave }: EditPackageDialogProps) {
  const [variety, setVariety] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (pkg) {
      setVariety(pkg.variety);
      setLength(pkg.length.toString());
      setQuantity(pkg.quantity.toString());
    }
  }, [pkg]);

  const handleSave = () => {
    if (pkg && variety && length && quantity && parseInt(quantity) > 0) {
      onSave({
        ...pkg,
        variety,
        length: parseInt(length),
        quantity: parseInt(quantity),
      });
      onOpenChange(false);
    }
  };

  const isValid = variety && length && quantity && parseInt(quantity) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed bottom-0 left-0 right-0 max-w-full rounded-t-xl rounded-b-none border-t border-x-0 border-b-0 p-4 translate-y-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4 sm:rounded-xl sm:border" 
        data-testid="dialog-edit-package"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Modifica Pacco</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="edit-variety" className="text-sm">Varietà</Label>
            <Select value={variety} onValueChange={setVariety}>
              <SelectTrigger id="edit-variety" className="h-11 text-base" data-testid="select-edit-variety">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VARIETIES.map((v) => (
                  <SelectItem key={v} value={v} className="text-base py-2">
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-length" className="text-sm">Lunghezza (cm)</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger id="edit-length" className="h-11 text-base" data-testid="select-edit-length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEM_LENGTHS.map((l) => (
                  <SelectItem key={l} value={l.toString()} className="text-base py-2">
                    {l} cm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-quantity" className="text-sm">Quantità</Label>
            <Input
              id="edit-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 text-base"
              data-testid="input-edit-quantity"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-11 text-base flex-1"
            data-testid="button-cancel-edit"
          >
            Annulla
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isValid} 
            className="h-11 text-base flex-1"
            data-testid="button-save-edit"
          >
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
