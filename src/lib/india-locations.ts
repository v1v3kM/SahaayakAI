// India-wide location database for Sahaayak AI
// 28 States + 8 Union Territories with major cities & disaster-prone zones

export interface StateData {
  name: string
  code: string
  capital: string
  lat: number
  lng: number
  cities: CityData[]
  commonDisasters: string[]
}

export interface CityData {
  name: string
  lat: number
  lng: number
  areas: string[]
}

export const INDIAN_STATES: StateData[] = [
  // --- NORTHERN INDIA ---
  {
    name: 'Delhi', code: 'DL', capital: 'New Delhi',
    cities: [
      { name: 'New Delhi', areas: ['Connaught Place', 'Karol Bagh', 'Chandni Chowk', 'Saket', 'Dwarka', 'Rohini', 'Janakpuri', 'Lajpat Nagar', 'Nehru Place', 'Pitampura', 'Model Town', 'Rajouri Garden', 'Vasant Kunj', 'Hauz Khas', 'Mehrauli'] },
      { name: 'South Delhi', areas: ['Greater Kailash', 'Chhatarpur', 'Sarita Vihar', 'Okhla', 'Tughlakabad', 'Sangam Vihar'] },
      { name: 'East Delhi', areas: ['Preet Vihar', 'Laxmi Nagar', 'Mayur Vihar', 'Patparganj', 'Shahdara', 'Dilshad Garden'] },
      { name: 'North Delhi', areas: ['Civil Lines', 'Burari', 'Narela', 'Alipur', 'Timarpur'] },
    ],
    commonDisasters: ['flood', 'fire', 'heatwave', 'cold_wave', 'waterlogging', 'building_collapse'],
  },
  {
    name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow',
    cities: [
      { name: 'Lucknow', areas: ['Hazratganj', 'Gomti Nagar', 'Aminabad', 'Charbagh', 'Aliganj', 'Indira Nagar', 'Alambagh'] },
      { name: 'Noida', areas: ['Sector 62', 'Sector 18', 'Sector 15', 'Greater Noida', 'Sector 137', 'Sector 76'] },
      { name: 'Varanasi', areas: ['Dashashwamedh', 'Assi Ghat', 'Lanka', 'Sigra', 'Cantonment'] },
      { name: 'Agra', areas: ['Taj Ganj', 'Civil Lines', 'Kamla Nagar', 'Fatehabad Road'] },
      { name: 'Kanpur', areas: ['Mall Road', 'Swaroop Nagar', 'Kidwai Nagar', 'Govind Nagar'] },
      { name: 'Prayagraj', areas: ['Civil Lines', 'George Town', 'Sangam', 'Jhunsi'] },
    ],
    commonDisasters: ['flood', 'fire', 'heatwave', 'cold_wave', 'building_collapse', 'drought'],
  },
  {
    name: 'Rajasthan', code: 'RJ', capital: 'Jaipur',
    cities: [
      { name: 'Jaipur', areas: ['C-Scheme', 'MI Road', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura'] },
      { name: 'Jodhpur', areas: ['Paota', 'Sardarpura', 'Ratanada', 'Shastri Nagar'] },
      { name: 'Udaipur', areas: ['Fateh Sagar', 'City Palace Area', 'Hiran Magri', 'Sukhadia Circle'] },
    ],
    commonDisasters: ['drought', 'heatwave', 'flood', 'fire', 'storm'],
  },
  {
    name: 'Punjab', code: 'PB', capital: 'Chandigarh',
    cities: [
      { name: 'Chandigarh', areas: ['Sector 17', 'Sector 22', 'Sector 35', 'Manimajra', 'Mohali'] },
      { name: 'Amritsar', areas: ['Hall Bazar', 'Ranjit Avenue', 'Lawrence Road', 'Golden Temple Area'] },
      { name: 'Ludhiana', areas: ['Clock Tower', 'Model Town', 'Civil Lines', 'Sarabha Nagar'] },
    ],
    commonDisasters: ['flood', 'fire', 'cold_wave', 'storm', 'industrial_accident'],
  },
  {
    name: 'Haryana', code: 'HR', capital: 'Chandigarh',
    cities: [
      { name: 'Gurugram', areas: ['Cyber City', 'Golf Course Road', 'Sohna Road', 'MG Road', 'DLF Phase 1-5', 'Sector 29'] },
      { name: 'Faridabad', areas: ['Sector 15', 'NIT', 'Old Faridabad', 'Ballabgarh'] },
    ],
    commonDisasters: ['flood', 'heatwave', 'waterlogging', 'fire', 'building_collapse'],
  },
  {
    name: 'Uttarakhand', code: 'UK', capital: 'Dehradun',
    cities: [
      { name: 'Dehradun', areas: ['Rajpur Road', 'Clock Tower', 'Paltan Bazaar', 'Clement Town', 'Mussoorie Road'] },
      { name: 'Haridwar', areas: ['Har Ki Pauri', 'Jwalapur', 'Kankhal', 'Bhagwanpur'] },
      { name: 'Rishikesh', areas: ['Ram Jhula', 'Laxman Jhula', 'Tapovan', 'Muni Ki Reti'] },
    ],
    commonDisasters: ['landslide', 'flood', 'earthquake', 'forest_fire', 'cold_wave'],
  },
  {
    name: 'Himachal Pradesh', code: 'HP', capital: 'Shimla',
    cities: [
      { name: 'Shimla', areas: ['Mall Road', 'Lakkar Bazaar', 'Sanjauli', 'Totu', 'Chhota Shimla'] },
      { name: 'Manali', areas: ['Mall Road', 'Old Manali', 'Vashisht', 'Aleo'] },
      { name: 'Dharamshala', areas: ['McLeod Ganj', 'Bhagsu', 'Kotwali Bazaar', 'Forsyth Ganj'] },
    ],
    commonDisasters: ['landslide', 'earthquake', 'flood', 'cold_wave', 'storm'],
  },
  {
    name: 'Jammu & Kashmir', code: 'JK', capital: 'Srinagar',
    cities: [
      { name: 'Srinagar', areas: ['Lal Chowk', 'Dal Gate', 'Rajbagh', 'Hazratbal', 'Nishat'] },
      { name: 'Jammu', areas: ['Raghunath Bazaar', 'Gandhi Nagar', 'Residency Road', 'Kachi Chawni'] },
    ],
    commonDisasters: ['earthquake', 'flood', 'landslide', 'cold_wave', 'storm'],
  },

  // --- WESTERN INDIA ---
  {
    name: 'Maharashtra', code: 'MH', capital: 'Mumbai',
    cities: [
      { name: 'Mumbai', areas: ['Andheri', 'Bandra', 'Borivali', 'Colaba', 'Dadar', 'Goregaon', 'Kurla', 'Lower Parel', 'Mulund', 'Thane', 'Worli', 'BKC', 'Juhu', 'Versova', 'Malad', 'Kandivali', 'Vikhroli', 'Ghatkopar', 'Chembur', 'Govandi', 'Mankhurd', 'Byculla', 'Parel', 'Matunga', 'Sion', 'Mahim', 'Santa Cruz', 'Vile Parle'] },
      { name: 'Pune', areas: ['Shivajinagar', 'Koregaon Park', 'Kothrud', 'Hadapsar', 'Hinjewadi', 'Baner', 'Aundh', 'Viman Nagar', 'Wakad'] },
      { name: 'Nagpur', areas: ['Sitabuldi', 'Dharampeth', 'Sadar', 'Civil Lines', 'Ramdaspeth'] },
      { name: 'Nashik', areas: ['College Road', 'Gangapur Road', 'Panchavati', 'Satpur'] },
    ],
    commonDisasters: ['flood', 'waterlogging', 'building_collapse', 'fire', 'landslide', 'cyclone'],
  },
  {
    name: 'Gujarat', code: 'GJ', capital: 'Gandhinagar',
    cities: [
      { name: 'Ahmedabad', areas: ['SG Highway', 'CG Road', 'Maninagar', 'Satellite', 'Vastrapur', 'Navrangpura', 'Ellis Bridge'] },
      { name: 'Surat', areas: ['Ring Road', 'Athwa', 'Adajan', 'Vesu', 'Katargam'] },
      { name: 'Vadodara', areas: ['Alkapuri', 'Race Course', 'Manjalpur', 'Fatehgunj'] },
      { name: 'Rajkot', areas: ['Kalavad Road', 'University Road', 'Yagnik Road', '150 Feet Ring Road'] },
    ],
    commonDisasters: ['earthquake', 'cyclone', 'flood', 'drought', 'heatwave', 'industrial_accident'],
  },
  {
    name: 'Goa', code: 'GA', capital: 'Panaji',
    cities: [
      { name: 'Panaji', areas: ['Fontainhas', 'Miramar', 'Dona Paula', 'Altinho', 'Campal'] },
      { name: 'Margao', areas: ['Comba', 'Fatorda', 'Navelim', 'Benaulim'] },
    ],
    commonDisasters: ['flood', 'cyclone', 'waterlogging', 'landslide'],
  },

  // --- SOUTHERN INDIA ---
  {
    name: 'Karnataka', code: 'KA', capital: 'Bengaluru',
    cities: [
      { name: 'Bengaluru', areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'Jayanagar', 'JP Nagar', 'BTM Layout', 'Marathahalli', 'Hebbal', 'Yelahanka', 'Rajajinagar', 'Malleshwaram', 'Basavanagudi'] },
      { name: 'Mysuru', areas: ['Saraswathipuram', 'Vijayanagar', 'Gokulam', 'Kuvempunagar'] },
      { name: 'Mangaluru', areas: ['Hampankatta', 'Kadri', 'Bejai', 'Kankanady'] },
    ],
    commonDisasters: ['flood', 'waterlogging', 'fire', 'building_collapse', 'drought'],
  },
  {
    name: 'Tamil Nadu', code: 'TN', capital: 'Chennai',
    cities: [
      { name: 'Chennai', areas: ['T Nagar', 'Anna Nagar', 'Adyar', 'Mylapore', 'Velachery', 'OMR', 'Nungambakkam', 'Egmore', 'Besant Nagar', 'Thiruvanmiyur', 'Porur', 'Tambaram', 'Guindy'] },
      { name: 'Coimbatore', areas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony'] },
      { name: 'Madurai', areas: ['Meenakshi Temple Area', 'Anna Nagar', 'KK Nagar', 'Goripalayam'] },
    ],
    commonDisasters: ['cyclone', 'flood', 'tsunami', 'waterlogging', 'drought', 'heatwave'],
  },
  {
    name: 'Kerala', code: 'KL', capital: 'Thiruvananthapuram',
    cities: [
      { name: 'Thiruvananthapuram', areas: ['Kowdiar', 'Vazhuthacaud', 'Statue', 'Pattom', 'Kazhakootam'] },
      { name: 'Kochi', areas: ['Marine Drive', 'MG Road', 'Edappally', 'Kakkanad', 'Fort Kochi', 'Vyttila'] },
      { name: 'Kozhikode', areas: ['Beach Road', 'Mavoor Road', 'Palayam', 'Nadakkavu'] },
    ],
    commonDisasters: ['flood', 'landslide', 'cyclone', 'waterlogging'],
  },
  {
    name: 'Telangana', code: 'TS', capital: 'Hyderabad',
    cities: [
      { name: 'Hyderabad', areas: ['Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Gachibowli', 'Madhapur', 'Ameerpet', 'Secunderabad', 'Begumpet', 'Kukatpally', 'LB Nagar', 'Charminar', 'Mehdipatnam'] },
      { name: 'Warangal', areas: ['Hanamkonda', 'Kazipet', 'Fort Warangal', 'Hunter Road'] },
    ],
    commonDisasters: ['flood', 'waterlogging', 'heatwave', 'cyclone', 'fire'],
  },
  {
    name: 'Andhra Pradesh', code: 'AP', capital: 'Amaravati',
    cities: [
      { name: 'Visakhapatnam', areas: ['Beach Road', 'Dwaraka Nagar', 'MVP Colony', 'Gajuwaka', 'Seethammadhara'] },
      { name: 'Vijayawada', areas: ['Benz Circle', 'Labbipet', 'Governorpet', 'Auto Nagar'] },
      { name: 'Tirupati', areas: ['Tirumala', 'Alipiri', 'Railway Station Area', 'Balaji Colony'] },
    ],
    commonDisasters: ['cyclone', 'flood', 'heatwave', 'drought', 'tsunami'],
  },

  // --- EASTERN INDIA ---
  {
    name: 'West Bengal', code: 'WB', capital: 'Kolkata',
    cities: [
      { name: 'Kolkata', areas: ['Park Street', 'Salt Lake', 'New Town', 'Howrah', 'Esplanade', 'Ballygunge', 'Gariahat', 'Behala', 'Dumdum', 'Baranagar', 'Tollygunge', 'Jadavpur', 'Alipore'] },
      { name: 'Siliguri', areas: ['Hill Cart Road', 'Sevoke Road', 'Pradhan Nagar', 'Matigara'] },
      { name: 'Darjeeling', areas: ['Mall Road', 'Chowrasta', 'Ghoom', 'Lebong'] },
    ],
    commonDisasters: ['cyclone', 'flood', 'waterlogging', 'building_collapse', 'storm'],
  },
  {
    name: 'Bihar', code: 'BR', capital: 'Patna',
    cities: [
      { name: 'Patna', areas: ['Boring Road', 'Bailey Road', 'Kankarbagh', 'Patna City', 'Rajendra Nagar'] },
      { name: 'Gaya', areas: ['Station Road', 'Bodh Gaya', 'GB Road', 'Swarajpuri'] },
    ],
    commonDisasters: ['flood', 'drought', 'heatwave', 'fire', 'cold_wave'],
  },
  {
    name: 'Odisha', code: 'OD', capital: 'Bhubaneswar',
    cities: [
      { name: 'Bhubaneswar', areas: ['Saheed Nagar', 'Patia', 'Nayapalli', 'Jaydev Vihar', 'Khandagiri'] },
      { name: 'Cuttack', areas: ['Buxi Bazaar', 'College Square', 'Madhupatna', 'Bidanasi'] },
      { name: 'Puri', areas: ['Grand Road', 'Chakratirtha Road', 'Marine Drive', 'Baliapanda'] },
    ],
    commonDisasters: ['cyclone', 'flood', 'storm', 'tsunami', 'heatwave'],
  },
  {
    name: 'Jharkhand', code: 'JH', capital: 'Ranchi',
    cities: [
      { name: 'Ranchi', areas: ['Main Road', 'Lalpur', 'Doranda', 'Bariatu', 'Morabadi'] },
      { name: 'Jamshedpur', areas: ['Bistupur', 'Sakchi', 'Sonari', 'Kadma'] },
    ],
    commonDisasters: ['flood', 'drought', 'fire', 'landslide', 'heatwave'],
  },

  // --- NORTHEASTERN INDIA ---
  {
    name: 'Assam', code: 'AS', capital: 'Dispur',
    cities: [
      { name: 'Guwahati', areas: ['Paltan Bazaar', 'Fancy Bazaar', 'GS Road', 'Zoo Road', 'Maligaon', 'Dispur'] },
      { name: 'Jorhat', areas: ['AT Road', 'Gar Ali', 'Na Ali', 'Tarajan'] },
    ],
    commonDisasters: ['flood', 'earthquake', 'landslide', 'storm'],
  },
  {
    name: 'Meghalaya', code: 'ML', capital: 'Shillong',
    cities: [
      { name: 'Shillong', areas: ['Police Bazaar', 'Laitumkhrah', 'Bara Bazaar', 'Lachumiere'] },
    ],
    commonDisasters: ['flood', 'landslide', 'earthquake', 'storm'],
  },
  {
    name: 'Manipur', code: 'MN', capital: 'Imphal',
    cities: [
      { name: 'Imphal', areas: ['Paona Bazaar', 'Thangal Bazaar', 'Lamphelpat', 'Mantripukhri'] },
    ],
    commonDisasters: ['earthquake', 'landslide', 'flood'],
  },
  {
    name: 'Mizoram', code: 'MZ', capital: 'Aizawl',
    cities: [{ name: 'Aizawl', areas: ['Bara Bazaar', 'Zarkawt', 'Dawrpui', 'Chanmari'] }],
    commonDisasters: ['earthquake', 'landslide', 'storm'],
  },
  {
    name: 'Nagaland', code: 'NL', capital: 'Kohima',
    cities: [{ name: 'Kohima', areas: ['Main Town', 'Phesama', 'BOC', 'High School Area'] }],
    commonDisasters: ['earthquake', 'landslide'],
  },
  {
    name: 'Tripura', code: 'TR', capital: 'Agartala',
    cities: [{ name: 'Agartala', areas: ['Battala', 'Gol Bazaar', 'Motor Stand', 'Krishnanagar'] }],
    commonDisasters: ['flood', 'earthquake', 'cyclone'],
  },
  {
    name: 'Arunachal Pradesh', code: 'AR', capital: 'Itanagar',
    cities: [{ name: 'Itanagar', areas: ['Ganga Market', 'Zero Point', 'Naharlagun', 'Bank Tinali'] }],
    commonDisasters: ['earthquake', 'landslide', 'flood'],
  },
  {
    name: 'Sikkim', code: 'SK', capital: 'Gangtok',
    cities: [{ name: 'Gangtok', areas: ['MG Marg', 'Deorali', 'Tadong', 'Ranipool'] }],
    commonDisasters: ['earthquake', 'landslide', 'flood', 'cold_wave'],
  },

  // --- CENTRAL INDIA ---
  {
    name: 'Madhya Pradesh', code: 'MP', capital: 'Bhopal',
    cities: [
      { name: 'Bhopal', areas: ['MP Nagar', 'Arera Colony', 'New Market', 'Habibganj', 'Kolar Road'] },
      { name: 'Indore', areas: ['Sapna Sangeeta', 'Vijay Nagar', 'Palasia', 'Rajwada'] },
    ],
    commonDisasters: ['flood', 'heatwave', 'drought', 'fire', 'industrial_accident'],
  },
  {
    name: 'Chhattisgarh', code: 'CG', capital: 'Raipur',
    cities: [
      { name: 'Raipur', areas: ['Telibandha', 'Shankar Nagar', 'Pandri', 'Fafadih', 'Civil Lines'] },
    ],
    commonDisasters: ['flood', 'fire', 'heatwave', 'industrial_accident'],
  },
]

// Extended incident types for pan-India coverage
export const INCIDENT_TYPES = [
  { value: 'flood', label: 'Flood', emoji: '🌊', description: 'River flooding, dam overflow, flash floods' },
  { value: 'earthquake', label: 'Earthquake', emoji: '🫨', description: 'Seismic activity, aftershocks' },
  { value: 'cyclone', label: 'Cyclone', emoji: '🌀', description: 'Tropical cyclone, severe storm system' },
  { value: 'tsunami', label: 'Tsunami', emoji: '🌊', description: 'Coastal wave surge from undersea events' },
  { value: 'landslide', label: 'Landslide', emoji: '⛰️', description: 'Hill collapse, mudslide, debris flow' },
  { value: 'fire', label: 'Fire', emoji: '🔥', description: 'Building fire, industrial fire, forest fire' },
  { value: 'building_collapse', label: 'Building Collapse', emoji: '🏗️', description: 'Structural failure, partial/full collapse' },
  { value: 'waterlogging', label: 'Waterlogging', emoji: '💧', description: 'Urban flooding, drainage failure' },
  { value: 'heatwave', label: 'Heatwave', emoji: '🌡️', description: 'Extreme temperatures, heat stroke risk' },
  { value: 'cold_wave', label: 'Cold Wave', emoji: '🥶', description: 'Extreme cold, hypothermia risk' },
  { value: 'drought', label: 'Drought', emoji: '🏜️', description: 'Water scarcity, crop failure' },
  { value: 'storm', label: 'Storm', emoji: '⛈️', description: 'Thunderstorm, hailstorm, dust storm' },
  { value: 'industrial_accident', label: 'Industrial Accident', emoji: '🏭', description: 'Chemical leak, explosion, gas leak' },
  { value: 'traffic_disaster', label: 'Traffic Disaster', emoji: '🚗', description: 'Major road accident, pile-up, bridge collapse' },
  { value: 'pandemic', label: 'Pandemic/Epidemic', emoji: '🦠', description: 'Disease outbreak, health emergency' },
  { value: 'other', label: 'Other', emoji: '⚠️', description: 'Other emergency situations' },
]

// All supported Indian languages
export const INDIAN_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'od', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', nativeName: 'অসমীয়া' },
]

// Type emoji lookup (extended)
export const TYPE_EMOJIS: Record<string, string> = {}
INCIDENT_TYPES.forEach(t => { TYPE_EMOJIS[t.value] = t.emoji })

// Severity levels
export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'moderate', label: 'Moderate', color: '#eab308' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'critical', label: 'Critical', color: '#ef4444' },
]

