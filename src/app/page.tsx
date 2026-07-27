import { HeroLP } from "@/components/sections/hero-lp";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Clock, 
  Image as ImageIcon, 
  Music, 
  QrCode, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Gift
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { FloatingHearts } from "@/components/ui/floating-hearts";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <FloatingHearts />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <Heart className="text-white fill-current w-6 h-6" />
            </div>
            <span className="font-serif-elegant font-bold text-2xl tracking-tighter">Love<span className="text-primary">Link</span></span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-6 pink-glow" asChild>
            <Link href="/criar">Começar</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <HeroLP />

        {/* Como Funciona */}
        <section id="como-funciona" className="py-24 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-serif-elegant font-bold mb-4 text-gradient">Como funciona?</h2>
              <p className="text-muted-foreground">Em apenas 3 passos simples você cria seu presente digital.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "1. Preencha os dados", desc: "Conte sua história, adicione a data e nomes do casal." },
                { icon: ImageIcon, title: "2. Personalize", desc: "Escolha um tema e envie suas fotos favoritas." },
                { icon: Gift, title: "3. Surpreenda", desc: "Receba seu link e QR Code para compartilhar com seu amor." }
              ].map((step, i) => (
                <div key={i} className="text-center group bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-serif-elegant font-bold mb-8">Tudo o que o seu amor <span className="text-primary italic">merece</span></h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { icon: Clock, title: "Contador Real", desc: "Tempo exato do amor de vocês." },
                    { icon: ImageIcon, title: "Galeria Premium", desc: "Seus melhores momentos juntos." },
                    { icon: Music, title: "Sua Música", desc: "Link direto do Spotify de vocês." },
                    { icon: QrCode, title: "QR Code Exclusivo", desc: "Perfeito para cartões físicos." }
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                        <feat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">{feat.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
                <img src="https://picsum.photos/seed/phone-mock/400/800" alt="Mockup" className="w-full max-w-sm mx-auto relative rounded-[3rem] border-8 border-white shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Preço */}
        <section className="py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-primary/10">
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Acesso Vitalício</span>
              <h2 className="text-5xl font-serif-elegant font-bold mb-6">Plano Único</h2>
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-2xl text-muted-foreground line-through decoration-primary/30">R$ 57,00</span>
                <span className="text-6xl font-bold text-primary">R$ 27,97</span>
              </div>
              <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
                <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck className="w-5 h-5 text-primary" /> Galeria com 10 fotos</li>
                <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck className="w-5 h-5 text-primary" /> Música personalizada</li>
                <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck className="w-5 h-5 text-primary" /> QR Code para imprimir</li>
                <li className="flex items-center gap-3 text-sm font-medium"><ShieldCheck className="w-5 h-5 text-primary" /> 4 Temas românticos</li>
              </ul>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white py-8 text-xl rounded-full pink-glow transition-transform hover:scale-105" asChild>
                <Link href="/criar">Garantir meu acesso agora</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-serif-elegant font-bold mb-12 text-center">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {[
                { q: "Como eu recebo meu link?", a: "Imediatamente após o pagamento, você verá seu link e QR Code na tela e também receberá por e-mail." },
                { q: "Posso editar depois?", a: "Sim! Você terá uma área exclusiva para alterar fotos, mensagens e temas quando quiser." },
                { q: "O pagamento é seguro?", a: "Sim, processamos tudo via PIX e Cartão de crédito de forma 100% segura e criptografada." },
                { q: "Por quanto tempo a página fica no ar?", a: "No plano único, sua página fica disponível por tempo indeterminado (mínimo de 1 ano garantido)." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border-primary/5 px-6 shadow-sm">
                  <AccordionTrigger className="text-left font-bold py-6 hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-primary/5 bg-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="text-primary fill-current w-6 h-6" />
            <span className="font-serif-elegant font-bold text-2xl">LoveLink</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8">Feito com amor para casais que celebram cada segundo.</p>
          <div className="flex justify-center gap-8 text-xs text-muted-foreground uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
          <p className="mt-12 text-[10px] text-muted-foreground/50">© 2024 LoveLink. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
