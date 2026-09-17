export interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;

  address: string;
  hours: string;

  latitude: number;
  longitude: number;

  googlePlaceId?: string;
  googleMapsUrl?: string;

  rating?: number;
  userRatingCount?: number;
}

export interface Category {
  id: string;
  name: string;
}