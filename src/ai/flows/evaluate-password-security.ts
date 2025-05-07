// src/ai/flows/evaluate-password-security.ts
'use server';

/**
 * @fileOverview Password security evaluation flow.
 *
 * This file defines a Genkit flow to evaluate the security strength of a password.
 * It takes a password string as input and returns a security score and a suggestion
 * for a stronger password if the input password is weak.
 *
 * @exports evaluatePasswordSecurity - The main function to evaluate password security.
 * @exports EvaluatePasswordSecurityInput - The input type for the evaluatePasswordSecurity function.
 * @exports EvaluatePasswordSecurityOutput - The return type for the evaluatePasswordSecurity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the password evaluation flow
const EvaluatePasswordSecurityInputSchema = z.object({
  password: z.string().describe('The password to evaluate.'),
});
export type EvaluatePasswordSecurityInput = z.infer<
  typeof EvaluatePasswordSecurityInputSchema
>;

// Output schema for the password evaluation flow
const EvaluatePasswordSecurityOutputSchema = z.object({
  securityScore: z
    .number()
    .describe('A score indicating the security strength of the password (0-100).'),
  isSecure: z.boolean().describe('Whether the password is secure enough.'),
  suggestion: z
    .string()
    .describe('A suggestion for a stronger password if the input password is weak.'),
});
export type EvaluatePasswordSecurityOutput = z.infer<
  typeof EvaluatePasswordSecurityOutputSchema
>;

// Exported function to evaluate password security
export async function evaluatePasswordSecurity(
  input: EvaluatePasswordSecurityInput
): Promise<EvaluatePasswordSecurityOutput> {
  return evaluatePasswordSecurityFlow(input);
}

// Define the prompt for password evaluation
const evaluatePasswordSecurityPrompt = ai.definePrompt({
  name: 'evaluatePasswordSecurityPrompt',
  input: {schema: EvaluatePasswordSecurityInputSchema},
  output: {schema: EvaluatePasswordSecurityOutputSchema},
  prompt: `You are a password security expert. Evaluate the security strength of the provided password and provide a security score between 0 and 100.

  Also, determine if the password is secure enough. If the password is not secure enough, provide a suggestion for a stronger password.

  Password: {{{password}}}`,
});

// Define the Genkit flow for password evaluation
const evaluatePasswordSecurityFlow = ai.defineFlow(
  {
    name: 'evaluatePasswordSecurityFlow',
    inputSchema: EvaluatePasswordSecurityInputSchema,
    outputSchema: EvaluatePasswordSecurityOutputSchema,
  },
  async input => {
    const {output} = await evaluatePasswordSecurityPrompt(input);
    return output!;
  }
);
