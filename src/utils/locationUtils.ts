import { Location } from '../types';
import { ABUJA_LOCATIONS } from '../data/locations';

export class LocationUtils {
  /**
   * Search locations with intelligent filtering
   */
  static searchLocations(query: string): Location[] {
    if (!query || query.trim().length === 0) {
      return ABUJA_LOCATIONS;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return ABUJA_LOCATIONS.filter(location => {
      // Search in name
      const nameMatch = location.name?.toLowerCase().includes(searchTerm);
      
      // Search in address
      const addressMatch = location.address.toLowerCase().includes(searchTerm);
      
      // Search for partial matches in words
      const nameWords = location.name?.toLowerCase().split(' ') || [];
      const addressWords = location.address.toLowerCase().split(' ');
      
      const wordMatch = [...nameWords, ...addressWords].some(word => 
        word.startsWith(searchTerm) || word.includes(searchTerm)
      );
      
      return nameMatch || addressMatch || wordMatch;
    }).sort((a, b) => {
      // Prioritize exact matches in name
      const aNameExact = a.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bNameExact = b.name?.toLowerCase().includes(searchTerm) ? 1 : 0;
      
      if (aNameExact !== bNameExact) {
        return bNameExact - aNameExact;
      }
      
      // Then prioritize matches at the beginning of words
      const aStartsWith = a.name?.toLowerCase().startsWith(searchTerm) || 
                         a.address.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      const bStartsWith = b.name?.toLowerCase().startsWith(searchTerm) || 
                         b.address.toLowerCase().startsWith(searchTerm) ? 1 : 0;
      
      if (aStartsWith !== bStartsWith) {
        return bStartsWith - aStartsWith;
      }
      
      // Finally sort alphabetically
      return (a.name || a.address).localeCompare(b.name || b.address);
    });
  }

  /**
   * Get popular/frequently used locations
   */
  static getPopularLocations(): Location[] {
    // Return a curated list of popular locations
    return ABUJA_LOCATIONS.filter(location => 
      location.name?.includes('Mall') ||
      location.name?.includes('Airport') ||
      location.name?.includes('Market') ||
      location.name?.includes('Hospital') ||
      location.name?.includes('University') ||
      location.name?.includes('Hotel') ||
      location.name?.includes('Stadium') ||
      location.name?.includes('Shopping')
    ).slice(0, 10);
  }

  /**
   * Get locations by category
   */
  static getLocationsByCategory(category: string): Location[] {
    const categoryMap: { [key: string]: string[] } = {
      shopping: ['Mall', 'Market', 'Shopping', 'Store', 'Plaza'],
      healthcare: ['Hospital', 'Clinic', 'Medical'],
      education: ['University', 'School', 'College'],
      hospitality: ['Hotel', 'Lodge', 'Resort'],
      government: ['Ministry', 'Secretariat', 'Assembly', 'Court'],
      transport: ['Airport', 'Station', 'Park'],
      recreation: ['Park', 'Stadium', 'Club', 'Lake'],
      religious: ['Church', 'Mosque', 'Centre'],
      residential: ['Estate', 'District', 'Area', 'Town'],
    };

    const keywords = categoryMap[category.toLowerCase()] || [];
    
    return ABUJA_LOCATIONS.filter(location =>
      keywords.some(keyword => 
        location.name?.includes(keyword) || 
        location.address.includes(keyword)
      )
    );
  }

  /**
   * Calculate distance between two locations (Haversine formula)
   */
  static calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(loc2.latitude - loc1.latitude);
    const dLon = this.toRad(loc2.longitude - loc1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(loc1.latitude)) * Math.cos(this.toRad(loc2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get nearby locations within a radius
   */
  static getNearbyLocations(center: Location, radiusKm: number = 5): Location[] {
    return ABUJA_LOCATIONS.filter(location => {
      const distance = this.calculateDistance(center, location);
      return distance <= radiusKm && distance > 0; // Exclude the center location itself
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(center, a);
      const distanceB = this.calculateDistance(center, b);
      return distanceA - distanceB;
    });
  }

  /**
   * Get current location (Area 1 Shopping Center as default)
   */
  static getCurrentLocation(): Location {
    return ABUJA_LOCATIONS[0]; // Area 1 Shopping Center
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}