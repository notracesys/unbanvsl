
"use client";

import { useState } from "react";
import { smartTutorRecommendations } from "@/ai/flows/smart-tutor-recommendations-flow";
import { generateAutomaticFolderSummary } from "@/ai/flows/automatic-folder-summary-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Loader2, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function AITools() {
  const [tutorInput, setTutorInput] = useState("");
  const [tutorResult, setTutorResult] = useState<any>(null);
  const [tutorLoading, setTutorLoading] = useState(false);

  const [summaryInput, setSummaryInput] = useState("");
  const [summaryResult, setSummaryResult] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleSmartTutor = async () => {
    setTutorLoading(true);
    try {
      const driveStructure = "ENEM/Linguagens, ENEM/Matemática/Geometria, ENEM/Matemática/Álgebra, ENEM/Ciências Humanas/História, ENEM/Ciências da Natureza/Física, ENEM/Redação";
      const result = await smartTutorRecommendations({
        simuladoResults: tutorInput,
        driveStructure
      });
      setTutorResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    try {
      const result = await generateAutomaticFolderSummary({ folderTitle: summaryInput });
      setSummaryResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Sua Aprovação com Inteligência Artificial</h2>
          <p className="text-muted-foreground">Experimente nossas ferramentas exclusivas que acompanham o Drive.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Smart Tutor */}
          <GlassCard className="border-2 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Smart Tutor AI</h3>
                <p className="text-sm text-muted-foreground">Análise personalizada de desempenho</p>
              </div>
            </div>
            
            <p className="mb-4 text-sm font-medium">Descreva seus resultados no último simulado:</p>
            <Textarea 
              placeholder="Ex: Acertei 30 em matemática mas errei quase tudo de geometria. Fui bem em humanas..." 
              className="mb-4 min-h-[120px]"
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
            />
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleSmartTutor}
              disabled={tutorLoading || !tutorInput}
            >
              {tutorLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Analisar meu desempenho
            </Button>

            {tutorResult && (
              <div className="mt-6 p-4 bg-white/50 rounded-xl border animate-in fade-in duration-500">
                <h4 className="font-bold mb-2">Pastas recomendadas:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorResult.recommendedFolders.map((f: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">&quot;{tutorResult.explanation}&quot;</p>
              </div>
            )}
          </GlassCard>

          {/* Summary Generator */}
          <GlassCard className="border-2 border-accent/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Resumo Instantâneo</h3>
                <p className="text-sm text-muted-foreground">Saiba o que esperar de cada pasta</p>
              </div>
            </div>
            
            <p className="mb-4 text-sm font-medium">Digite o título de uma matéria ou pasta:</p>
            <Input 
              placeholder="Ex: Geometria Analítica para o ENEM" 
              className="mb-4"
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
            />
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90" 
              onClick={handleSummary}
              disabled={summaryLoading || !summaryInput}
            >
              {summaryLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Resumo da Pasta
            </Button>

            {summaryResult && (
              <div className="mt-6 p-6 bg-accent/5 rounded-xl border border-accent/20 animate-in fade-in duration-500">
                <h4 className="font-bold mb-2 text-accent">Preview do Conteúdo:</h4>
                <p className="text-sm leading-relaxed">&quot;{summaryResult.summary}&quot;</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
