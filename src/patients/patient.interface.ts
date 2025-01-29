export interface Patient {
    lastName: string;
    firstName: string;
    birthDate: Date;
    phoneNumber: string;
    email?: string;
    password: string;
    role: 'user' | 'admin';
  }
  