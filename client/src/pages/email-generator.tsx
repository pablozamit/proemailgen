import { useState } from "react";
import { Pen, Sparkles, Users, Package, PenTool, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import EmailGeneratorForm from "@/components/email-generator-form";
import EmailPreview from "@/components/email-preview";
import type { EmailResponse } from "@shared/schema";

export default function EmailGenerator() {
  const [generatedEmail, setGeneratedEmail] = useState<EmailResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEmailGenerated = (email: EmailResponse) => {
    setGeneratedEmail(email);
  };

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-navy to-charcoal rounded-lg flex items-center justify-center">
                <Pen className="text-gold text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">CopyMaster Pro</h1>
                <p className="text-sm text-warm-gray">Generador de Emails Profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-1">
                <Link href="/">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-warm-gray hover:text-navy hover:bg-gray-100 transition-colors">
                    <Home className="h-4 w-4" />
                    <span>Generador</span>
                  </button>
                </Link>
                <button 
                  onClick={() => alert("Panel de clientes próximamente")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-warm-gray hover:text-navy hover:bg-gray-100 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Clientes</span>
                </button>
                <button 
                  onClick={() => alert("Panel de productos próximamente")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-warm-gray hover:text-navy hover:bg-gray-100 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Productos</span>
                </button>
                <button 
                  onClick={() => alert("Panel de copywriters próximamente")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-warm-gray hover:text-navy hover:bg-gray-100 transition-colors"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Copywriters</span>
                </button>
              </nav>
              <div className="flex items-center space-x-2 text-sm text-warm-gray border-l border-gray-300 pl-4">
                <Sparkles className="text-gold h-4 w-4" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Crea Emails que <span className="text-gold">Convierten</span>
          </h2>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
            Genera emails persuasivos con técnicas de copywriting profesional. 
            Personaliza tono, estilo y mensaje para maximizar conversiones.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <EmailGeneratorForm 
            onEmailGenerated={handleEmailGenerated}
            onGeneratingChange={handleGeneratingChange}
            isGenerating={isGenerating}
          />
          <EmailPreview 
            generatedEmail={generatedEmail}
            isGenerating={isGenerating}
          />
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">IA Avanzada</h3>
            <p className="text-warm-gray">Algoritmos entrenados con miles de emails exitosos</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-navy to-charcoal rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Personalización Total</h3>
            <p className="text-warm-gray">Adaptación perfecta a tu audiencia y objetivos</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">Máxima Conversión</h3>
            <p className="text-warm-gray">Técnicas probadas de copywriting profesional</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <Pen className="text-navy h-5 w-5" />
              </div>
              <span className="text-xl font-bold">CopyMaster Pro</span>
            </div>
            <p className="text-gray-300">Genera emails que convierten con inteligencia artificial</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
