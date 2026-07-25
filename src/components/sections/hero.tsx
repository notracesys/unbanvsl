
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  "+10.000 questões", "Apostilas completas", "Resumos", "Simulados", 
  "Redações nota alta", "Cronogramas", "Materiais organizados"
];

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-laptop');

  return (
    <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            <Badge className="mb-4 px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full border-none shadow-sm">
              <Zap className="w-4 h-4 mr-2 fill-current" />
              Acesso Imediato
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              O Drive definitivo para quem quer <span className="text-primary">dominar o ENEM.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Tenha acesso organizado a milhares de materiais em um único lugar para estudar de forma mais prática e eficiente.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-10 py-7 text-lg rounded-xl shadow-lg shadow-accent/20 transition-all hover:scale-105">
                Quero acesso agora
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative animate-float">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 aspect-video lg:aspect-square flex items-center justify-center bg-white">
              {heroImage && (
                <Image 
                  src={heroImage.imageUrl} 
                  alt={heroImage.description}
                  width={600}
                  height={600}
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
            {/* Background blobs for depth */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
