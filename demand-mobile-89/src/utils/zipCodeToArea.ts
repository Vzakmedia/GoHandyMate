
interface ZipCodeAreaMapping {
  [zipCode: string]: string;
}

// Common zip code to area mappings - you can expand this or use an API
const commonZipCodeAreas: ZipCodeAreaMapping = {
  // New York
  '10001': 'Midtown Manhattan',
  '10002': 'Lower East Side',
  '10003': 'East Village',
  '10004': 'Financial District',
  '10005': 'Financial District',
  '10006': 'Tribeca',
  '10007': 'Tribeca',
  '10008': 'Tribeca',
  '10009': 'East Village',
  '10010': 'Flatiron District',
  '10011': 'Chelsea',
  '10012': 'SoHo',
  '10013': 'SoHo',
  '10014': 'West Village',
  '10016': 'Murray Hill',
  '10017': 'Midtown East',
  '10018': 'Garment District',
  '10019': 'Hell\'s Kitchen',
  '10020': 'Midtown',
  '10021': 'Upper East Side',
  '10022': 'Midtown East',
  '10023': 'Upper West Side',
  '10024': 'Upper West Side',
  '10025': 'Upper West Side',
  '10026': 'Harlem',
  '10027': 'Harlem',
  '10028': 'Upper East Side',
  '10029': 'East Harlem',
  '10030': 'Harlem',
  '10031': 'Hamilton Heights',
  '10032': 'Washington Heights',
  '10033': 'Washington Heights',
  '10034': 'Inwood',
  '10035': 'East Harlem',
  '10036': 'Hell\'s Kitchen',
  '10037': 'Harlem',
  '10038': 'Financial District',
  '10039': 'Harlem',
  '10040': 'Washington Heights',
  
  // Brooklyn
  '11201': 'Brooklyn Heights',
  '11202': 'DUMBO',
  '11203': 'East Flatbush',
  '11204': 'Bensonhurst',
  '11205': 'Fort Greene',
  '11206': 'Williamsburg',
  '11207': 'East New York',
  '11208': 'East New York',
  '11209': 'Bay Ridge',
  '11210': 'Flatlands',
  '11211': 'Williamsburg',
  '11212': 'Brownsville',
  '11213': 'Crown Heights',
  '11214': 'Bensonhurst',
  '11215': 'Park Slope',
  '11216': 'Bedford-Stuyvesant',
  '11217': 'Boerum Hill',
  '11218': 'Kensington',
  '11219': 'Borough Park',
  '11220': 'Sunset Park',
  '11221': 'Bedford-Stuyvesant',
  '11222': 'Greenpoint',
  '11223': 'Gravesend',
  '11224': 'Coney Island',
  '11225': 'Crown Heights',
  '11226': 'Flatbush',
  '11228': 'Dyker Heights',
  '11229': 'Sheepshead Bay',
  '11230': 'Midwood',
  '11231': 'Red Hook',
  '11232': 'Sunset Park',
  '11233': 'Bedford-Stuyvesant',
  '11234': 'Marine Park',
  '11235': 'Sheepshead Bay',
  '11236': 'Canarsie',
  '11237': 'Bushwick',
  '11238': 'Prospect Heights',
  '11239': 'East New York',
  
  // Los Angeles
  '90001': 'South LA',
  '90002': 'Watts',
  '90003': 'South LA',
  '90004': 'Mid-City',
  '90005': 'Koreatown',
  '90006': 'Pico-Union',
  '90007': 'South Park',
  '90008': 'Baldwin Hills',
  '90010': 'Koreatown',
  '90011': 'South LA',
  '90012': 'Downtown LA',
  '90013': 'Downtown LA',
  '90014': 'Downtown LA',
  '90015': 'Downtown LA',
  '90016': 'Mid-City',
  '90017': 'Downtown LA',
  '90018': 'Mid-City',
  '90019': 'Mid-City',
  '90020': 'Koreatown',
  '90021': 'Downtown LA',
  '90024': 'Westwood',
  '90025': 'West LA',
  '90026': 'Silver Lake',
  '90027': 'Los Feliz',
  '90028': 'Hollywood',
  '90029': 'East Hollywood',
  '90031': 'Lincoln Heights',
  '90032': 'El Sereno',
  '90033': 'Boyle Heights',
  '90034': 'Mid-City',
  '90035': 'Mid-City',
  '90036': 'Mid-City',
  '90037': 'South LA',
  '90038': 'Hollywood',
  '90039': 'Atwater Village',
  '90040': 'Commerce',
  '90041': 'Eagle Rock',
  '90042': 'Highland Park',
  '90043': 'South LA',
  '90044': 'South LA',
  '90045': 'Westchester',
  '90046': 'West Hollywood',
  '90047': 'South LA',
  '90048': 'Beverly Hills',
  '90049': 'Brentwood',
  '90056': 'LAX Area',
  '90057': 'Westlake',
  '90058': 'Vernon',
  '90059': 'Watts',
  '90061': 'South LA',
  '90062': 'South LA',
  '90063': 'East LA',
  '90064': 'West LA',
  '90065': 'Glassell Park',
  '90066': 'Mar Vista',
  '90067': 'Century City',
  '90068': 'Hollywood Hills',
  '90069': 'West Hollywood',
  '90210': 'Beverly Hills',
  '90211': 'Beverly Hills',
  '90212': 'Beverly Hills',
  '90230': 'Culver City',
  '90232': 'Culver City',
  '90291': 'Venice',
  '90292': 'Marina del Rey',
  '90401': 'Santa Monica',
  '90402': 'Santa Monica',
  '90403': 'Santa Monica',
  '90404': 'Santa Monica',
  '90405': 'Santa Monica'
};

