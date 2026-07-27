import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroLP() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 text-primary mb-8 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">O presente viral do TikTok</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-serif-elegant font-bold mb-8 leading-tight max-w-4xl mx-auto">
          Transforme sua <span className="text-gradient">história de amor</span> em um presente inesquecível
        </h1>
        
        <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Crie uma página personalizada em menos de 3 minutos. Surpreenda com contador de tempo, fotos e a trilha sonora de vocês.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-8 text-xl rounded-full pink-glow transition-all hover:scale-105" asChild>
            <Link href="/criar">
              Criar minha página agora <Heart className="ml-2 w-5 h-5 fill-current" />
            </Link>
          </Button>
          <Button variant="ghost" className="text-primary hover:bg-primary/5 px-10 py-8 text-lg rounded-full font-bold" asChild>
            <Link href="#como-funciona">
              Ver como funciona <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10" />
          <div className="rounded-[3rem] border-[12px] border-white overflow-hidden shadow-2xl animate-float">
            <img 
              src="https://picsum.photos/seed/lovelink-hero/1200/600" 
              alt="Preview" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}