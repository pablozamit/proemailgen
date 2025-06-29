import { 
  users, clients, products, copywriters,
  type User, type InsertUser,
  type Client, type InsertClient,
  type Product, type InsertProduct,
  type Copywriter, type InsertCopywriter
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByClient(clientId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Copywriters
  getCopywriters(): Promise<Copywriter[]>;
  getActiveCopywriters(): Promise<Copywriter[]>;
  getCopywriter(id: number): Promise<Copywriter | undefined>;
  createCopywriter(copywriter: InsertCopywriter): Promise<Copywriter>;
  updateCopywriter(id: number, copywriter: Partial<InsertCopywriter>): Promise<Copywriter>;
  deleteCopywriter(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async updateClient(id: number, updateData: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set(updateData)
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByClient(clientId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.clientId, clientId));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Copywriters
  async getCopywriters(): Promise<Copywriter[]> {
    return await db.select().from(copywriters);
  }

  async getActiveCopywriters(): Promise<Copywriter[]> {
    return await db.select().from(copywriters).where(eq(copywriters.isActive, true));
  }

  async getCopywriter(id: number): Promise<Copywriter | undefined> {
    const [copywriter] = await db.select().from(copywriters).where(eq(copywriters.id, id));
    return copywriter || undefined;
  }

  async createCopywriter(insertCopywriter: InsertCopywriter): Promise<Copywriter> {
    const [copywriter] = await db
      .insert(copywriters)
      .values(insertCopywriter)
      .returning();
    return copywriter;
  }

  async updateCopywriter(id: number, updateData: Partial<InsertCopywriter>): Promise<Copywriter> {
    const [copywriter] = await db
      .update(copywriters)
      .set(updateData)
      .where(eq(copywriters.id, id))
      .returning();
    return copywriter;
  }

  async deleteCopywriter(id: number): Promise<void> {
    await db.delete(copywriters).where(eq(copywriters.id, id));
  }
}

export const storage = new DatabaseStorage();
