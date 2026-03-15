export type Gender = "Female" | "Male";
export type ProblemStatus = "Active" | "Chronic" | "Resolved";
export type EncounterQuality = "good" | "fair" | "poor";
export type LabFlag = "normal" | "abnormal" | "critical";
export type AnnotationType =
  | "Supported"
  | "Contradictory"
  | "Not Supported"
  | "Query Needed"
  | "Suspect Condition"
  | "General Note";
export type ChartTabValue =
  | "encounters"
  | "problem-list"
  | "pmh"
  | "medications"
  | "labs"
  | "vitals"
  | "imaging";
export type SourceTab =
  | "Encounters"
  | "Problem List"
  | "Past Medical Hx"
  | "Medications"
  | "Labs"
  | "Vitals"
  | "Imaging";

export interface Problem {
  id: string;
  diagnosis: string;
  code: string;
  status: ProblemStatus;
  dateAdded: string;
  isHCC: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  prescriber: string;
}

export interface LabResult {
  id: string;
  component: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: LabFlag;
}

export interface LabPanel {
  id: string;
  name: string;
  date: string;
  results: LabResult[];
}

export interface VitalRecord {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
  oxygenSaturation: number;
}

export interface ImagingReport {
  id: string;
  type: string;
  date: string;
  indication: string;
  findings: string;
  impression: string[];
}

export interface AssessmentPlanItem {
  id: string;
  problem: string;
  code?: string;
  detail: string;
}

export interface Encounter {
  id: string;
  date: string;
  type: string;
  provider: string;
  quality: EncounterQuality;
  chiefComplaint: string;
  hpi: string;
  reviewOfSystems: string[];
  physicalExam: Array<{ system: string; text: string }>;
  vitals: VitalRecord;
  assessmentPlan: AssessmentPlanItem[];
  signatureTime: string;
  billingCode: string;
  contradictions: string[];
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  age: number;
  gender: Gender;
  dob: string;
  mrn: string;
  provider: string;
  scenarioId: string;
  scenarioName: string;
  problems: Problem[];
  encounters: Encounter[];
  medications: Medication[];
  labs: LabPanel[];
  vitals: VitalRecord[];
  imaging: ImagingReport[];
  pastMedicalHistory: string[];
}

export interface EvidenceSnippet {
  id: string;
  sourceTab: SourceTab;
  sourceType: string;
  sourceKey: string;
  sourceLabel: string;
  text: string;
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  diagnosis: string;
  diagnosisSource?: EvidenceSnippet;
  evidence: EvidenceSnippet[];
  notes: string;
  manualDiagnosis: boolean;
}
