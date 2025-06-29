import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Users, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Client, InsertClient } from "@shared/schema";

export default function ClientsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<InsertClient>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["/api/clients"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/clients");
      return response.json() as Promise<Client[]>;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Cliente creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear cliente", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertClient> }) => {
      const response = await apiRequest("PUT", `/api/clients/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData({});
      toast({ title: "Cliente actualizado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al actualizar cliente", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Cliente eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar cliente", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertClient);
    }
  };

  const openDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({});
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-navy to-charcoal rounded-lg flex items-center justify-center">
                <Users className="text-gold text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">Gestión de Clientes</h1>
                <p className="text-sm text-warm-gray">Administra perfiles de clientes</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => openDialog()}
                  className="bg-gradient-to-r from-navy to-charcoal text-white hover:from-charcoal hover:to-navy"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre del Cliente</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industria</Label>
                      <Input
                        id="industry"
                        value={formData.industry || ""}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                    <Textarea
                      id="targetAudience"
                      value={formData.targetAudience || ""}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="brandVoice">Voz de Marca</Label>
                    <Textarea
                      id="brandVoice"
                      value={formData.brandVoice || ""}
                      onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="communicationStyle">Estilo de Comunicación</Label>
                    <Input
                      id="communicationStyle"
                      value={formData.communicationStyle || ""}
                      onChange={(e) => setFormData({ ...formData, communicationStyle: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="keyValues">Valores Clave</Label>
                    <Textarea
                      id="keyValues"
                      value={formData.keyValues || ""}
                      onChange={(e) => setFormData({ ...formData, keyValues: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="painPoints">Puntos de Dolor</Label>
                    <Textarea
                      id="painPoints"
                      value={formData.painPoints || ""}
                      onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ""}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingClient ? "Actualizar" : "Crear"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : clients.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
              <p className="text-gray-500 mb-4">Comienza agregando tu primer cliente</p>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-navy">{client.name}</h3>
                      <p className="text-sm text-warm-gray">{client.company}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Industria:</strong> {client.industry}</p>
                    <p><strong>Email:</strong> {client.email}</p>
                    <p><strong>Estilo:</strong> {client.communicationStyle}</p>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      <strong>Audiencia:</strong> {client.targetAudience}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}