import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { carts, packages, insertCartSchema, insertPackageSchema } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import XLSX from "xlsx";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all carts with their packages
  app.get("/api/carts", async (req, res) => {
    try {
      const allCarts = await db.query.carts.findMany({
        orderBy: [desc(carts.createdAt)],
        with: {
          packages: true,
        },
      });
      
      res.json(allCarts);
    } catch (error) {
      console.error("Error fetching carts:", error);
      res.status(500).json({ error: "Failed to fetch carts" });
    }
  });

  // Get single cart with packages
  app.get("/api/carts/:id", async (req, res) => {
    try {
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, req.params.id),
        with: {
          packages: true,
        },
      });
      
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      res.json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // Create new cart
  app.post("/api/carts", async (req, res) => {
    try {
      const validatedData = insertCartSchema.parse(req.body);
      
      const [newCart] = await db.insert(carts).values(validatedData).returning();
      
      res.status(201).json(newCart);
    } catch (error) {
      console.error("Error creating cart:", error);
      res.status(400).json({ error: "Failed to create cart" });
    }
  });

  // Update cart
  app.patch("/api/carts/:id", async (req, res) => {
    try {
      // Validate update data
      const updateSchema = insertCartSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const [updatedCart] = await db
        .update(carts)
        .set(validatedData)
        .where(eq(carts.id, req.params.id))
        .returning();
      
      if (!updatedCart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      res.json(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(400).json({ error: "Failed to update cart" });
    }
  });

  // Get packages for a cart
  app.get("/api/carts/:cartId/packages", async (req, res) => {
    try {
      const cartPackages = await db.query.packages.findMany({
        where: eq(packages.cartId, req.params.cartId),
        orderBy: [desc(packages.createdAt)],
      });
      
      res.json(cartPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Create package
  app.post("/api/packages", async (req, res) => {
    try {
      const validatedData = insertPackageSchema.parse(req.body);
      
      const [newPackage] = await db.insert(packages).values(validatedData).returning();
      
      // Update cart total
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, validatedData.cartId),
        with: {
          packages: true,
        },
      });
      
      if (cart) {
        const totalPackages = cart.packages.reduce((sum: number, pkg) => sum + pkg.quantity, 0);
        
        // Auto-complete cart if it reaches max packages
        const updateData: any = { totalPackages };
        if (totalPackages >= cart.maxPackages && cart.isCompleted === 0) {
          updateData.isCompleted = 1;
          updateData.completedAt = new Date();
        }
        
        await db
          .update(carts)
          .set(updateData)
          .where(eq(carts.id, validatedData.cartId));
      }
      
      res.status(201).json(newPackage);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(400).json({ error: "Failed to create package" });
    }
  });

  // Update package
  app.patch("/api/packages/:id", async (req, res) => {
    try {
      // Validate update data
      const updateSchema = insertPackageSchema.partial().omit({ cartId: true });
      const validatedData = updateSchema.parse(req.body);
      
      const [updatedPackage] = await db
        .update(packages)
        .set(validatedData)
        .where(eq(packages.id, req.params.id))
        .returning();
      
      if (!updatedPackage) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      // Update cart total
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, updatedPackage.cartId),
        with: {
          packages: true,
        },
      });
      
      if (cart) {
        const totalPackages = cart.packages.reduce((sum: number, pkg) => sum + pkg.quantity, 0);
        
        // Auto-complete cart if it reaches max packages
        const updateData: any = { totalPackages };
        if (totalPackages >= cart.maxPackages && cart.isCompleted === 0) {
          updateData.isCompleted = 1;
          updateData.completedAt = new Date();
        }
        
        await db
          .update(carts)
          .set(updateData)
          .where(eq(carts.id, updatedPackage.cartId));
      }
      
      res.json(updatedPackage);
    } catch (error) {
      console.error("Error updating package:", error);
      res.status(400).json({ error: "Failed to update package" });
    }
  });

  // Delete package
  app.delete("/api/packages/:id", async (req, res) => {
    try {
      const pkg = await db.query.packages.findFirst({
        where: eq(packages.id, req.params.id),
      });
      
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      
      await db.delete(packages).where(eq(packages.id, req.params.id));
      
      // Update cart total
      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, pkg.cartId),
        with: {
          packages: true,
        },
      });
      
      if (cart) {
        const totalPackages = cart.packages.reduce((sum: number, p) => sum + p.quantity, 0);
        await db
          .update(carts)
          .set({ totalPackages })
          .where(eq(carts.id, pkg.cartId));
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ error: "Failed to delete package" });
    }
  });

  // Export all carts to Excel
  app.get("/api/export/excel", async (req, res) => {
    try {
      const allCarts = await db.query.carts.findMany({
        where: eq(carts.isCompleted, 1),
        orderBy: [desc(carts.cartNumber)],
        with: {
          packages: true,
        },
      });
      
      const workbook = XLSX.utils.book_new();
      
      // Create summary sheet
      const summaryData = allCarts.map(cart => ({
        'Carrello': cart.cartNumber,
        'Destinazione': cart.destination,
        'Tag': cart.tag,
        'Bucket Type': cart.bucketType,
        'Totale Pacchi': cart.totalPackages,
        'Data Completamento': cart.completedAt ? new Date(cart.completedAt).toLocaleDateString('it-IT') : '',
      }));
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Riepilogo Carrelli');
      
      // Create detailed sheet
      const detailData: any[] = [];
      allCarts.forEach(cart => {
        cart.packages.forEach(pkg => {
          detailData.push({
            'Carrello': cart.cartNumber,
            'Destinazione': cart.destination,
            'Tag': cart.tag,
            'Bucket Type': cart.bucketType,
            'Varietà': pkg.variety,
            'Lunghezza (cm)': pkg.length,
            'Quantità': pkg.quantity,
          });
        });
      });
      
      const detailSheet = XLSX.utils.json_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Dettaglio Pacchi');
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', `attachment; filename=carrelli_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
