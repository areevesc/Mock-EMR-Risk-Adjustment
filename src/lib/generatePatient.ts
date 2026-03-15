import {
  buildAdditionalImaging,
  commonProblemPool,
  defaultRosStatements,
  femaleFirstNames,
  imagingTemplateFor,
  lastNames,
  maleFirstNames,
  orphanMedicationPool,
  physicalExamTemplates,
  providers,
  rosSystems,
} from "@/lib/generator/constants";
import { scenariosA } from "@/lib/generator/scenarios-a";
import { scenariosB } from "@/lib/generator/scenarios-b";
import type {
  ImagingKey,
  LabProfile,
  PatientGender,
  ProblemTemplate,
  QualityLevel,
  Range,
  ScenarioDef,
} from "@/lib/generator/types";
import type {
  AssessmentPlanItem,
  Encounter,
  LabFlag,
  LabPanel,
  LabResult,
  Medication,
  Patient,
  Problem,
  ProblemStatus,
  VitalRecord,
} from "@/types/patient";

const scenarios = [...scenariosA, ...scenariosB];

let idCounter = 0;

function uid(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function pick<T>(items: T[]): T {
  return items[rand(0, items.length - 1)];
}

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability: number) {
  return Math.random() < probability;
}

function sample<T>(items: T[], count: number) {
  const cloned = [...items];
  const result: T[] = [];
  while (cloned.length > 0 && result.length < count) {
    const index = rand(0, cloned.length - 1);
    result.push(cloned.splice(index, 1)[0]);
  }
  return result;
}

function clamp(value: number, [min, max]: Range) {
  return Math.min(max, Math.max(min, value));
}

function fmtDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fmtTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function minusDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return next;
}

function calculateDob(age: number) {
  const now = new Date();
  const birth = new Date(
    now.getFullYear() - age,
    rand(0, 11),
    rand(1, 28),
    0,
    0,
    0,
    0,
  );

  if (birth > now) {
    birth.setFullYear(birth.getFullYear() - 1);
  }

  return fmtDate(birth);
}

function makeDateAdded(index: number) {
  return fmtDate(minusDays(new Date(), rand(45 + index * 12, 900)));
}

function createProblem(problem: ProblemTemplate, dateAdded?: string): Problem {
  return {
    id: uid("problem"),
    diagnosis: problem.diagnosis,
    code: problem.code,
    status: problem.status ?? pick<ProblemStatus>(["Active", "Chronic"]),
    dateAdded: dateAdded ?? makeDateAdded(rand(0, 4)),
    isHCC: problem.isHCC,
  };
}

function buildVitalRecord(
  date: string,
  profile: ScenarioDef["vitalProfile"],
  gender: PatientGender,
): VitalRecord {
  const height = clamp(
    rand(profile.height[0], profile.height[1]),
    gender === "Female" ? [58, 70] : [62, 78],
  );
  const weight = rand(profile.weight[0], profile.weight[1]);
  const bmi = Number(((weight / (height * height)) * 703).toFixed(1));

  return {
    id: uid("vital"),
    date,
    systolic: rand(profile.systolic[0], profile.systolic[1]),
    diastolic: rand(profile.diastolic[0], profile.diastolic[1]),
    heartRate: rand(profile.heartRate[0], profile.heartRate[1]),
    temperature: Number(
      (rand(profile.temperature[0] * 10, profile.temperature[1] * 10) / 10).toFixed(
        1,
      ),
    ),
    weight,
    height,
    bmi,
    oxygenSaturation: rand(
      profile.oxygenSaturation[0],
      profile.oxygenSaturation[1],
    ),
  };
}

function buildReviewOfSystems(scenario: ScenarioDef, quality: QualityLevel) {
  const maxSystems =
    quality === "good"
      ? rosSystems.length
      : quality === "fair"
        ? rand(8, 10)
        : rand(4, 6);

  return rosSystems.slice(0, maxSystems).map((system, index) => {
    const positive = index < 3 && chance(0.72);
    const text = positive ? pick(scenario.positiveRos) : defaultRosStatements[system];
    return `${system}: ${text}`;
  });
}

