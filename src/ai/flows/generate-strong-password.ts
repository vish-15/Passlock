'use server';
/**
 * @fileOverview A strong password generator AI agent.
 *
 * - generateStrongPassword - A function that handles the password generation process.
 * - GenerateStrongPasswordInput - The input type for the generateStrongPassword function.
 * - GenerateStrongPasswordOutput - The return type for the generateStrongPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongPasswordInputSchema = z.object({
  length: z.number().describe('The desired length of the password.'),
  includeUppercase: z
    .boolean()
    .describe('Whether to include uppercase characters.'),
  includeLowercase: z
    .boolean()
    .describe('Whether to include lowercase characters.'),
  includeNumbers: z.boolean().describe('Whether to include numbers.'),
  includeSymbols: z.boolean().describe('Whether to include symbols.'),
  excludeCharacters: z
    .string()
    .describe('Characters to exclude from the password.'),
});
export type GenerateStrongPasswordInput = z.infer<
  typeof GenerateStrongPasswordInputSchema
>;

const GenerateStrongPasswordOutputSchema = z.object({
  password: z.string().describe('The generated strong password.'),
  isSecure: z.boolean().describe('Whether the password is secure enough.'),
});
export type GenerateStrongPasswordOutput = z.infer<
  typeof GenerateStrongPasswordOutputSchema
>;

export async function generateStrongPassword(
  input: GenerateStrongPasswordInput
): Promise<GenerateStrongPasswordOutput> {
  return generateStrongPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrongPasswordPrompt',
  input: {schema: GenerateStrongPasswordInputSchema},
  output: {schema: GenerateStrongPasswordOutputSchema},
  prompt: `You are a password expert who can generate strong passwords based on user criteria.

  Here are the criteria for the password:
  - Length: {{length}}
  - Include uppercase: {{includeUppercase}}
  - Include lowercase: {{includeLowercase}}
  - Include numbers: {{includeNumbers}}
  - Include symbols: {{includeSymbols}}
  - Exclude characters: {{excludeCharacters}}

  Generate a password that meets these criteria, and determine if the password is secure enough.
  Consider a password to be not secure if it is a common word, a simple pattern, or easily guessable.
  `,
});

const generateStrongPasswordFlow = ai.defineFlow(
  {
    name: 'generateStrongPasswordFlow',
    inputSchema: GenerateStrongPasswordInputSchema,
    outputSchema: GenerateStrongPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
