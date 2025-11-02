import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DESTINATIONS, TAGS, BUCKET_TYPES } from "@shared/schema";
import { PackagePlus } from "lucide-react";

interface CartSetupProps {
  onStartCart: (setup: {
    destination: string;
    tag: string;
    bucketType: string;
  }) => void;
}

export default function CartSetup({ onStartCart }: CartSetupProps) {
  const [destination, setDestination] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [bucketTypeMode, setBucketTypeMode] = useState<"preset" | "custom">("preset");
  const [bucketType, setBucketType] = useState<string>("");
  const [customBucketType, setCustomBucketType] = useState<string>("");

  const handleStartCart = () => {
    const finalBucketType = bucketTypeMode === "preset" ? bucketType : customBucketType;
    
    if (destination && tag && finalBucketType) {
      onStartCart({
        destination,
        tag,
        bucketType: finalBucketType,
      });
    }
  };

  const isValid = destination && tag && (bucketTypeMode === "preset" ? bucketType : customBucketType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Nuovo Carrello</CardTitle>
        <CardDescription>Configura i dettagli del carrello (72 pacchi predefinito)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destination" data-testid="label-destination">Destinazione *</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination" data-testid="select-destination">
                <SelectValue placeholder="Seleziona destinazione" />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((dest) => (
                  <SelectItem key={dest} value={dest} data-testid={`option-destination-${dest}`}>
                    {dest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag" data-testid="label-tag">Tag *</Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger id="tag" data-testid="select-tag">
                <SelectValue placeholder="Seleziona tag" />
              </SelectTrigger>
              <SelectContent>
                {TAGS.map((t) => (
                  <SelectItem key={t} value={t} data-testid={`option-tag-${t}`}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label data-testid="label-bucket-type">Tipo Bucket *</Label>
          <RadioGroup value={bucketTypeMode} onValueChange={(v) => setBucketTypeMode(v as "preset" | "custom")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preset" id="preset" data-testid="radio-preset" />
              <Label htmlFor="preset" className="font-normal">Tipo predefinito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" data-testid="radio-custom" />
              <Label htmlFor="custom" className="font-normal">Tipo personalizzato</Label>
            </div>
          </RadioGroup>

          {bucketTypeMode === "preset" ? (
            <Select value={bucketType} onValueChange={setBucketType}>
              <SelectTrigger data-testid="select-bucket-type">
                <SelectValue placeholder="Seleziona tipo bucket" />
              </SelectTrigger>
              <SelectContent>
                {BUCKET_TYPES.map((type) => (
                  <SelectItem key={type} value={type} data-testid={`option-bucket-${type}`}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={customBucketType}
              onChange={(e) => setCustomBucketType(e.target.value)}
              placeholder="Inserisci tipo bucket personalizzato"
              data-testid="input-custom-bucket"
            />
          )}
        </div>

        <Button
          onClick={handleStartCart}
          disabled={!isValid}
          className="w-full"
          size="lg"
          data-testid="button-start-cart"
        >
          <PackagePlus className="mr-2 h-5 w-5" />
          Avvia Carrello
        </Button>
      </CardContent>
    </Card>
  );
}
