// Geo-coordinates for Indian cities used in Sahaayak AI
// Used by the India Map component for plotting incidents

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // --- NORTHERN INDIA ---
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'South Delhi': { lat: 28.5245, lng: 77.2066 },
  'East Delhi': { lat: 28.6280, lng: 77.2950 },
  'North Delhi': { lat: 28.7041, lng: 77.1025 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Prayagraj': { lat: 25.4358, lng: 81.8463 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Gurugram': { lat: 28.4595, lng: 77.0266 },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Dehradun': { lat: 30.3165, lng: 78.0322 },
  'Haridwar': { lat: 29.9457, lng: 78.1642 },
  'Rishikesh': { lat: 30.0869, lng: 78.2676 },
  'Shimla': { lat: 31.1048, lng: 77.1734 },
  'Manali': { lat: 32.2396, lng: 77.1887 },
  'Dharamshala': { lat: 32.2190, lng: 76.3234 },
  'Srinagar': { lat: 34.0837, lng: 74.7973 },
  'Jammu': { lat: 32.7266, lng: 74.8570 },

  // --- WESTERN INDIA ---
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },
  'Panaji': { lat: 15.4909, lng: 73.8278 },
  'Margao': { lat: 15.2832, lng: 73.9862 },

  // --- SOUTHERN INDIA ---
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Mangaluru': { lat: 12.9141, lng: 74.8560 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Kozhikode': { lat: 11.2588, lng: 75.7804 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Warangal': { lat: 17.9784, lng: 79.5941 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Vijayawada': { lat: 16.5062, lng: 80.6480 },
  'Tirupati': { lat: 13.6288, lng: 79.4192 },

  // --- EASTERN INDIA ---
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Siliguri': { lat: 26.7271, lng: 88.6393 },
  'Darjeeling': { lat: 27.0410, lng: 88.2663 },
  'Patna': { lat: 25.6093, lng: 85.1376 },
  'Gaya': { lat: 24.7955, lng: 84.9994 },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'Cuttack': { lat: 20.4625, lng: 85.8830 },
  'Puri': { lat: 19.8135, lng: 85.8312 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Jamshedpur': { lat: 22.8046, lng: 86.2029 },

  // --- NORTHEASTERN INDIA ---
  'Guwahati': { lat: 26.1445, lng: 91.7362 },
  'Jorhat': { lat: 26.7509, lng: 94.2037 },
  'Shillong': { lat: 25.5788, lng: 91.8933 },
  'Imphal': { lat: 24.8170, lng: 93.9368 },
  'Aizawl': { lat: 23.7271, lng: 92.7176 },
  'Kohima': { lat: 25.6751, lng: 94.1086 },
  'Agartala': { lat: 23.8315, lng: 91.2868 },
  'Itanagar': { lat: 27.0844, lng: 93.6053 },
  'Gangtok': { lat: 27.3389, lng: 88.6065 },

  // --- CENTRAL INDIA ---
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Raipur': { lat: 21.2514, lng: 81.6296 },

  // --- ADDITIONAL KNOWN AREAS (used in seed data) ---
  'Bhuj': { lat: 23.2420, lng: 69.6669 },
  'Rudraprayag': { lat: 30.2840, lng: 78.9800 },
  'Meppadi': { lat: 11.5550, lng: 76.1370 },
  'Connaught Place': { lat: 28.6315, lng: 77.2167 },
  'Andheri': { lat: 19.1136, lng: 72.8697 },
  'Electronic City': { lat: 12.8399, lng: 77.6770 },
  'Howrah': { lat: 22.5958, lng: 88.2636 },
  'Marina Beach': { lat: 13.0500, lng: 80.2824 },
}

// State center coordinates for zoom-out view
export const STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Jammu & Kashmir': { lat: 33.7782, lng: 76.5762 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Telangana': { lat: 18.1124, lng: 79.0193 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Bihar': { lat: 25.0961, lng: 85.3131 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Meghalaya': { lat: 25.4670, lng: 91.3662 },
  'Manipur': { lat: 24.6637, lng: 93.9063 },
  'Mizoram': { lat: 23.1645, lng: 92.9376 },
  'Nagaland': { lat: 26.1584, lng: 94.5624 },
  'Tripura': { lat: 23.9408, lng: 91.9882 },
  'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
  'Sikkim': { lat: 27.5330, lng: 88.5122 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
}

// Resolve coordinates for an incident from its location/area string
export function resolveCoordinates(location: string, area: string): { lat: number; lng: number } | null {
  // Try exact match on area first
  if (CITY_COORDINATES[area]) return CITY_COORDINATES[area]
  
  // Try matching parts of the location string
  const parts = location.split(',').map(p => p.trim())
  for (const part of parts) {
    if (CITY_COORDINATES[part]) return CITY_COORDINATES[part]
  }
  
  // Try state coordinates
  for (const part of parts) {
    if (STATE_COORDINATES[part]) return STATE_COORDINATES[part]
  }
  
  // Default: center of India
  return { lat: 22.5, lng: 78.9 }
}
