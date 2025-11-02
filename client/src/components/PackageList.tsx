import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package as PackageIcon } from "lucide-react";
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
      <CardHeader>
        <CardTitle>Lista Pacchi</CardTitle>
        <CardDescription>{packages.length} {packages.length === 1 ? 'pacco' : 'pacchi'} nel carrello</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Varietà</TableHead>
                <TableHead>Lunghezza</TableHead>
                <TableHead className="text-right">Quantità</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} data-testid={`row-package-${pkg.id}`}>
                  <TableCell className="font-medium" data-testid={`text-variety-${pkg.id}`}>
                    {pkg.variety}
                  </TableCell>
                  <TableCell data-testid={`text-length-${pkg.id}`}>
                    <Badge variant="outline">{pkg.length} cm</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums" data-testid={`text-quantity-${pkg.id}`}>
                    {pkg.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} data-testid={`card-package-${pkg.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" data-testid={`text-variety-mobile-${pkg.id}`}>
                      {pkg.variety}
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" data-testid={`text-length-mobile-${pkg.id}`}>
                        {pkg.length} cm
                      </Badge>
                      <Badge data-testid={`text-quantity-mobile-${pkg.id}`}>
                        Qty: {pkg.quantity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(pkg)}
                      data-testid={`button-edit-mobile-${pkg.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(pkg.id)}
                      data-testid={`button-delete-mobile-${pkg.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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
