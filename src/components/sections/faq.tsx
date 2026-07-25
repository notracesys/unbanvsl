
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Como recebo acesso?",
    a: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com o link de acesso direto à pasta compartilhada no Google Drive."
  },
  {
    q: "O acesso é imediato?",
    a: "Sim! Se o pagamento for via PIX ou Cartão, o envio é automático."
  },
  {
    q: "Posso acessar pelo celular?",
    a: "Sim, o Drive é totalmente compatível com o aplicativo oficial do Google Drive no celular e tablet."
  },
  {
    q: "Funciona no computador?",
    a: "Sim, você pode acessar pelo navegador ou sincronizar com seu computador."
  },
  {
    q: "Preciso pagar mensalidade?",
    a: "Não. O acesso é vitalício com pagamento único. Você paga uma vez e tem acesso a todas as atualizações futuras."
  }
];

export function FAQ() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold mb-12 text-center">Dúvidas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border px-6 hover:shadow-sm transition-shadow">
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-lg py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
