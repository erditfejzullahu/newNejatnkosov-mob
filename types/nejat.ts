export type KosovoCity =
  | 'Prishtina'
  | 'Prizren'
  | 'Peja'
  | 'Gjilan'
  | 'Mitrovica'
  | 'Ferizaj'
  | 'Gjakova'
  | 'Podujeva'
  | 'Vushtrri'
  | 'Suhareka'
  | 'Rahovec'
  | 'Lipjan'
  | 'Malisheva'
  | 'Kamenica'
  | 'Istog'
  | 'Kline'
  | 'Skenderaj'
  | 'Viti'
  | 'Deçan'
  | 'Dragash'
  | 'FushëKosova'
  | 'Kaçanik'
  | 'Obiliq'
  | 'Shtime'
  | 'Shtërpcë'
  | 'ZubinPotok'
  | 'Zveçan';

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface VenueSocialMedia extends SocialMedia {
  website?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city: KosovoCity;
  phoneNumber: string;
  imageUrl: string;
  socialMedia: VenueSocialMedia;
  createdAt: string;
  updatedAt: string;
}

export interface Performer {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  imageUrl: string;
  socialMedia: SocialMedia;
  createdAt: string;
  updatedAt: string;
}

export type Role = "ADMIN" | "MANAGER"

export interface Session {
  sub: number;
  name: string | null;
  username: string;
  role: Role;
  email: string;
  exp: number;
}

export interface Reservations {
  id: string;
  fullName: string;
  arrivingTime: Date;
  phoneNumber: string;
  howManyPeople: number;
  event: Nejat;
  eventId: string;
  hasCame: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Nejat {
  id: string;
  venueId: string;
  eventDate: Date;
  name?: string | null;
  description: string;
  startTime: Date;
  endTime: Date | null;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  performers: Performer[];
  venue: Venue;
} 

export interface TopPerformers {
  firstName: string;
  lastName: string;
  nickname: string;
  votes: string;
}

export interface Tickets {
  id: string;
  ticketTitle: string;
  ticketDescription: string;
  ticketImageUrl: string | null;
  email: string;
  fullName: string;
  event: Nejat | null,
  eventId: string | null,
  createdAt: Date;
}