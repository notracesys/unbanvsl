
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { DriveStructure } from "@/components/sections/drive-structure";
import { Comparison } from "@/components/sections/comparison";
import { AITools } from "@/components/sections/ai-tools";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Phone, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header Simple */}
      <header className="fixed top-0 w-full z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">A</div>
            <span className="font-headline font-bold text-xl tracking-tighter">Aprovação<span className="text-primary">Drive</span></span>
          </div>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full font-bold">
            Acesso Agora
          </Button>
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <DriveStructure />
        <AITools />
        <Comparison />
        <Testimonials />
        <FAQ />

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-blue-700 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">Pronto para a sua aprovação?</h2>
                <p className="text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
                  Garanta acesso hoje mesmo a toda essa estrutura de materiais organizada e comece a estudar do jeito certo.
                </p>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-12 py-8 text-xl rounded-2xl shadow-xl transition-transform hover:scale-105">
                  Quero meu acesso agora
                </Button>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/70">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Pagamento Seguro
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Acesso Vitalício
                  </div>
                </div>
                <p className="mt-4 text-xs opacity-50">Acesso liberado logo após a confirmação do pagamento.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">A</div>
                <span className="font-headline font-bold text-xl tracking-tighter">Aprovação<span className="text-primary">Drive</span></span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                O maior acervo de materiais para o ENEM, organizado de forma profissional para facilitar o seu dia a dia.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full"><Mail className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-5 h-5" /></Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-muted-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Direitos Autorais</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-muted-foreground">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Fale Conosco</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Dúvidas</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Como Acessar</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} AprovaçãoDrive. Todos os direitos reservados. Não temos vínculo oficial com o Google ou o INEP.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
