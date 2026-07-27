
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroLP() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary mb-6 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">O presente viral do TikTok</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-serif-elegant font-bold mb-6 leading-tight">
          Transforme sua <span className="text-gradient">história de amor</span> em um presente inesquecível
        </h1>
        
        <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Crie uma página personalizada em menos de 3 minutos. Surpreenda com contador de tempo, fotos e a trilha sonora de vocês.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-7 text-xl rounded-full pink-glow transition-transform hover:scale-105" asChild>
            <Link href="/criar">
              Criar minha página agora <Heart className="ml-2 w-5 h-5 fill-current" />
            </Link>
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/5 px-8 py-7 text-lg rounded-full" asChild>
            <Link href="#como-funciona">
              Ver como funciona <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
          <div className="rounded-3xl border-4 border-white/10 overflow-hidden shadow-2xl animate-float">
            <img 
              src="https://picsum.photos/seed/lovelink-hero/1200/600" 
              alt="Preview da página do casal" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
