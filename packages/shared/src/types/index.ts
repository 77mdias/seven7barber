export enum Role {
  CLIENT = 'CLIENT',
  BARBER = 'BARBER',
  ADMIN = 'ADMIN',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface UserDTO {
  id: String;
  email: string;
  name: string;
  role: Role;
  image?: string;
  verified: boolean;
  createdAt: Date;
}

export interface ServiceDTO {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
}

export interface AppointmentDTO {
  id: string;
  dateTime: Date;
  status: AppointmentStatus;
  notes?: string;
  clientId: string;
  barberId: string;
  serviceId: string;
}
