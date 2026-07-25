
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ana Silva",
    text: "Finalmente consegui organizar meus estudos. O material é muito completo!",
    role: "Estudante de Medicina",
    image: "https://picsum.photos/seed/stu1/100/100"
  },
  {
    name: "Carlos Mendes",
    text: "O Drive facilitou muito minha rotina. Economizei horas procurando materiais.",
    role: "Aspirante a Engenharia",
    image: "https://picsum.photos/seed/stu2/100/100"
  },
  {
    name: "Beatriz Costa",
    text: "A seção de redação é incrível. Modelos prontos que ajudam muito na estrutura.",
    role: "Futura Jornalista",
    image: "https://picsum.photos/seed/stu3/100/100"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">O que dizem nossos alunos</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Junte-se a milhares de estudantes que já estão simplificando sua rotina de estudos.
            <br />
            <span className="text-xs italic">(Depoimentos ilustrativos para fins de exemplo)</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
              </div>
              <p className="text-lg mb-6 italic leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white/50">
                  <AvatarImage src={t.image} />
                  <AvatarFallback className="text-primary">{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-primary-foreground/70">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
