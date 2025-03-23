import { UserSSOProfile } from '@stackbit/types';

export type Role = 'admin' | 'validator' | 'employee';

export type Agency = {
  id: string;
  name: string;
  adresse: string;
  phone: string;
  email: string;
};

export type TimesheetFormData = {
  id?: string;
  date: Date | string;
  siteId: string;
  hours: number;
  hoursSup: number;
  notes: string;
  panier: boolean;
  trajetId: string;
  transportId: string;
  status: string;
  workerId?: string;
};

export type Worker = {
  id: string;
  name: string;
  role: string;
  position: string;
  contact: string;
  email: string;
  address: string;
  joinDate: string | Date;
  image: string;
  notes: string;
  agencyId?: string;
  siteIds: string[];
};

export type StateActionWorker = {
  pending: number;
  id: string;
  name: string;
};

export type Site = {
  id: string;
  name: string;
  type: string;
  address: string;
  agencyId: string;
  notes: string;
};

export type Transport = {
  id: string;
  label: string;
};

export type Trajet = {
  id: string;
  label: string;
};

export type Message = {
  id: string;
  sender: string;
  senderId: string;
  message: string;
  timestamp: string;
  status: string;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  numero?: string;
  role?: string | undefined;
  sso?: UserSSOProfile | undefined;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  preview: string;
  workerId: string;
};
