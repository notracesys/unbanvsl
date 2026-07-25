'use server';
/**
 * @fileOverview This file implements a Genkit flow for the Smart Tutor feature.
 * It analyzes student's simulated exam results and recommends specific study folders
 * from a provided Google Drive structure to help them focus on their weakest areas.
 *
 * - smartTutorRecommendations - A function that handles the smart tutor recommendations process.
 * - SmartTutorRecommendationsInput - The input type for the smartTutorRecommendations function.
 * - SmartTutorRecommendationsOutput - The return type for the smartTutorRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTutorRecommendationsInputSchema = z.object({
  simuladoResults: z
    .string()
    .describe(
      "A detailed description of the student's performance in mock exams, including scores, areas of weakness, number of correct/incorrect answers per subject, etc."
    ),
  driveStructure: z
    .string()
    .describe(
      'The hierarchical structure of the study drive, showing folders and subfolders. The AI MUST only recommend folders that exist within this structure.'
    ),
});
export type SmartTutorRecommendationsInput = z.infer<
  typeof SmartTutorRecommendationsInputSchema
>;

const SmartTutorRecommendationsOutputSchema = z.object({
  recommendedFolders: z
    .array(z.string())
    .describe(
      'An array of recommended study folder paths (e.g., "ENEM/Matemática/Álgebra") based on the student\u0027s weaknesses.'
    ),
  explanation: z
    .string()
    .describe('A clear and concise explanation for why these folders were recommended.'),
});
export type SmartTutorRecommendationsOutput = z.infer<
  typeof SmartTutorRecommendationsOutputSchema
>;

export async function smartTutorRecommendations(
  input: SmartTutorRecommendationsInput
): Promise<SmartTutorRecommendationsOutput> {
  return smartTutorRecommendationsFlow(input);
}

const smartTutorRecommendationsPrompt = ai.definePrompt({
  name: 'smartTutorRecommendationsPrompt',
  input: {schema: SmartTutorRecommendationsInputSchema},
  output: {schema: SmartTutorRecommendationsOutputSchema},
  prompt: `You are a Smart Tutor AI specializing in ENEM preparation. Your goal is to analyze a student's mock exam performance and recommend specific study folders from a provided Google Drive structure to help them focus on their weakest areas and study more efficiently.

Here are the student's mock exam results:
{{{simuladoResults}}}

Here is the Google Drive study material structure. You MUST only recommend folders that exist within this structure, providing the full path to the recommended folders:
{{{driveStructure}}}

Analyze the simulated results and identify the student's weaknesses. Then, based on these weaknesses and the provided Drive structure, recommend the most relevant folders for the student to study. Also, provide a clear and concise explanation for your recommendations.

Ensure your recommendations are precise and directly map to the folder paths available in the drive structure.`,
});

const smartTutorRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartTutorRecommendationsFlow',
    inputSchema: SmartTutorRecommendationsInputSchema,
    outputSchema: SmartTutorRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await smartTutorRecommendationsPrompt(input);
    return output!;
  }
);
