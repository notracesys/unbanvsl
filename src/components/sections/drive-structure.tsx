
"use client";

import { Folder, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const structure = [
  {
    name: "ENEM 2024",
    isOpen: true,
    children: [
      {
        name: "Ciências da Natureza",
        children: ["Biologia", "Física", "Química"]
      },
      {
        name: "Ciências Humanas",
        children: ["Geografia", "História", "Filosofia", "Sociologia"]
      },
      {
        name: "Linguagens",
        children: ["Literatura", "Gramática", "Língua Estrangeira"]
      },
      {
        name: "Matemática",
        children: ["Álgebra", "Geometria", "Estatística"]
      },
      {
        name: "Redação",
        children: ["Modelos Nota 1000", "Eixos Temáticos", "Folhas de Treino"]
      },
      {
        name: "Simulados",
        children: ["ENEM Anteriores", "Inéditos", "Gabaritos Comentados"]
      }
    ]
  }
];

export function DriveStructure() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Organização impecável</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre o que você precisa em segundos. Nossa árvore de diretórios foi pensada para facilitar o fluxo de estudos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Organização inteligente', 'Atualizações frequentes', 'Acesso imediato', 'Fácil navegação'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl">
            <div className="bg-white rounded-3xl shadow-xl border border-primary/10 overflow-hidden">
              <div className="bg-primary/5 p-4 border-b flex items-center gap-2">
                <Folder className="w-5 h-5 text-primary fill-current" />
                <span className="font-semibold text-primary">AprovaçãoDrive_2024</span>
              </div>
              <div className="p-6 h-[400px] overflow-y-auto font-body text-sm">
                <TreeNode item={structure[0]} level={0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreeNode({ item, level }: { item: any, level: number }) {
  const [isOpen, setIsOpen] = useState(item.isOpen || false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors",
          "hover:bg-primary/5"
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <div className="w-4 h-4" />
        )}
        <Folder className={cn("w-4 h-4", hasChildren ? "text-primary fill-current" : "text-muted-foreground")} />
        <span className={cn(isOpen && "font-semibold")}>{item.name}</span>
      </div>
      
      {isOpen && hasChildren && (
        <div className="animate-in fade-in slide-in-from-left-2 duration-200">
          {item.children.map((child: any, idx: number) => {
            if (typeof child === 'string') {
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 py-1.5 px-2 hover:bg-accent/5 rounded-lg cursor-default"
                  style={{ paddingLeft: `${(level + 1) * 20 + 24}px` }}
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{child}</span>
                </div>
              );
            }
            return <TreeNode key={idx} item={child} level={level + 1} />;
          })}
        </div>
      )}
    </div>
  );
}