function buildPhysicalExam(scenario: ScenarioDef, quality: QualityLevel) {
  const systemNames = Object.keys(physicalExamTemplates);
  const maxSystems =
    quality === "good" ? 8 : quality === "fair" ? rand(5, 6) : rand(3, 4);

  return sample(systemNames, maxSystems).map((system, index) => ({
    system,
    text:
      index < 2 && chance(0.65)
        ? pick(scenario.positiveExam)
        : pick(physicalExamTemplates[system as keyof typeof physicalExamTemplates]),
  }));
}

function buildMedication(
  medication: ScenarioDef["medications"][number],
  provider: string,
): Medication {
  return {
    id: uid("med"),
    name: medication.name,
    dose: medication.dose,
    frequency: medication.frequency,
    route: medication.route,
    prescriber: provider,
  };
}

function billingCodeFor(encounterType: string, quality: QualityLevel) {
  if (encounterType.toLowerCase().includes("annual")) {
    return pick(["G0438", "G0439", "99397"]);
  }

  if (quality === "good") {
    return pick(["99214", "99215"]);
  }

  if (quality === "fair") {
    return pick(["99213", "99214"]);
  }

  return pick(["99213", "99214"]);
}

function joinSentenceFragments(items: string[], fallback: string) {
  if (items.length === 0) {
    return fallback;
  }
  if (items.length === 1) {
    return items[0];
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildHpi(
  patient: Pick<Patient, "firstName" | "lastName" | "age" | "gender">,
  scenario: ScenarioDef,
  template: ScenarioDef["encounterTypes"][number],
  focusedProblems: ProblemTemplate[],
  quality: QualityLevel,
  contradiction?: { hpi: string; ap: string },
) {
  const severityLead =
    quality === "good"
      ? "The visit included extended review of interval records, medication reconciliation, and chronic disease counseling."
      : quality === "fair"
        ? "Interval symptoms and medication adherence were reviewed."
        : "Brief interval follow-up completed.";

  const symptomSummary = joinSentenceFragments(
    focusedProblems.map((problem) => pick(problem.hpiPhrases)),
    scenario.summary,
  );

  const complianceLine = pick([
    "Home monitoring logs were reviewed and compared with the prior visit.",
    "Dietary adherence has been inconsistent over the last several weeks.",
    "Family support remains important for medication organization and transportation.",
    "Medication reconciliation was completed and refill barriers were discussed.",
  ]);

  return `${pick(template.purpose)}. ${severityLead} ${patient.firstName} ${patient.lastName}, a ${patient.age}-year-old ${patient.gender.toLowerCase()}, presents for ${pick(template.complaints).toLowerCase()}. The patient describes ${symptomSummary}. ${complianceLine}${contradiction ? ` ${contradiction.hpi}.` : ""}`;
}

function buildAssessmentPlan(
  focusedProblems: ProblemTemplate[],
  incomplete: boolean,
  contradiction?: { hpi: string; ap: string },
) {
  const planCount = incomplete
    ? Math.max(1, focusedProblems.length - rand(1, 2))
    : focusedProblems.length;

  const selected = focusedProblems.slice(0, planCount);
  const plans: AssessmentPlanItem[] = selected.map((problem, index) => ({
    id: uid("plan"),
    problem:
      contradiction && index === 0
        ? contradiction.ap
        : `${problem.diagnosis}${problem.code ? ` (${problem.code})` : ""}`,
    code: problem.code,
    detail: pick(problem.planPhrases),
  }));

  if (chance(0.18)) {
    plans.push({
      id: uid("plan"),
      problem: "Preventive care",
      detail:
        "Vaccination status, diet, exercise tolerance, and specialist follow-up were reviewed.",
    });
  }

  return plans;
}

function signatureTimeFor(date: string) {
  const dateObj = new Date(`${date}T08:00:00`);
  dateObj.setHours(rand(8, 17), rand(0, 59), 0, 0);
  return fmtTime(dateObj);
}

function resultFlag(
  value: number,
  normalRange: Range,
  criticalRange?: Range,
): LabFlag {
  if (criticalRange && (value < criticalRange[0] || value > criticalRange[1])) {
    return "critical";
  }
  if (value < normalRange[0] || value > normalRange[1]) {
    return "abnormal";
  }
  return "normal";
}

function createLabResult(
  component: string,
  value: number,
  unit: string,
  referenceRange: string,
  normalRange: Range,
  criticalRange?: Range,
  precision = 0,
): LabResult {
  return {
    id: uid("lab"),
    component,
    value:
      precision > 0 ? value.toFixed(precision) : Math.round(value).toString(),
    unit,
    referenceRange,
    flag: resultFlag(value, normalRange, criticalRange),
  };
}

function pickValue(range: Range, precision = 0) {
  const multiplier = 10 ** precision;
  return rand(range[0] * multiplier, range[1] * multiplier) / multiplier;
}

function valueFromProfile(
  profileRange: Range | undefined,
  fallback: Range,
  precision = 0,
) {
  return pickValue(profileRange ?? fallback, precision);
}

function generateCbcPanel(date: string, profile: LabProfile): LabPanel {
  return {
    id: uid("panel"),
    name: "CBC with Differential",
    date,
    results: [
      createLabResult("WBC", valueFromProfile(profile.wbc, [4.5, 10.8], 1), "K/uL", "4.5-10.8", [4.5, 10.8], [2.5, 20], 1),
      createLabResult("RBC", pickValue([3.4, 5.3], 2), "M/uL", "3.8-5.2", [3.8, 5.2], [2.5, 6.2], 2),
      createLabResult("Hemoglobin", valueFromProfile(profile.hemoglobin, [12.0, 15.8], 1), "g/dL", "12.0-15.8", [12, 15.8], [7, 19], 1),
      createLabResult("Hematocrit", pickValue([33, 47], 1), "%", "36-46", [36, 46], [24, 56], 1),
      createLabResult("MCV", pickValue([82, 101], 1), "fL", "80-100", [80, 100], [70, 115], 1),
      createLabResult("MCH", pickValue([26, 35], 1), "pg", "27-33", [27, 33], [22, 38], 1),
      createLabResult("MCHC", pickValue([31, 36], 1), "g/dL", "32-36", [32, 36], [28, 38], 1),
      createLabResult("RDW", pickValue([12, 17], 1), "%", "11.5-14.5", [11.5, 14.5], [10, 20], 1),
      createLabResult("Platelets", valueFromProfile(profile.platelets, [165, 340]), "K/uL", "150-400", [150, 400], [75, 700]),
      createLabResult("Neutrophils %", valueFromProfile(profile.neutrophils, [45, 74]), "%", "40-75", [40, 75], [20, 90]),
      createLabResult("Lymphocytes %", valueFromProfile(profile.lymphocytes, [18, 42]), "%", "18-45", [18, 45], [5, 60]),
      createLabResult("Monocytes %", pickValue([4, 11]), "%", "2-12", [2, 12], [0, 18]),
      createLabResult("Eosinophils %", pickValue([0, 6]), "%", "0-5", [0, 5], [0, 15]),
      createLabResult("Basophils %", pickValue([0, 2]), "%", "0-1", [0, 1], [0, 5]),
    ],
  };
}

function generateCmpPanel(date: string, profile: LabProfile): LabPanel {
  return {
    id: uid("panel"),
    name: "Comprehensive Metabolic Panel",
    date,
    results: [
      createLabResult("Sodium", valueFromProfile(profile.sodium, [136, 142]), "mmol/L", "136-145", [136, 145], [126, 154]),
      createLabResult("Potassium", valueFromProfile(profile.potassium, [3.7, 5.0], 1), "mmol/L", "3.5-5.1", [3.5, 5.1], [2.8, 6.2], 1),
      createLabResult("Chloride", valueFromProfile(profile.chloride, [98, 108]), "mmol/L", "98-107", [98, 107], [88, 116]),
      createLabResult("CO2", valueFromProfile(profile.co2, [22, 31]), "mmol/L", "22-30", [22, 30], [14, 40]),
      createLabResult("BUN", valueFromProfile(profile.bun, [13, 24]), "mg/dL", "8-23", [8, 23], [3, 90]),
      createLabResult("Creatinine", valueFromProfile(profile.creatinine, [0.8, 1.2], 2), "mg/dL", "0.60-1.20", [0.6, 1.2], [0.2, 5.5], 2),
      createLabResult("Glucose", valueFromProfile(profile.glucose, [89, 118]), "mg/dL", "70-99", [70, 99], [45, 350]),
      createLabResult("Calcium", valueFromProfile(profile.calcium, [8.8, 9.9], 1), "mg/dL", "8.6-10.2", [8.6, 10.2], [7.2, 12], 1),
      createLabResult("Total Protein", pickValue([6.3, 7.9], 1), "g/dL", "6.0-8.3", [6.0, 8.3], [4.2, 9.5], 1),
      createLabResult("Albumin", valueFromProfile(profile.albumin, [3.6, 4.7], 1), "g/dL", "3.5-5.0", [3.5, 5.0], [2.0, 5.5], 1),
      createLabResult("Total Bilirubin", valueFromProfile(profile.bilirubin, [0.4, 1.0], 1), "mg/dL", "0.2-1.2", [0.2, 1.2], [0, 4.5], 1),
      createLabResult("Alkaline Phosphatase", valueFromProfile(profile.alkPhos, [72, 120]), "U/L", "40-129", [40, 129], [20, 350]),
      createLabResult("AST", valueFromProfile(profile.ast, [18, 35]), "U/L", "10-40", [10, 40], [5, 220]),
      createLabResult("ALT", valueFromProfile(profile.alt, [16, 38]), "U/L", "7-56", [7, 56], [5, 220]),
    ],
  };
}

function generateLipidPanel(date: string, profile: LabProfile): LabPanel {
  return {
    id: uid("panel"),
    name: "Lipid Panel",
    date,
    results: [
      createLabResult("Total Cholesterol", valueFromProfile(profile.totalCholesterol, [145, 228]), "mg/dL", "<200", [0, 199], [70, 350]),
      createLabResult("HDL", valueFromProfile(profile.hdl, [34, 60]), "mg/dL", ">40", [40, 100], [15, 120]),
      createLabResult("LDL", valueFromProfile(profile.ldl, [78, 138]), "mg/dL", "<100", [0, 99], [20, 250]),
      createLabResult("Triglycerides", valueFromProfile(profile.triglycerides, [110, 240]), "mg/dL", "<150", [0, 149], [40, 700]),
    ],
  };
}

function generateSpecificPanel(date: string, key: ScenarioDef["panelKeys"][number]): LabPanel {
  switch (key) {
    case "glycemic-renal":
      return {
        id: uid("panel"),
        name: "Diabetes / Renal Panel",
        date,
        results: [
          createLabResult("HbA1c", pickValue([7.2, 9.8], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("Estimated GFR", pickValue([36, 57]), "mL/min", ">60", [60, 140], [10, 200]),
          createLabResult("Urine Albumin/Creatinine Ratio", pickValue([80, 420]), "mg/g", "<30", [0, 29], [0, 1500]),
          createLabResult("Phosphorus", pickValue([3.4, 4.8], 1), "mg/dL", "2.5-4.5", [2.5, 4.5], [1.2, 8], 1),
        ],
      };
    case "bnp":
      return {
        id: uid("panel"),
        name: "Heart Failure Panel",
        date,
        results: [
          createLabResult("BNP", pickValue([210, 980]), "pg/mL", "<100", [0, 99], [0, 4000]),
          createLabResult("Magnesium", pickValue([1.7, 2.2], 1), "mg/dL", "1.7-2.4", [1.7, 2.4], [1, 4], 1),
          createLabResult("NT-proBNP", pickValue([900, 3600]), "pg/mL", "<300", [0, 299], [0, 8000]),
        ],
      };
    case "abg":
      return {
        id: uid("panel"),
        name: "Arterial Blood Gas",
        date,
        results: [
          createLabResult("pH", pickValue([7.34, 7.39], 2), "", "7.35-7.45", [7.35, 7.45], [7.1, 7.6], 2),
          createLabResult("pCO2", pickValue([47, 58]), "mmHg", "35-45", [35, 45], [20, 70]),
          createLabResult("pO2", pickValue([62, 76]), "mmHg", "80-100", [80, 100], [35, 140]),
          createLabResult("HCO3", pickValue([28, 34]), "mmol/L", "22-26", [22, 26], [10, 45]),
        ],
      };
    case "vascular-diabetes":
      return {
        id: uid("panel"),
        name: "Peripheral Vascular Risk Panel",
        date,
        results: [
          createLabResult("HbA1c", pickValue([7.1, 9.5], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("hs-CRP", pickValue([4.2, 12.6], 1), "mg/L", "<3.0", [0, 2.9], [0, 30], 1),
          createLabResult("Urine Albumin/Creatinine Ratio", pickValue([55, 330]), "mg/g", "<30", [0, 29], [0, 1500]),
        ],
      };
    case "thyroid-metabolic":
      return {
        id: uid("panel"),
        name: "Metabolic Screening Panel",
        date,
        results: [
          createLabResult("HbA1c", pickValue([6.7, 8.2], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("TSH", pickValue([3.2, 6.8], 2), "uIU/mL", "0.45-4.50", [0.45, 4.5], [0.05, 15], 2),
          createLabResult("Vitamin D 25-OH", pickValue([16, 29]), "ng/mL", "30-100", [30, 100], [5, 150]),
        ],
      };
    case "mood-medical":
      return {
        id: uid("panel"),
        name: "Mood / Medical Mimic Panel",
        date,
        results: [
          createLabResult("TSH", pickValue([2.6, 5.8], 2), "uIU/mL", "0.45-4.50", [0.45, 4.5], [0.05, 15], 2),
          createLabResult("Vitamin B12", pickValue([240, 460]), "pg/mL", "232-1245", [232, 1245], [80, 2000]),
          createLabResult("Vitamin D 25-OH", pickValue([18, 31]), "ng/mL", "30-100", [30, 100], [5, 150]),
        ],
      };
    case "dialysis-mineral":
      return {
        id: uid("panel"),
        name: "Dialysis Mineral / Anemia Panel",
        date,
        results: [
          createLabResult("Intact PTH", pickValue([360, 920]), "pg/mL", "15-65", [15, 65], [0, 1500]),
          createLabResult("Phosphorus", pickValue([4.8, 6.7], 1), "mg/dL", "2.5-4.5", [2.5, 4.5], [1.2, 10], 1),
          createLabResult("Ferritin", pickValue([290, 780]), "ng/mL", "30-400", [30, 400], [5, 2500]),
          createLabResult("Transferrin Saturation", pickValue([18, 28]), "%", "20-50", [20, 50], [5, 90]),
        ],
      };
    case "inflammatory":
      return {
        id: uid("panel"),
        name: "Inflammatory Activity Panel",
        date,
        results: [
          createLabResult("ESR", pickValue([32, 76]), "mm/hr", "0-20", [0, 20], [0, 140]),
          createLabResult("CRP", pickValue([1.8, 8.9], 1), "mg/dL", "<0.5", [0, 0.49], [0, 30], 1),
          createLabResult("Rheumatoid Factor", pickValue([48, 210]), "IU/mL", "<14", [0, 13], [0, 400]),
        ],
      };
    case "hepatic":
      return {
        id: uid("panel"),
        name: "Hepatic Function / Coagulation Panel",
        date,
        results: [
          createLabResult("INR", pickValue([1.5, 2.2], 2), "", "0.9-1.1", [0.9, 1.1], [0.6, 5], 2),
          createLabResult("Ammonia", pickValue([42, 96]), "umol/L", "15-45", [15, 45], [0, 180]),
          createLabResult("Direct Bilirubin", pickValue([0.7, 2.1], 1), "mg/dL", "0.0-0.3", [0, 0.3], [0, 7], 1),
          createLabResult("Albumin", pickValue([2.6, 3.4], 1), "g/dL", "3.5-5.0", [3.5, 5], [2, 5.5], 1),
        ],
      };
    case "heart-obesity":
      return {
        id: uid("panel"),
        name: "HFpEF / Metabolic Panel",
        date,
        results: [
          createLabResult("BNP", pickValue([140, 520]), "pg/mL", "<100", [0, 99], [0, 4000]),
          createLabResult("HbA1c", pickValue([7.0, 9.0], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("Urine Albumin/Creatinine Ratio", pickValue([65, 280]), "mg/g", "<30", [0, 29], [0, 1500]),
        ],
      };
    case "cognitive-nutrition":
      return {
        id: uid("panel"),
        name: "Cognitive / Nutrition Panel",
        date,
        results: [
          createLabResult("Vitamin B12", pickValue([185, 360]), "pg/mL", "232-1245", [232, 1245], [80, 2000]),
          createLabResult("Prealbumin", pickValue([12, 19]), "mg/dL", "17-34", [17, 34], [5, 50]),
          createLabResult("TSH", pickValue([2.0, 5.6], 2), "uIU/mL", "0.45-4.50", [0.45, 4.5], [0.05, 15], 2),
        ],
      };
    case "hiv":
      return {
        id: uid("panel"),
        name: "HIV Monitoring Panel",
        date,
        results: [
          createLabResult("HIV-1 RNA Viral Load", pickValue([20, 210]), "copies/mL", "<20", [0, 19], [0, 500000]),
          createLabResult("CD4 Count", pickValue([180, 460]), "cells/uL", "500-1500", [500, 1500], [0, 2000]),
          createLabResult("CD4 Percentage", pickValue([16, 24]), "%", "30-60", [30, 60], [0, 90]),
        ],
      };
    case "stroke-risk":
      return {
        id: uid("panel"),
        name: "Secondary Stroke Prevention Panel",
        date,
        results: [
          createLabResult("HbA1c", pickValue([6.9, 8.7], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("LDL Direct", pickValue([82, 144]), "mg/dL", "<70", [0, 69], [20, 250]),
          createLabResult("Homocysteine", pickValue([10, 18]), "umol/L", "5-15", [5, 15], [0, 60]),
        ],
      };
    case "wound-inflammatory":
      return {
        id: uid("panel"),
        name: "Wound / Inflammatory Panel",
        date,
        results: [
          createLabResult("HbA1c", pickValue([7.8, 10.4], 1), "%", "4.0-5.6", [4, 5.6], [3, 14], 1),
          createLabResult("ESR", pickValue([38, 92]), "mm/hr", "0-20", [0, 20], [0, 140]),
          createLabResult("CRP", pickValue([2.4, 11.8], 1), "mg/dL", "<0.5", [0, 0.49], [0, 30], 1),
        ],
      };
  }
}

function buildImagingReport(date: string, key: ImagingKey) {
  const template = imagingTemplateFor(key);
  return {
    id: uid("img"),
    type: template.type,
    date,
    indication: pick(template.indication),
    findings: pick(template.findings),
    impression: pick(template.impressions),
  };
}

function buildProblemList(scenario: ScenarioDef) {
  const problems = scenario.problems.map((problem, index) =>
    createProblem(problem, makeDateAdded(index)),
  );
  const extras = sample(
    commonProblemPool.filter(
      (extra) =>
        !scenario.problems.some((scenarioProblem) => scenarioProblem.diagnosis === extra.diagnosis),
    ),
    rand(2, 5),
  ).map((problem, index) => createProblem(problem, makeDateAdded(index + 5)));
  return [...problems, ...extras];
}

function buildPastMedicalHistory(scenario: ScenarioDef) {
  const generic = sample(
    [
      "Colonoscopy up to date per chart",
      "Remote tobacco exposure",
      "Influenza vaccination documented",
      "History of cataracts",
      "Remote knee arthroscopy",
      "Family history notable for hypertension and diabetes",
      "Uses cane or walker intermittently",
      "Pneumococcal vaccination reviewed",
    ],
    2,
  );
  return [...scenario.pastMedicalHistory, ...generic];
}

function buildMedicationList(scenario: ScenarioDef, provider: string) {
  const medications = scenario.medications.map((medication) =>
    buildMedication(medication, provider),
  );

  if (chance(0.2)) {
    sample(orphanMedicationPool, rand(1, 2)).forEach((medication) => {
      medications.push(buildMedication(medication, provider));
    });
  }

  return medications;
}

function buildEncounterDates(count: number) {
  let cursor = minusDays(new Date(), rand(4, 16));
  const dates: string[] = [];
  for (let index = 0; index < count; index += 1) {
    dates.push(fmtDate(cursor));
    cursor = minusDays(cursor, rand(18, 72));
  }
  return dates;
}

function buildEncounter(
  date: string,
  patient: Patient,
  scenario: ScenarioDef,
): Encounter {
  const template = pick(scenario.encounterTypes);
  const quality = pick<QualityLevel>(["good", "good", "fair", "fair", "poor"]);
  const contradiction = chance(0.26) ? pick(scenario.contradictions) : undefined;
  const incompletePlan = chance(0.34);
  const focusedTemplates = sample(
    scenario.problems,
    rand(3, Math.min(5, scenario.problems.length)),
  );
  const vitals = buildVitalRecord(date, scenario.vitalProfile, patient.gender);

  return {
    id: uid("enc"),
    date,
    type: template.type,
    provider: patient.provider,
    quality,
    chiefComplaint: pick(template.complaints),
    hpi: buildHpi(patient, scenario, template, focusedTemplates, quality, contradiction),
    reviewOfSystems: buildReviewOfSystems(scenario, quality),
    physicalExam: buildPhysicalExam(scenario, quality),
    vitals,
    assessmentPlan: buildAssessmentPlan(focusedTemplates, incompletePlan, contradiction),
    signatureTime: signatureTimeFor(date),
    billingCode: billingCodeFor(template.type, quality),
    contradictions: contradiction ? [contradiction.hpi, contradiction.ap] : [],
  };
}

function buildEncounterList(patient: Patient, scenario: ScenarioDef) {
  const encounterCount = rand(5, 15);
  return buildEncounterDates(encounterCount)
    .map((date) => buildEncounter(date, patient, scenario))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function buildLabPanels(scenario: ScenarioDef, encounterDates: string[]) {
  const labDates = encounterDates.filter((_, index) => index < 2 || chance(0.65));
  const panels: LabPanel[] = [];

  labDates.forEach((date, index) => {
    panels.push(generateCbcPanel(date, scenario.labProfile));
    panels.push(generateCmpPanel(date, scenario.labProfile));
    if (index < 2 || chance(0.55)) {
      panels.push(generateLipidPanel(date, scenario.labProfile));
    }
    if (index < 2) {
      scenario.panelKeys.forEach((key) => {
        panels.push(generateSpecificPanel(date, key));
      });
    } else if (chance(0.45)) {
      panels.push(generateSpecificPanel(date, pick(scenario.panelKeys)));
    }
  });

  return panels.sort((a, b) => b.date.localeCompare(a.date));
}

function buildImaging(scenario: ScenarioDef, encounterDates: string[]) {
  const reports = scenario.imagingKeys.map((key, index) => {
    const date =
      encounterDates[Math.min(index + 1, encounterDates.length - 1)] ??
      encounterDates[0];
    return buildImagingReport(date, key);
  });

  sample(encounterDates.slice(0, Math.min(4, encounterDates.length)), rand(1, 2)).forEach(
    (date) => {
      reports.push(buildAdditionalImaging(date));
    },
  );

  return reports.sort((a, b) => b.date.localeCompare(a.date));
}

function buildPatientShell(scenario: ScenarioDef): Patient {
  const gender = pick<PatientGender>(["Female", "Male"]);
  const firstName = gender === "Female" ? pick(femaleFirstNames) : pick(maleFirstNames);
  const lastName = pick(lastNames);
  const age = rand(55, 85);
  const provider = pick([...providers]);

  return {
    id: uid("patient"),
    firstName,
    lastName,
    initials: `${firstName[0]}${lastName[0]}`,
    age,
    gender,
    dob: calculateDob(age),
    mrn: `${rand(10, 99)}${rand(1000, 9999)}${rand(10, 99)}`,
    provider,
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    problems: [],
    encounters: [],
    medications: [],
    labs: [],
    vitals: [],
    imaging: [],
    pastMedicalHistory: [],
  };
}

export function generatePatient(): Patient {
  const scenario = pick(scenarios);
  const patient = buildPatientShell(scenario);
  const problems = buildProblemList(scenario);
  const encounters = buildEncounterList(patient, scenario);
  const encounterDates = encounters.map((encounter) => encounter.date);
  const labs = buildLabPanels(scenario, encounterDates);
  const imaging = buildImaging(scenario, encounterDates);

  return {
    ...patient,
    problems,
    encounters,
    medications: buildMedicationList(scenario, patient.provider),
    labs,
    vitals: encounters.map((encounter) => encounter.vitals),
    imaging,
    pastMedicalHistory: buildPastMedicalHistory(scenario),
  };
}

export const scenarioNames = scenarios.map((scenario) => scenario.name);

export function formatEncounterQuality(quality: QualityLevel) {
  return quality.charAt(0).toUpperCase() + quality.slice(1);
}

export function sourceLabelForEncounter(date: string) {
  return `Encounters - ${date}`;
}

export function sourceLabelForLab(name: string, date: string) {
  return `Labs - ${name} - ${date}`;
}

export function sourceLabelForVital(date: string) {
  return `Vitals - ${date}`;
}

export function sourceLabelForImaging(type: string, date: string) {
  return `Imaging - ${type} - ${date}`;
}
