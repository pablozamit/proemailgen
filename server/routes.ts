import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { emailGenerationSchema, insertClientSchema, insertProductSchema, insertCopywriterSchema } from "@shared/schema";
import { generateEmail, aiManager } from "./services/ai-providers";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get available AI providers
  app.get("/api/ai-providers", (req, res) => {
    try {
      const providers = aiManager.getAvailableProviders();
      res.json({ providers });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedores de IA" });
    }
  });
  
  app.post("/api/generate-email", async (req, res) => {
    try {
      const validatedData = emailGenerationSchema.parse(req.body);
      const provider = validatedData.aiProvider || "gemini";
      const emailResponse = await generateEmail(validatedData, provider);
      res.json(emailResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Datos de entrada inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Email generation error:", error);
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Error interno del servidor" 
        });
      }
    }
  });

  // Clients routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener clientes" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cliente" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al crear cliente" });
      }
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al actualizar cliente" });
      }
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteClient(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar cliente" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  });

  app.get("/api/clients/:clientId/products", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const products = await storage.getProductsByClient(clientId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos del cliente" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al crear producto" });
      }
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al actualizar producto" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  });

  // Copywriters routes
  app.get("/api/copywriters", async (req, res) => {
    try {
      const copywriters = await storage.getCopywriters();
      res.json(copywriters);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener copywriters" });
    }
  });

  app.get("/api/copywriters/active", async (req, res) => {
    try {
      const copywriters = await storage.getActiveCopywriters();
      res.json(copywriters);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener copywriters activos" });
    }
  });

  app.post("/api/copywriters", async (req, res) => {
    try {
      const validatedData = insertCopywriterSchema.parse(req.body);
      const copywriter = await storage.createCopywriter(validatedData);
      res.status(201).json(copywriter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al crear copywriter" });
      }
    }
  });

  app.put("/api/copywriters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCopywriterSchema.partial().parse(req.body);
      const copywriter = await storage.updateCopywriter(id, validatedData);
      res.json(copywriter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error al actualizar copywriter" });
      }
    }
  });

  app.delete("/api/copywriters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCopywriter(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar copywriter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
