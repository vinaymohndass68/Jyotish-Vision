
export interface BirthDetails {
  dob: string;
  tob: string;
  pob: string;
}

export interface HouseInfo {
  house: number;
  planets: string[];
  sign: number;
}

export interface ChartData {
  houses: HouseInfo[];
}

export interface AstrologyResults {
  lagnaChart: ChartData;
  rashiChart: ChartData;
  navamshaChart: ChartData;
  interpretation: string;
  ayanamsaUsed: string;
  utcOffset: string;
  planetaryDetails: {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    pada: number;
  }[];
}

export interface CompatibilityResults {
  person1: AstrologyResults;
  person2: AstrologyResults;
  gunaMilanScore: number;
  gunaMilanMax: number;
  soulConnectionAnalysis: string;
  karmicTies: string;
  strengths: string[];
  challenges: string[];
}
