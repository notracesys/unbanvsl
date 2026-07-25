'use server';
/**
 * @fileOverview Provides an AI-powered summary generator for study folder titles.
 *
 * - generateAutomaticFolderSummary: A function that generates a concise summary of a study folder's content based on its title.
 * - AutomaticFolderSummaryInput: The input type for the generateAutomaticFolderSummary function.
 * - AutomaticFolderSummaryOutput: The return type for the generateAutomaticFolderSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticFolderSummaryInputSchema = z.object({
  folderTitle: z
    .string()
    .describe(
      'The title of the study folder for which to generate a summary.'
    ),
});
export type AutomaticFolderSummaryInput = z.infer<
  typeof AutomaticFolderSummaryInputSchema
>;

const AutomaticFolderSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, AI-generated summary of the folder content.'),
});
export type AutomaticFolderSummaryOutput = z.infer<
  typeof AutomaticFolderSummaryOutputSchema
>;

export async function generateAutomaticFolderSummary(
  input: AutomaticFolderSummaryInput
): Promise<AutomaticFolderSummaryOutput> {
  return automaticFolderSummaryFlow(input);
}

const automaticFolderSummaryPrompt = ai.definePrompt({
  name: 'automaticFolderSummaryPrompt',
  input: {schema: AutomaticFolderSummaryInputSchema},
  output: {schema: AutomaticFolderSummaryOutputSchema},
  prompt: `Gere um resumo conciso e persuasivo (máximo de 3 frases) do conteúdo de uma pasta de estudos para o ENEM, com base no seguinte título:

Título da Pasta: "{{{folderTitle}}}"

O resumo deve destacar o valor do conteúdo da pasta e o que um estudante pode esperar encontrar nela, como se fosse uma prévia para um potencial comprador.`,
});

const automaticFolderSummaryFlow = ai.defineFlow(
  {
    name: 'automaticFolderSummaryFlow',
    inputSchema: AutomaticFolderSummaryInputSchema,
    outputSchema: AutomaticFolderSummaryOutputSchema,
  },
  async input => {
    const {output} = await automaticFolderSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate folder summary.');
    }
    return output;
  }
);
