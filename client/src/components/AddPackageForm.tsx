import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VARIETIES, STEM_LENGTHS } from "@shared/schema";
import { Plus } from "lucide-react";

interface AddPackageFormProps {
  onAddPackage: (pkg: { variety: string; length: number; quantity: number }) => void;
  disabled?: boolean;
}

export default function AddPackageForm({ onAddPackage, disabled }: AddPackageFormProps) {
  const [variety, setVariety] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (variety && length && quantity && parseInt(quantity) > 0) {
      onAddPackage({
        variety,
        length: parseInt(length),
        quantity: parseInt(quantity),
      });
      
      setQuantity("");
    }
  };

  const isValid = variety && length && quantity && parseInt(quantity) > 0;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-xl">Aggiungi Pacco</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variety" className="text-base md:text-sm" data-testid="label-variety">Varietà *</Label>
              <Select value={variety} onValueChange={setVariety} disabled={disabled}>
                <SelectTrigger id="variety" className="h-12 md:h-11 text-base" data-testid="select-variety">
                  <SelectValue placeholder="Seleziona varietà" />
                </SelectTrigger>
                <SelectContent>
                  {VARIETIES.map((v) => (
                    <SelectItem key={v} value={v} className="text-base py-3" data-testid={`option-variety-${v}`}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="length" className="text-base md:text-sm" data-testid="label-length">Lunghezza (cm) *</Label>
                <Select value={length} onValueChange={setLength} disabled={disabled}>
                  <SelectTrigger id="length" className="h-12 md:h-11 text-base" data-testid="select-length">
                    <SelectValue placeholder="cm" />
                  </SelectTrigger>
                  <SelectContent>
                    {STEM_LENGTHS.map((l) => (
                      <SelectItem key={l} value={l.toString()} className="text-base py-3" data-testid={`option-length-${l}`}>
                        {l} cm
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base md:text-sm" data-testid="label-quantity">Quantità *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  disabled={disabled}
                  className="h-12 md:h-11 text-base"
                  data-testid="input-quantity"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid || disabled}
            className="w-full h-12 md:h-11 text-base md:text-sm"
            size="lg"
            data-testid="button-add-package"
          >
            <Plus className="mr-2 h-5 w-5" />
            Aggiungi Pacco
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