// Helper: Get all cities for a state
export function getCitiesForState(stateName: string): CityData[] {
  const state = INDIAN_STATES.find(s => s.name === stateName)
  return state?.cities || []
}

// Helper: Get all areas for a city within a state
export function getAreasForCity(stateName: string, cityName: string): string[] {
  const state = INDIAN_STATES.find(s => s.name === stateName)
  const city = state?.cities.find(c => c.name === cityName)
  return city?.areas || []
}

// Helper: Get all state names
export function getStateNames(): string[] {
  return INDIAN_STATES.map(s => s.name)
}

// Helper: Get all city names across India
export function getAllCityNames(): string[] {
  return INDIAN_STATES.flatMap(s => s.cities.map(c => c.name))
}

// Helper: Find state for a city
export function findStateForCity(cityName: string): StateData | undefined {
  return INDIAN_STATES.find(s => s.cities.some(c => c.name === cityName))
}

// Helper: Get language name from code
export function getLanguageName(code: string): string {
  return INDIAN_LANGUAGES.find(l => l.code === code)?.label || code
}

// Helper: Get full language name (for AI prompts)
export function getLanguageFullName(code: string): string {
  const lang = INDIAN_LANGUAGES.find(l => l.code === code)
  if (!lang) return 'English'
  if (code === 'en') return 'English'
  return `${lang.label} (${lang.nativeName})`
}
