export interface Survey {
  id?: number;

  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  telephone: string;
  email: string;
  surveyDate: string;

  liked: string[];
  interestSource: 'friends' | 'television' | 'internet' | 'other';
  recommend: 'Very Likely' | 'Likely' | 'Unlikely';
  comments?: string;
}
