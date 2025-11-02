import { type Cart, type InsertCart, type Package, type InsertPackage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCart(id: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  updateCart(id: string, updates: Partial<Cart>): Promise<Cart>;
  getAllCarts(): Promise<Cart[]>;
  
  getPackage(id: string): Promise<Package | undefined>;
  getPackagesByCartId(cartId: string): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<Package>): Promise<Package>;
  deletePackage(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private carts: Map<string, Cart>;
  private packages: Map<string, Package>;

  constructor() {
    this.carts = new Map();
    this.packages = new Map();
  }

  async getCart(id: string): Promise<Cart | undefined> {
    return this.carts.get(id);
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = randomUUID();
    const cart: Cart = {
      id,
      cartNumber: insertCart.cartNumber,
      destination: insertCart.destination,
      tag: insertCart.tag,
      bucketType: insertCart.bucketType,
      totalPackages: insertCart.totalPackages ?? 0,
      maxPackages: insertCart.maxPackages ?? 72,
      isCompleted: insertCart.isCompleted ?? 0,
      createdAt: new Date(),
      completedAt: null,
    };
    this.carts.set(id, cart);
    return cart;
  }

  async updateCart(id: string, updates: Partial<Cart>): Promise<Cart> {
    const cart = this.carts.get(id);
    if (!cart) throw new Error("Cart not found");
    
    const updatedCart = { ...cart, ...updates };
    this.carts.set(id, updatedCart);
    return updatedCart;
  }

  async getAllCarts(): Promise<Cart[]> {
    return Array.from(this.carts.values());
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getPackagesByCartId(cartId: string): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      (pkg) => pkg.cartId === cartId
    );
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const pkg: Package = {
      ...insertPackage,
      id,
      createdAt: new Date(),
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    const pkg = this.packages.get(id);
    if (!pkg) throw new Error("Package not found");
    
    const updatedPackage = { ...pkg, ...updates };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: string): Promise<void> {
    this.packages.delete(id);
  }
}

export const storage = new MemStorage();