export const getAreaNameFromZipCode = async (zipCode: string): Promise<string> => {
  // First check our local mapping
  if (commonZipCodeAreas[zipCode]) {
    return commonZipCodeAreas[zipCode];
  }
  
  // If not found in local mapping, try to use geocoding
  try {
    // You could integrate with Google Geocoding API here
    // For now, return a generic area name based on zip code pattern
    const firstThree = zipCode.substring(0, 3);
    
    // Basic region mapping based on zip code prefixes
    const regionMapping: { [key: string]: string } = {
      '100': 'Manhattan Area',
      '101': 'Manhattan Area', 
      '102': 'Bronx Area',
      '103': 'Staten Island Area',
      '104': 'Bronx Area',
      '105': 'Westchester Area',
      '106': 'White Plains Area',
      '107': 'Yonkers Area',
      '108': 'New Rochelle Area',
      '112': 'Brooklyn Area',
      '113': 'Queens Area',
      '114': 'Queens Area',
      '115': 'Queens Area',
      '116': 'Queens Area',
      '117': 'Queens Area',
      '118': 'Queens Area',
      '119': 'Queens Area',
      '900': 'Los Angeles Area',
      '901': 'Los Angeles Area',
      '902': 'Los Angeles Area',
      '903': 'Los Angeles Area',
      '904': 'Los Angeles Area',
      '905': 'Los Angeles Area',
      '906': 'Los Angeles Area',
      '907': 'Los Angeles Area',
      '908': 'Los Angeles Area',
      '909': 'San Bernardino Area',
      '910': 'Pasadena Area',
      '911': 'Pasadena Area',
      '912': 'Glendale Area',
      '913': 'Van Nuys Area',
      '914': 'Van Nuys Area',
      '915': 'Burbank Area',
      '916': 'Sacramento Area',
      '917': 'Fresno Area',
      '918': 'Bakersfield Area',
      '919': 'San Diego Area',
      '920': 'San Diego Area',
      '921': 'San Diego Area',
      '922': 'San Diego Area',
      '923': 'San Francisco Area',
      '924': 'San Francisco Area',
      '925': 'Oakland Area',
      '926': 'Oakland Area',
      '927': 'San Jose Area',
      '928': 'San Jose Area'
    };
    
    return regionMapping[firstThree] || `${zipCode} Area`;
  } catch (error) {
    console.error('Error getting area name from zip code:', error);
    return `${zipCode} Area`;
  }
};

export const extractZipCodeFromAddress = (address: string): string | null => {
  // Match 5-digit zip codes
  const zipMatch = address.match(/\b\d{5}\b/);
  return zipMatch ? zipMatch[0] : null;
};

export const generateAreaNameFromZipCode = (zipCode: string): string => {
  // Synchronous version for immediate use
  return commonZipCodeAreas[zipCode] || `${zipCode} Area`;
};
