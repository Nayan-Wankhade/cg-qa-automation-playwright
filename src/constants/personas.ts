import * as dotenv from 'dotenv';
dotenv.config();

export type PersonaKey = 'funder';

export interface Persona {
  key:      PersonaKey;
  label:    string;
  email:    string;
  password: string;
  tag:      string;
  can: {
    createResult:    boolean;
    editResult:      boolean;
    deleteResult:    boolean;
    createIndicator: boolean;
    editIndicator:   boolean;
    deleteIndicator: boolean;
    viewDashboard:   boolean;
    viewReports:     boolean;
    manageUsers:     boolean;
  };
}

export const PERSONAS: Record<PersonaKey, Persona> = {

  funder: {
    key:      'funder',
    label:    'Funder',
    email:    process.env['FUNDER_EMAIL']    ?? '',
    password: process.env['FUNDER_PASSWORD'] ?? '',
    tag:      '@funder',
    can: {
      createResult:    true,
      editResult:      true,
      deleteResult:    true,
      createIndicator: true,
      editIndicator:   true,
      deleteIndicator: true,
      viewDashboard:   true,
      viewReports:     true,
      manageUsers:     false,
    },
  },

};

export const ALL_PERSONAS = Object.values(PERSONAS);
