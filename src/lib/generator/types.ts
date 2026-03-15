import type {
  EncounterQuality,
  Patient,
  ProblemStatus,
} from "@/types/patient";

export type Range = [number, number];

export type SpecificPanelKey =
  | "glycemic-renal"
  | "bnp"
  | "abg"
  | "vascular-diabetes"
  | "thyroid-metabolic"
  | "mood-medical"
  | "dialysis-mineral"
  | "inflammatory"
  | "hepatic"
  | "heart-obesity"
  | "cognitive-nutrition"
  | "hiv"
  | "stroke-risk"
  | "wound-inflammatory";

export type ImagingKey =
  | "renal-ultrasound"
  | "echo"
  | "chest-ct"
  | "arterial-duplex"
  | "sleep-study"
  | "mental-health-screen"
  | "dialysis-access"
  | "hrct"
  | "liver-us"
  | "venous-duplex"
  | "brain-mri"
  | "hiv-neuro"
  | "swallow-study"
  | "amputation-xray";

export interface ProblemTemplate {
  diagnosis: string;
  code: string;
  isHCC: boolean;
  status?: ProblemStatus;
  hpiPhrases: string[];
  planPhrases: string[];
}

export interface MedicationTemplate {
  name: string;
  dose: string;
  frequency: string;
  route: string;
}

export interface EncounterTemplate {
  type: string;
  complaints: string[];
  purpose: string[];
}

export interface VitalProfile {
  systolic: Range;
  diastolic: Range;
  heartRate: Range;
  temperature: Range;
  weight: Range;
  height: Range;
  oxygenSaturation: Range;
}

export interface LabProfile {
  glucose?: Range;
  bun?: Range;
  creatinine?: Range;
  albumin?: Range;
  bilirubin?: Range;
  alkPhos?: Range;
  ast?: Range;
  alt?: Range;
  sodium?: Range;
  potassium?: Range;
  chloride?: Range;
  co2?: Range;
  calcium?: Range;
  hemoglobin?: Range;
  platelets?: Range;
  wbc?: Range;
  neutrophils?: Range;
  lymphocytes?: Range;
  totalCholesterol?: Range;
  hdl?: Range;
  ldl?: Range;
  triglycerides?: Range;
}

export interface ScenarioDef {
  id: string;
  name: string;
  summary: string;
  problems: ProblemTemplate[];
  medications: MedicationTemplate[];
  encounterTypes: EncounterTemplate[];
  pastMedicalHistory: string[];
  positiveRos: string[];
  positiveExam: string[];
  vitalProfile: VitalProfile;
  labProfile: LabProfile;
  panelKeys: SpecificPanelKey[];
  imagingKeys: ImagingKey[];
  contradictions: Array<{ hpi: string; ap: string }>;
}

export type PatientGender = Patient["gender"];
export type QualityLevel = EncounterQuality;
