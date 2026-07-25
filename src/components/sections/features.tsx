
import { GlassCard } from "@/components/ui/glass-card";
import { 
  BookOpen, 
  FileText, 
  Target, 
  Layout, 
  BrainCircuit, 
  PlayCircle, 
  PenTool, 
  Calendar 
} from "lucide-react";

const items = [
  { icon: BookOpen, title: "Apostilas", color: "text-blue-500" },
  { icon: FileText, title: "Questões separadas", color: "text-green-500" },
  { icon: Target, title: "Simulados", color: "text-red-500" },
  { icon: Layout, title: "Resumos", color: "text-yellow-500" },
  { icon: BrainCircuit, title: "Mapas Mentais", color: "text-purple-500" },
  { icon: PlayCircle, title: "Videoaulas", color: "text-blue-600" },
  { icon: PenTool, title: "Modelos de Redação", color: "text-emerald-500" },
  { icon: Calendar, title: "Cronograma de Estudos", color: "text-orange-500" },
];

export function Features() {
  return (
    <section className="py-24 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Tudo o que você precisa em um único Drive</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Esqueça arquivos espalhados. Nosso material é curado e organizado para sua aprovação.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <GlassCard key={idx} className="flex flex-col items-center text-center group hover:-translate-y-2">
              <div className={`p-4 rounded-2xl bg-white mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
