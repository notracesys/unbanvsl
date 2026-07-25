
import { XCircle, CheckCircle } from "lucide-react";

export function Comparison() {
  return (
    <section className="py-24 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Por que estudar com um Drive organizado?</h2>
          <p className="text-muted-foreground">Compare a realidade de quem tem o material na palma da mão.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Without Drive */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100">
            <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center gap-2">
              <XCircle className="w-6 h-6" /> Sem o Drive
            </h3>
            <ul className="space-y-4">
              {[
                "Arquivos espalhados pelo HD",
                "Muito tempo procurando PDFs",
                "Materiais desatualizados",
                "Falta de organização e foco",
                "Não sabe por onde começar"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With Drive */}
          <div className="bg-primary/5 p-8 rounded-3xl shadow-md border-2 border-primary/20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Recomendado
            </div>
            <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
              <CheckCircle className="w-6 h-6" /> Com o Drive
            </h3>
            <ul className="space-y-4">
              {[
                "Tudo separado por matéria",
                "Acesso rápido em qualquer lugar",
                "Materiais 2024 revisados",
                "Organização simples e intuitiva",
                "Mais foco total nos estudos"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <CheckCircle className="w-5 h-5 text-accent fill-accent/10" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
