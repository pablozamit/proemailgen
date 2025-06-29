import { useState } from "react";
import { Eye, Copy, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { EmailResponse } from "@shared/schema";

interface EmailPreviewProps {
  generatedEmail: EmailResponse | null;
  isGenerating: boolean;
}

export default function EmailPreview({ generatedEmail, isGenerating }: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!generatedEmail) return;

    const emailContent = `Asunto: ${generatedEmail.subject}

${generatedEmail.preheader ? `Preencabezado: ${generatedEmail.preheader}\n\n` : ''}${generatedEmail.body}`;

    try {
      await navigator.clipboard.writeText(emailContent);
      setCopied(true);
      toast({
        title: "✅ Copiado al portapapeles",
        description: "El email ha sido copiado exitosamente.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el email al portapapeles.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl border border-gray-200 animate-slide-up">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gold bg-opacity-20 rounded-lg flex items-center justify-center">
              <Eye className="text-gold h-5 w-5" />
            </div>
            <h3 className="text-2xl font-semibold text-navy">Vista Previa</h3>
          </div>
          <Button 
            onClick={copyToClipboard}
            disabled={!generatedEmail || isGenerating}
            variant="outline"
            className="text-gold hover:text-navy transition-colors duration-200 border-gold hover:border-navy"
          >
            {copied ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </div>

        {/* Email Preview Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          
          {/* Email Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="space-y-3">
              {/* Subject Line */}
              <div>
                <label className="block text-xs font-medium text-warm-gray uppercase tracking-wide mb-1">Asunto</label>
                {isGenerating ? (
                  <Skeleton className="h-6 w-3/4" />
                ) : generatedEmail ? (
                  <p className="text-lg font-semibold text-navy">{generatedEmail.subject}</p>
                ) : (
                  <p className="text-lg font-semibold text-gray-400">Asunto del email aparecerá aquí</p>
                )}
              </div>
              
              {/* Preheader */}
              {(generatedEmail?.preheader || isGenerating) && (
                <div>
                  <label className="block text-xs font-medium text-warm-gray uppercase tracking-wide mb-1">Preencabezado</label>
                  {isGenerating ? (
                    <Skeleton className="h-4 w-2/3" />
                  ) : (
                    <p className="text-sm text-charcoal">{generatedEmail?.preheader}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6 bg-white">
            {isGenerating ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : generatedEmail ? (
              <div 
                className="prose prose-lg max-w-none text-charcoal leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedEmail.body }}
              />
            ) : (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">El email generado aparecerá aquí</p>
                <p className="text-gray-400 text-sm mt-2">
                  Completa el formulario y haz clic en "Generar" para ver tu email profesional
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-navy" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H7a1 1 0 00-1 1v6a1 1 0 01-1 1H2a1 1 0 110-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            {isGenerating ? (
              <Skeleton className="h-6 w-12 mx-auto mb-1" />
            ) : (
              <div className="text-2xl font-bold text-navy">{generatedEmail?.wordCount || 0}</div>
            )}
            <div className="text-sm text-warm-gray">Palabras</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            {isGenerating ? (
              <Skeleton className="h-6 w-16 mx-auto mb-1" />
            ) : (
              <div className="text-2xl font-bold text-gold">{generatedEmail?.readingTime || "0 min"}</div>
            )}
            <div className="text-sm text-warm-gray">Lectura</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            {isGenerating ? (
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{generatedEmail?.conversionScore || 0}</div>
            )}
            <div className="text-sm text-warm-gray">Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
