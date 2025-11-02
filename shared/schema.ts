import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const carts = pgTable("carts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cartNumber: integer("cart_number").notNull(),
  destination: text("destination").notNull(),
  tag: text("tag").notNull(),
  bucketType: text("bucket_type").notNull(),
  totalPackages: integer("total_packages").notNull().default(0),
  maxPackages: integer("max_packages").notNull().default(72),
  isCompleted: integer("is_completed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cartId: varchar("cart_id").notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variety: text("variety").notNull(),
  length: integer("length").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
});

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export const VARIETIES = [
  "MATTH IRON APRICOT",
  "MATTH IRON PINK",
  "MATTH IRON MARINE",
  "MATTH IRON ROSE",
  "MATTH IRON PURPLE",
  "MATTH GEM",
  "MATTH YELLOW",
  "MATTH WHITE",
] as const;

export const STEM_LENGTHS = [50, 55, 60, 65, 70, 75] as const;

export const DESTINATIONS = [
  "AALSMEER (N.11)",
  "NAALDWIJK (N.10)",
  "RIJNSBURG (N.9)",
] as const;

export const TAGS = [
  "TAG5 (GIALLO)",
  "TAG5 (VERDE)",
] as const;

export const BUCKET_TYPES = [
  "BLACK BUCKETS",
  "PROCONA",
] as const;
