'use server';
/**
 * @fileOverview Fluxo Genkit para simular uma busca profunda de dados públicos.
 * Gera resultados que parecem extraídos do Google, incluindo alertas de exposição.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
  isSensitive: z.boolean().default(false),
  source: z.string(),
});

const PerformScanInputSchema = z.object({
  query: z.string().describe('O dado a ser pesquisado (nome, CPF, etc)'),
});
export type PerformScanInput = z.infer<typeof PerformScanInputSchema>;

const PerformScanOutputSchema = z.object({
  aiOverview: z.string().describe('Resumo da IA sobre a exposição encontrada.'),
  results: z.array(ScanResultSchema),
  exposureScore: z.number().min(0).max(100),
  findingsCount: z.number(),
});
export type PerformScanOutput = z.infer<typeof PerformScanOutputSchema>;

export async function performScan(input: PerformScanInput): Promise<PerformScanOutput> {
  return performScanFlow(input);
}

const performScanPrompt = ai.definePrompt({
  name: 'performScanPrompt',
  input: {schema: PerformScanInputSchema},
  output: {schema: PerformScanOutputSchema},
  prompt: `Você é o motor de inteligência Localiza.AI. Sua tarefa é simular uma busca profunda na internet por dados relacionados a: "{{{query}}}".

Gere um relatório que se pareça com resultados reais de busca, incluindo:
1. Um "AI Overview" (Resumo da IA) curto e direto sobre os riscos encontrados.
2. Uma lista de 5 a 8 resultados simulados (título, URL fictícia mas realista, e um snippet).
3. Pelo menos 2 desses resultados DEVEM ser marcados como "isSensitive: true" (ex: "Exposição de CPF em banco de dados vazado", "Registro de processo jurídico detalhado").
4. O tom deve ser sério, técnico e levemente alarmante para incentivar a proteção.

Fontes sugeridas para simular: JusBrasil, LinkedIn, Transparência Gov, Serasa Experian (simulado), Pastes de Vazamentos, Escavador.`,
});

const performScanFlow = ai.defineFlow(
  {
    name: 'performScanFlow',
    inputSchema: PerformScanInputSchema,
    outputSchema: PerformScanOutputSchema,
  },
  async (input) => {
    const {output} = await performScanPrompt(input);
    return output!;
  }
);
