
export interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password_encrypted: string; // Storing as is for simplicity in scaffold, with warning.
  createdAt: string;
}

export interface PasswordGeneratorFormValues {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeCharacters: string;
}
