export enum AdminRole {
  LOCATION_ADMIN = 'LOCATION_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  timezone: string;
  isActive: boolean;
  openingHours: OpeningHours[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OpeningHours {
  dayOfWeek: number; // 0-6, Sunday = 0
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isClosed: boolean;
}

export interface LocationAdmin {
  id: string;
  userId: string;
  locationId: string;
  role: AdminRole;
  createdAt: Date;
}

export interface UserFavoriteLocation {
  userId: string;
  locationId: string;
}
