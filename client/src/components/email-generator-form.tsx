import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Settings, Sparkles, Loader2, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { emailGenerationSchema, type EmailGenerationRequest, type EmailResponse } from "@shared/schema";

interface EmailGeneratorFormProps {
  onEmailGenerated: (email: EmailResponse) => void;
  onGeneratingChange: (generating: boolean) => void;
  isGenerating: boolean;
}

export default function EmailGeneratorForm({ 
  onEmailGenerated, 
  onGeneratingChange,
  isGenerating 
}: EmailGeneratorFormProps) {
  const { toast } = useToast();
  
  // Fetch available AI providers
  const { data: providersData } = useQuery({
    queryKey: ["/api/ai-providers"],
    queryFn: async () => {
      const response = await fetch("/api/ai-providers");
      return response.json();
    }
  });
  
  const form = useForm<EmailGenerationRequest>({
    resolver: zodResolver(emailGenerationSchema),
    defaultValues: {
      emailType: "",
      clientTone: "",
      productName: "",
      productDescription: "",
      productLink: "",
      targetAudience: "",
      copywriterProfile: "general",
      elementsToAvoid: "",
      includePreheader: false,
      aiProvider: "gemini",
    },
  });

  const generateEmailMutation = useMutation({
    mutationFn: async (data: EmailGenerationRequest) => {
      const response = await apiRequest("POST", "/api/generate-email", data);
      return response.json() as Promise<EmailResponse>;
    },
    onMutate: () => {
      onGeneratingChange(true);
    },
    onSuccess: (data) => {
      onEmailGenerated(data);
      toast({
        title: "✨ Email generado exitosamente",
        description: "Tu email profesional está listo para usar.",
      });
      onGeneratingChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error al generar email",
        description: error.message || "Hubo un problema al generar el email. Intenta de nuevo.",
        variant: "destructive",
      });
      onGeneratingChange(false);
    },
  });

  const onSubmit = (data: EmailGenerationRequest) => {
    generateEmailMutation.mutate(data);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl border border-gray-200 animate-slide-up">
      <CardContent className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gold bg-opacity-20 rounded-lg flex items-center justify-center">
            <Settings className="text-gold h-5 w-5" />
          </div>
          <h3 className="text-2xl font-semibold text-navy">Configuración del Email</h3>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Tipo de Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Tipo de Email
            </Label>
            <Select onValueChange={(value) => form.setValue("emailType", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white">
                <SelectValue placeholder="Selecciona el tipo de email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promocional">Promocional</SelectItem>
                <SelectItem value="bienvenida">Bienvenida</SelectItem>
                <SelectItem value="abandono-carrito">Abandono de Carrito</SelectItem>
                <SelectItem value="reactivacion">Reactivación</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="lanzamiento">Lanzamiento de Producto</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.emailType && (
              <p className="text-sm text-red-500">{form.formState.errors.emailType.message}</p>
            )}
          </div>

          {/* Tono del Cliente */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clipRule="evenodd" />
              </svg>
              Tono del Mensaje
            </Label>
            <Input 
              {...form.register("clientTone")}
              placeholder="Ej: Profesional pero cercano, innovador, urgente..." 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
            />
            {form.formState.errors.clientTone && (
              <p className="text-sm text-red-500">{form.formState.errors.clientTone.message}</p>
            )}
          </div>

          {/* Información del Producto */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h4 className="font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
              </svg>
              Información del Producto/Servicio
            </h4>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-charcoal">Nombre del Producto</Label>
              <Input 
                {...form.register("productName")}
                placeholder="Título o nombre del producto/servicio" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
              />
              {form.formState.errors.productName && (
                <p className="text-sm text-red-500">{form.formState.errors.productName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-charcoal">Descripción</Label>
              <Textarea 
                {...form.register("productDescription")}
                rows={3} 
                placeholder="Descripción detallada del producto o servicio..." 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 resize-none"
              />
              {form.formState.errors.productDescription && (
                <p className="text-sm text-red-500">{form.formState.errors.productDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-charcoal">Link del Producto</Label>
              <Input 
                {...form.register("productLink")}
                type="url" 
                placeholder="https://ejemplo.com/producto" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
              />
              {form.formState.errors.productLink && (
                <p className="text-sm text-red-500">{form.formState.errors.productLink.message}</p>
              )}
            </div>
          </div>

          {/* Público Objetivo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Público Objetivo
            </Label>
            <Textarea 
              {...form.register("targetAudience")}
              rows={2} 
              placeholder="Describe tu audiencia: edad, intereses, necesidades, etc." 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 resize-none"
            />
            {form.formState.errors.targetAudience && (
              <p className="text-sm text-red-500">{form.formState.errors.targetAudience.message}</p>
            )}
          </div>

          {/* AI Provider Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <Bot className="w-4 h-4 text-gold mr-2" />
              Proveedor de IA
            </Label>
            <Select onValueChange={(value) => form.setValue("aiProvider", value)} defaultValue="gemini">
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white">
                <SelectValue placeholder="Selecciona proveedor de IA" />
              </SelectTrigger>
              <SelectContent>
                {providersData?.providers?.map((provider: any) => (
                  <SelectItem 
                    key={provider.name.toLowerCase()} 
                    value={provider.name.toLowerCase()}
                    disabled={!provider.available}
                  >
                    {provider.name} {!provider.available && "(API Key requerida)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {providersData?.providers && (
              <div className="text-xs text-warm-gray">
                Gemini es más económico, OpenAI puede dar mejores resultados
              </div>
            )}
          </div>

          {/* Perfil de Copywriter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Perfil de Copywriter
            </Label>
            <Select onValueChange={(value) => form.setValue("copywriterProfile", value)}>
              <SelectTrigger className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200 bg-white">
                <SelectValue placeholder="Estilo general" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Estilo general</SelectItem>
                <SelectItem value="dan-kennedy">Dan Kennedy (Directo y agresivo)</SelectItem>
                <SelectItem value="gary-halbert">Gary Halbert (Storytelling emocional)</SelectItem>
                <SelectItem value="david-ogilvy">David Ogilvy (Elegante y persuasivo)</SelectItem>
                <SelectItem value="joe-sugarman">Joe Sugarman (Psicología del consumidor)</SelectItem>
                <SelectItem value="russell-brunson">Russell Brunson (Marketing digital moderno)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Elementos a Evitar */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-charcoal flex items-center">
              <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              Elementos a Evitar (Opcional)
            </Label>
            <Input 
              {...form.register("elementsToAvoid")}
              placeholder="Ej: Jerga técnica, tono agresivo, ofertas falsas..." 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Opciones Adicionales */}
          <div className="bg-navy bg-opacity-5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="includePreheader"
                checked={form.watch("includePreheader")}
                onCheckedChange={(checked) => form.setValue("includePreheader", !!checked)}
                className="w-5 h-5 text-gold rounded focus:ring-gold focus:ring-2"
              />
              <Label htmlFor="includePreheader" className="text-sm font-medium text-charcoal flex items-center">
                <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Incluir Preencabezado
              </Label>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            type="submit" 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-navy to-charcoal text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-charcoal hover:to-navy transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Generando Email...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-5 w-5" />
                Generar Email Profesional
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
