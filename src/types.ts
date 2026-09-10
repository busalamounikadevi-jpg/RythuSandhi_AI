export type TabType = 'chat' | 'matrimony' | 'security' | 'directory';

export interface CropRequirement {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  idealAcreage: string;
  gestationPeriod: string;
  setupCostEstimate: string;
  buyerPriceEstimate: string;
  setupSpecs: {
    environment: string;
    infrastructure: string[];
    soilOrSubstrate: string;
    climateAndWater: string;
    sterileProtocols: string;
  };
  qualityStandards: {
    turgidityOrPurity: string;
    moistureTolerance: string;
    visualDefects: string;
    certificationsRequired: string[];
    rejectionCriteria: string[];
  };
  roiAnalysis: {
    minBulkThreshold: string;
    fpoRecommendation: string;
    institutionalDemandScore: number; // 1-100
    primaryBuyers: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  cropRequirement?: CropRequirement;
  isBuyerIntent?: boolean;
  spoken?: boolean;
  buyerMatches?: any[];
  fpoMessage?: string;
  citations?: any[];
}

export interface FarmerProfile {
  name: string;
  phone: string;
  district: string;
  state: string;
  landSize: number; // acres (0.5 to 10)
  selectedCrops: string[];
  isOptedIn: boolean;
  optInDate?: string;
}

export interface BuyerDemand {
  id: string;
  buyerName: string;
  location?: string;
  crop?: string;
  quantity?: string;
  specs?: string;
  verified?: boolean;
  organizationType?: 'Institutional' | 'Pharma / Ayurveda' | 'FMCG Corporate' | 'Hospitality / Exporter';
  cropName?: string;
  quantityRequired?: string;
  minAcreageRequired?: number;
  offeredPrice?: string;
  procurementSeason?: string;
  locationRequirement?: string;
  verifiedGST?: boolean;
  isUrgent?: boolean;
  qualityGrade?: string;
  specSummary?: string;
}

export interface FraudEntry {
  companyName: string;
  status: 'FLAGGED_FRAUD' | 'VERIFIED_BUYER' | 'UNDER_REVIEW';
  reason?: string;
  gstin?: string;
  location?: string;
  trustScore?: number;
  reportCount?: number;
  warningNote?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'Legal' | 'Financial' | 'Quality' | 'Operational';
  isCompleted: boolean;
  importance: 'CRITICAL' | 'RECOMMENDED';
}

export interface FpoCluster {
  id: string;
  fpoName?: string;
  name?: string;
  location?: string;
  district?: string;
  farmers?: number;
  memberFarmers?: number;
  crops?: string[];
  cropsHandled?: string[];
  contact?: string;
  contactPerson?: string;
  phone?: string;
  aggregationCenter?: string;
}
