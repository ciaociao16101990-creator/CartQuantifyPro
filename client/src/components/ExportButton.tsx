import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  onExport: () => Promise<void>;
  disabled?: boolean;
  cartCount: number;
}

export default function ExportButton({ onExport, disabled, cartCount }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-50">
      <Button
        onClick={handleExport}
        disabled={disabled || isExporting || cartCount === 0}
        size="lg"
        className="w-full md:w-auto shadow-lg h-14 md:h-11 text-base md:text-sm"
        data-testid="button-export-all"
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Esportazione...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Esporta Tutto ({cartCount})
          </>
        )}
      </Button>
    </div>
  );
}
