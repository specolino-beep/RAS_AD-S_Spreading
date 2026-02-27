export interface DigestateParams {
  tsPercent: number;
  nTotPercentTS: number;
}

export interface AgronomicParams {
  maxNitrogenLoad: number;
  singleInterventionLoad: number;
}

export interface MixtureParams {
  rRatio: number;
  tsInoculum: number;
  vsInoculum: number;
  tsSludge: number;
  vsSludge: number;
}

export interface BiomassParams {
  sludgeProductionRate: number;
  fcr: number;
}

export interface CalculationResults {
  tsGL: number;
  nTotGL: number;
  mtTons: number;
  minInterventions: number;
  msKg: number;
  miKg: number;
  totalBiomass: number;
}

export interface AreaCalculationResults {
  totalTsSludge: number;
  msKg: number;
  mtKg: number;
  totalNitrogenKg: number;
  requiredAreaHa: number;
  nTotGL: number;
}