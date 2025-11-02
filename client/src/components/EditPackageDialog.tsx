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
      <DialogContent data-testid="dialog-edit-package">
        <DialogHeader>
          <DialogTitle>Modifica Pacco</DialogTitle>
          <DialogDescription>Aggiorna i dettagli del pacco</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-variety">Varietà</Label>
            <Select value={variety} onValueChange={setVariety}>
              <SelectTrigger id="edit-variety" data-testid="select-edit-variety">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VARIETIES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-length">Lunghezza (cm)</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger id="edit-length" data-testid="select-edit-length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEM_LENGTHS.map((l) => (
                  <SelectItem key={l} value={l.toString()}>
                    {l} cm
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-quantity">Quantità</Label>
            <Input
              id="edit-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              data-testid="input-edit-quantity"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit">
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={!isValid} data-testid="button-save-edit">
            Salva Modifiche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
