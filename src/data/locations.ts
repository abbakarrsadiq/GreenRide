import { Location } from '../types';

export const ABUJA_LOCATIONS: Location[] = [
  // Current Location (Area 1 Shopping Center)
  { latitude: 9.0765, longitude: 7.3986, address: 'Area 1 Shopping Center, Garki, Abuja', name: 'Area 1 Shopping Center' },
  
  // Major Districts
  { latitude: 9.0579, longitude: 7.4951, address: '10 Lapai Street, Area 1, Abuja', name: 'Area 1 - Lapai Street' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Maitama District, Abuja', name: 'Maitama District' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Asokoro District, Abuja', name: 'Asokoro District' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Gwarinpa Estate, Abuja', name: 'Gwarinpa Estate' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Lugbe Airport Road, Abuja', name: 'Lugbe Airport Road' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Jabi Lake Mall, Abuja', name: 'Jabi Lake Mall' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Wuse II Market, Abuja', name: 'Wuse II Market' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Life Camp Junction, Abuja', name: 'Life Camp Junction' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Guzape District, Abuja', name: 'Guzape District' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Katampe Extension, Abuja', name: 'Katampe Extension' },

  // Shopping Centers & Malls
  { latitude: 9.0765, longitude: 7.3986, address: 'Silverbird Galleria, Victoria Island, Abuja', name: 'Silverbird Galleria' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Ceddi Plaza, Central Business District, Abuja', name: 'Ceddi Plaza' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Abuja Mall, Wuse II, Abuja', name: 'Abuja Mall' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Next Cash & Carry, Jahi, Abuja', name: 'Next Cash & Carry' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Shoprite Jabi Lake Mall, Abuja', name: 'Shoprite Jabi' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Game Store Wuse II, Abuja', name: 'Game Store Wuse II' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Sahad Stores Garki, Abuja', name: 'Sahad Stores Garki' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Grand Square Mall, Garki, Abuja', name: 'Grand Square Mall' },

  // Hotels & Hospitality
  { latitude: 9.0765, longitude: 7.3986, address: 'Transcorp Hilton Hotel, Maitama, Abuja', name: 'Transcorp Hilton' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Sheraton Hotel, Ladi Kwali Street, Abuja', name: 'Sheraton Hotel' },
  { latitude: 9.0643, longitude: 7.4892, address: 'BON Hotel, Asokoro, Abuja', name: 'BON Hotel Asokoro' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Chelsea Hotel, Garki Area 11, Abuja', name: 'Chelsea Hotel' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Rockview Hotel, Wuse II, Abuja', name: 'Rockview Hotel' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Nicon Luxury Hotel, Tafawa Balewa Way, Abuja', name: 'Nicon Luxury' },

  // Government Buildings
  { latitude: 9.0579, longitude: 7.4951, address: 'Aso Rock Presidential Villa, Abuja', name: 'Aso Rock Villa' },
  { latitude: 9.0643, longitude: 7.4892, address: 'National Assembly Complex, Three Arms Zone, Abuja', name: 'National Assembly' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Supreme Court of Nigeria, Three Arms Zone, Abuja', name: 'Supreme Court' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Federal Secretariat Complex, Shehu Shagari Way, Abuja', name: 'Federal Secretariat' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Ministry of FCT, Area 11, Garki, Abuja', name: 'FCT Ministry' },

  // Educational Institutions
  { latitude: 9.0579, longitude: 7.4951, address: 'University of Abuja, Airport Road, Abuja', name: 'University of Abuja' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Nile University, Airport Road, Abuja', name: 'Nile University' },
  { latitude: 9.1108, longitude: 7.4165, address: 'American University of Nigeria, Yola Campus, Abuja', name: 'AUN Abuja Campus' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Baze University, Airport Road, Abuja', name: 'Baze University' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Veritas University, Airport Road, Abuja', name: 'Veritas University' },

  // Hospitals & Healthcare
  { latitude: 9.0579, longitude: 7.4951, address: 'National Hospital, Central Business District, Abuja', name: 'National Hospital' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Garki Hospital, Area 8, Garki, Abuja', name: 'Garki Hospital' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Maitama District Hospital, Maitama, Abuja', name: 'Maitama Hospital' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Asokoro District Hospital, Asokoro, Abuja', name: 'Asokoro Hospital' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Wuse General Hospital, Wuse II, Abuja', name: 'Wuse Hospital' },

  // Banks & Financial
  { latitude: 9.0579, longitude: 7.4951, address: 'Central Bank of Nigeria, Central Business District, Abuja', name: 'Central Bank HQ' },
  { latitude: 9.0643, longitude: 7.4892, address: 'GTBank Head Office, Plot 635 Adetokumbo Ademola Street, Abuja', name: 'GTBank HQ' },
  { latitude: 9.1108, longitude: 7.4165, address: 'First Bank Wuse II Branch, Abuja', name: 'First Bank Wuse II' },
  { latitude: 8.9806, longitude: 7.4004, address: 'UBA Garki Branch, Area 11, Abuja', name: 'UBA Garki' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Access Bank Maitama Branch, Abuja', name: 'Access Bank Maitama' },

  // Residential Areas
  { latitude: 9.0579, longitude: 7.4951, address: 'Jahi District, Abuja', name: 'Jahi District' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Utako District, Abuja', name: 'Utako District' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Kubwa Satellite Town, Abuja', name: 'Kubwa Town' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Nyanya Satellite Town, Abuja', name: 'Nyanya Town' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Karu Satellite Town, Abuja', name: 'Karu Town' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Gwagwalada Area Council, Abuja', name: 'Gwagwalada' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Bwari Area Council, Abuja', name: 'Bwari' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Kwali Area Council, Abuja', name: 'Kwali' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Abaji Area Council, Abuja', name: 'Abaji' },

  // Transportation Hubs
  { latitude: 9.0579, longitude: 7.4951, address: 'Nnamdi Azikiwe International Airport, Abuja', name: 'Abuja Airport' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Abuja Railway Station, Idu, Abuja', name: 'Railway Station' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Berger Motor Park, Wuse, Abuja', name: 'Berger Motor Park' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Nyanya Motor Park, Nyanya, Abuja', name: 'Nyanya Motor Park' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Kubwa Motor Park, Kubwa, Abuja', name: 'Kubwa Motor Park' },

  // Recreation & Entertainment
  { latitude: 9.0579, longitude: 7.4951, address: 'Millennium Park, Maitama, Abuja', name: 'Millennium Park' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Magic Land Amusement Park, Abuja', name: 'Magic Land Park' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Jabi Lake, Jabi District, Abuja', name: 'Jabi Lake' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Usuma Dam, Bwari, Abuja', name: 'Usuma Dam' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Zuma Rock, Niger State (Near Abuja)', name: 'Zuma Rock' },

  // Religious Centers
  { latitude: 9.0579, longitude: 7.4951, address: 'National Christian Centre, Central Business District, Abuja', name: 'National Christian Centre' },
  { latitude: 9.0643, longitude: 7.4892, address: 'National Mosque, Central Business District, Abuja', name: 'National Mosque' },
  { latitude: 9.1108, longitude: 7.4165, address: 'ECWA Church Wuse II, Abuja', name: 'ECWA Wuse II' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Redeemed Christian Church, Garki, Abuja', name: 'RCCG Garki' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Catholic Church of Assumption, Asokoro, Abuja', name: 'Catholic Asokoro' },

  // Markets & Commercial
  { latitude: 9.0579, longitude: 7.4951, address: 'Garki Modern Market, Area 8, Garki, Abuja', name: 'Garki Market' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Wuse Market, Wuse II, Abuja', name: 'Wuse Market' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Utako Modern Market, Utako, Abuja', name: 'Utako Market' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Nyanya Market, Nyanya, Abuja', name: 'Nyanya Market' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Kubwa Market, Kubwa, Abuja', name: 'Kubwa Market' },

  // Tech & Business Hubs
  { latitude: 9.0579, longitude: 7.4951, address: 'Abuja Technology Village, Airport Road, Abuja', name: 'Tech Village' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Central Business District, Plot 1, Abuja', name: 'CBD Plot 1' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Maitama Business District, Abuja', name: 'Maitama Business' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Wuse II Commercial Area, Abuja', name: 'Wuse II Commercial' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Garki Commercial Area, Area 11, Abuja', name: 'Garki Commercial' },

  // Embassies & International
  { latitude: 9.0579, longitude: 7.4951, address: 'US Embassy, Plot 1075 Diplomatic Drive, Abuja', name: 'US Embassy' },
  { latitude: 9.0643, longitude: 7.4892, address: 'British High Commission, Maitama, Abuja', name: 'British High Commission' },
  { latitude: 9.1108, longitude: 7.4165, address: 'French Embassy, CBD, Abuja', name: 'French Embassy' },
  { latitude: 8.9806, longitude: 7.4004, address: 'German Embassy, Walter Carrington Crescent, Abuja', name: 'German Embassy' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Chinese Embassy, Central District, Abuja', name: 'Chinese Embassy' },

  // Sports & Fitness
  { latitude: 9.0579, longitude: 7.4951, address: 'Abuja National Stadium, Package B, Abuja', name: 'National Stadium' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Moshood Abiola Stadium, Package A, Abuja', name: 'MKO Stadium' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Abuja Golf Club, Maitama, Abuja', name: 'Golf Club' },
  { latitude: 8.9806, longitude: 7.4004, address: 'IBB Golf Club, Asokoro, Abuja', name: 'IBB Golf Club' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Fitness First Gym, Wuse II, Abuja', name: 'Fitness First' },

  // Additional Neighborhoods
  { latitude: 9.0579, longitude: 7.4951, address: 'Apo Resettlement, Apo District, Abuja', name: 'Apo Resettlement' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Galadimawa Roundabout, Galadimawa, Abuja', name: 'Galadimawa' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Lokogoma District, Abuja', name: 'Lokogoma' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Kado Estate, Kado, Abuja', name: 'Kado Estate' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Durumi District, Abuja', name: 'Durumi' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Kaura District, Abuja', name: 'Kaura' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Dakwo District, Abuja', name: 'Dakwo' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Karmo District, Abuja', name: 'Karmo' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Dei-Dei District, Abuja', name: 'Dei-Dei' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Mpape District, Abuja', name: 'Mpape' },

  // Final locations to reach 100
  { latitude: 9.0579, longitude: 7.4951, address: 'Dawaki District, Abuja', name: 'Dawaki' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Lugbe Phase 1, Abuja', name: 'Lugbe Phase 1' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Lugbe Phase 2, Abuja', name: 'Lugbe Phase 2' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Trademore Estate, Lugbe, Abuja', name: 'Trademore Estate' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Idu Industrial Layout, Abuja', name: 'Idu Industrial' },
  { latitude: 9.0579, longitude: 7.4951, address: 'Jikwoyi District, Abuja', name: 'Jikwoyi' },
  { latitude: 9.0643, longitude: 7.4892, address: 'Kurudu District, Abuja', name: 'Kurudu' },
  { latitude: 9.1108, longitude: 7.4165, address: 'Orozo District, Abuja', name: 'Orozo' },
  { latitude: 8.9806, longitude: 7.4004, address: 'Suleja Satellite Town, Niger State', name: 'Suleja' },
  { latitude: 9.0765, longitude: 7.3986, address: 'Madalla Town, Niger State', name: 'Madalla' },
];