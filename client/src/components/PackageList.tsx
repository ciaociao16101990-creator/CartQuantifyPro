import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package as PackageIcon, Flower2, Ruler } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface PackageItem {
  id: string;
  variety: string;
  length: number;
  quantity: number;
}

interface PackageListProps {
  packages: PackageItem[];
  onEdit: (pkg: PackageItem) => void;
  onDelete: (id: string) => void;
}

export default function PackageList({ packages, onEdit, onDelete }: PackageListProps) {
  if (packages.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lista Pacchi</CardTitle>
          <CardDescription>Nessun pacco aggiunto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <PackageIcon className="h-12 w-12 mb-3 opacity-20" />
            <p>Aggiungi il primo pacco per iniziare</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <PackageIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Lista Pacchi</CardTitle>
              <CardDescription className="text-xs">
                {packages.length} {packages.length === 1 ? 'pacco' : 'pacchi'} nel carrello
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-20 md:pb-6">
        <div className="hidden md:block">
          <div className="space-y-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                data-testid={`row-package-${pkg.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover-elevate transition-all"
              >
                <div className="h-12 w-12 rounded-md bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Flower2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base mb-1" data-testid={`text-variety-${pkg.id}`}>
                    {pkg.variety}
                  </h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler className="h-3.5 w-3.5" />
                    <span className="text-sm" data-testid={`text-length-${pkg.id}`}>
                      {pkg.length} cm
                    </span>
                  </div>
                </div>
                <Badge 
                  className="h-8 px-4 text-base font-semibold tabular-nums bg-primary text-primary-foreground"
                  data-testid={`text-quantity-${pkg.id}`}
                >
                  {pkg.quantity}
                </Badge>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(pkg)}
                    data-testid={`button-edit-${pkg.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(pkg.id)}
                    data-testid={`button-delete-${pkg.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} data-testid={`card-package-${pkg.id}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Flower2 className="h-7 w-7 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-2 text-base" data-testid={`text-variety-mobile-${pkg.id}`}>
                      {pkg.variety}
                    </h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                        <span className="text-sm" data-testid={`text-length-mobile-${pkg.id}`}>
                          {pkg.length} cm
                        </span>
                      </div>
                      <Badge 
                        className="h-7 px-3 text-sm font-semibold tabular-nums bg-primary text-primary-foreground"
                        data-testid={`text-quantity-mobile-${pkg.id}`}
                      >
                        Qty: {pkg.quantity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-11 w-11"
                      onClick={() => onEdit(pkg)}
                      data-testid={`button-edit-mobile-${pkg.id}`}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-11 w-11"
                      onClick={() => onDelete(pkg.id)}
                      data-testid={`button-delete-mobile-${pkg.id}`}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
