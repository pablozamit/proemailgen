import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, User, PenTool } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Copywriter, InsertCopywriter } from "@shared/schema";

export default function CopywritersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCopywriter, setEditingCopywriter] = useState<Copywriter | null>(null);
  const [formData, setFormData] = useState<Partial<InsertCopywriter>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: copywriters = [], isLoading } = useQuery({
    queryKey: ["/api/copywriters"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/copywriters");
      return response.json() as Promise<Copywriter[]>;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCopywriter) => {
      const response = await apiRequest("POST", "/api/copywriters", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copywriters"] });
      setIsDialogOpen(false);
      setFormData({});
      toast({ title: "Copywriter creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear copywriter", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCopywriter> }) => {
      const response = await apiRequest("PUT", `/api/copywriters/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copywriters"] });
      setIsDialogOpen(false);
      setEditingCopywriter(null);
      setFormData({});
      toast({ title: "Copywriter actualizado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al actualizar copywriter", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/copywriters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/copywriters"] });
      toast({ title: "Copywriter eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar copywriter", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCopywriter) {
      updateMutation.mutate({ id: editingCopywriter.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertCopywriter);
    }
  };

  const openDialog = (copywriter?: Copywriter) => {
    if (copywriter) {
      setEditingCopywriter(copywriter);
      setFormData(copywriter);
    } else {
      setEditingCopywriter(null);
      setFormData({ isActive: true });
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
                <PenTool className="text-gold text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">Gestión de Copywriters</h1>
                <p className="text-sm text-warm-gray">Administra estilos de copywriting</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => openDialog()}
                  className="bg-gradient-to-r from-navy to-charcoal text-white hover:from-charcoal hover:to-navy"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Copywriter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCopywriter ? "Editar Copywriter" : "Nuevo Copywriter"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre del Copywriter</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Dan Kennedy"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="style">Estilo/Clave</Label>
                      <Input
                        id="style"
                        value={formData.style || ""}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        placeholder="Ej: dan-kennedy"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción breve del copywriter y su estilo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="techniques">Técnicas Principales</Label>
                    <Textarea
                      id="techniques"
                      value={formData.techniques || ""}
                      onChange={(e) => setFormData({ ...formData, techniques: e.target.value })}
                      placeholder="Lista las técnicas de copywriting que caracterizan a este autor"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tone">Tono Característico</Label>
                      <Input
                        id="tone"
                        value={formData.tone || ""}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        placeholder="Ej: Directo y agresivo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bestFor">Mejor Para</Label>
                      <Input
                        id="bestFor"
                        value={formData.bestFor || ""}
                        onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                        placeholder="Ej: Ventas directas, productos premium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="approach">Enfoque Principal</Label>
                    <Textarea
                      id="approach"
                      value={formData.approach || ""}
                      onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                      placeholder="Describe el enfoque principal de este copywriter"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="examples">Ejemplos de Uso (Opcional)</Label>
                    <Textarea
                      id="examples"
                      value={formData.examples || ""}
                      onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                      placeholder="Ejemplos de cuándo usar este estilo"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Activo</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingCopywriter ? "Actualizar" : "Crear"}
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
        ) : copywriters.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay copywriters</h3>
              <p className="text-gray-500 mb-4">Comienza agregando tu primer estilo de copywriter</p>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Copywriter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {copywriters.map((copywriter) => (
              <Card key={copywriter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-navy">{copywriter.name}</h3>
                        <Badge variant={copywriter.isActive ? "default" : "secondary"}>
                          {copywriter.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-warm-gray">{copywriter.tone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(copywriter)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(copywriter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Estilo:</strong> {copywriter.style}</p>
                    <p><strong>Mejor para:</strong> {copywriter.bestFor}</p>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      <strong>Descripción:</strong> {copywriter.description}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      <strong>Enfoque:</strong> {copywriter.approach}
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