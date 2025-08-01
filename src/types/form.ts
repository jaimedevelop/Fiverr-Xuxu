export interface FormErrors {
  [key: string]: string | undefined;
  storeName?: string;
  accountManager?: string;
  email?: string;
  phone?: string;
  street?: string;
  colonia?: string;
  municipality?: string;
  postalCode?: string;
  state?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export interface FormField {
  name: keyof FormErrors;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'tel';
  required: boolean;
}