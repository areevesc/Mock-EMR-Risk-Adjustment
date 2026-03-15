import type { ScenarioDef } from "@/lib/generator/types";

export const scenariosB: ScenarioDef[] = [
  {
    id: "ra-lung",
    name: "Rheumatoid Arthritis + Lung Disease",
    summary:
      "rheumatoid arthritis with interstitial lung disease, osteoporosis, chronic pain, and GERD",
    problems: [
      {
        diagnosis:
          "Rheumatoid arthritis with rheumatoid factor of multiple sites without organ involvement",
        code: "M05.79",
        isHCC: true,
        hpiPhrases: [
          "morning stiffness lasts more than an hour on bad days",
          "hand and wrist pain fluctuate despite disease-modifying therapy",
        ],
        planPhrases: [
          "continue DMARD therapy with rheumatology monitoring",
          "track inflammatory markers and reinforce joint protection strategies",
        ],
      },
      {
        diagnosis: "Interstitial lung disease",
        code: "J84.9",
        isHCC: true,
        hpiPhrases: [
          "exertional dyspnea remains stable but limits longer walks",
          "dry cough persists without fever or purulent sputum",
        ],
        planPhrases: [
          "continue pulmonary follow-up and monitor oxygen needs",
          "review return precautions for worsening dyspnea",
        ],
      },
      {
        diagnosis: "Age-related osteoporosis",
        code: "M81.0",
        isHCC: false,
        hpiPhrases: ["bone density remains a concern due to chronic inflammation and prior steroid use"],
        planPhrases: ["continue osteoporosis treatment and fall precautions"],
      },
      {
        diagnosis: "Chronic pain syndrome",
        code: "G89.4",
        isHCC: true,
        hpiPhrases: ["diffuse joint pain affects sleep and function"],
        planPhrases: ["continue multimodal pain plan and activity pacing"],
      },
      {
        diagnosis: "GERD",
        code: "K21.9",
        isHCC: false,
        hpiPhrases: ["reflux symptoms remain controlled on medication"],
        planPhrases: ["continue reflux precautions"],
      },
    ],
    medications: [
      { name: "Methotrexate (Trexall)", dose: "15 mg", frequency: "weekly", route: "PO" },
      { name: "Folic acid (Folvite)", dose: "1 mg", frequency: "daily", route: "PO" },
      { name: "Prednisone (Deltasone)", dose: "5 mg", frequency: "daily", route: "PO" },
      { name: "Alendronate (Fosamax)", dose: "70 mg", frequency: "weekly", route: "PO" },
      { name: "Omeprazole (Prilosec)", dose: "20 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Rheumatology follow-up",
        complaints: ["joint pain follow-up", "stiffness and breathing review"],
        purpose: ["Rheumatology follow-up with lung disease review"],
      },
      {
        type: "Pulmonary comanagement",
        complaints: ["shortness of breath review", "ILD surveillance"],
        purpose: ["Pulmonary / rheumatology comanagement visit"],
      },
      {
        type: "Medication management",
        complaints: ["DMARD monitoring", "pain and reflux review"],
        purpose: ["Medication and disease activity follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Rheumatoid arthritis",
      "Interstitial lung disease",
      "Osteoporosis",
      "Chronic pain syndrome",
      "GERD",
      "Remote wrist fracture",
    ],
    positiveRos: [
      "Morning stiffness and hand pain are reported.",
      "Dry cough and exertional dyspnea persist.",
      "No fever or purulent sputum.",
      "Fatigue worsens during inflammatory flares.",
    ],
    positiveExam: [
      "Tenderness and ulnar deviation are present at the MCP joints.",
      "Fine bibasilar crackles are audible.",
      "No acute synovitis of the knees today.",
    ],
    vitalProfile: {
      systolic: [118, 150],
      diastolic: [66, 88],
      heartRate: [68, 94],
      temperature: [97.0, 99.1],
      weight: [108, 192],
      height: [58, 74],
      oxygenSaturation: [91, 97],
    },
    labProfile: {
      hemoglobin: [10.6, 12.8],
      wbc: [4.0, 9.2],
      albumin: [3.3, 4.2],
    },
    panelKeys: ["inflammatory"],
    imagingKeys: ["hrct"],
    contradictions: [
      {
        hpi: "The HPI documents rheumatoid arthritis with active morning stiffness",
        ap: "Osteoarthritis only",
      },
      {
        hpi: "The patient reports chronic interstitial lung disease with dry cough",
        ap: "Acute bacterial pneumonia",
      },
    ],
  },
  {
    id: "cirrhosis",
    name: "Cirrhosis",
    summary:
      "alcoholic cirrhosis with hepatic encephalopathy, ascites, esophageal varices, and coagulopathy",
    problems: [
      {
        diagnosis: "Alcoholic cirrhosis of liver without ascites",
        code: "K70.30",
        isHCC: true,
        hpiPhrases: [
          "has chronic liver disease with fluctuating abdominal distention and fatigue",
          "remains abstinent by report but requires close monitoring",
        ],
        planPhrases: [
          "continue hepatology surveillance and sodium restriction",
          "review strict alcohol avoidance and monitoring labs",
        ],
      },
      {
        diagnosis: "Hepatic encephalopathy",
        code: "K76.82",
        isHCC: true,
        hpiPhrases: [
          "family notes intermittent forgetfulness that improves with lactulose adherence",
          "bowel movement goal was reviewed in detail",
        ],
        planPhrases: [
          "continue lactulose and rifaximin with titration to bowel movement goal",
          "monitor for worsening confusion and caregiver concerns",
        ],
      },
      {
        diagnosis: "Ascites",
        code: "R18.8",
        isHCC: true,
        hpiPhrases: [
          "abdominal fullness and early satiety fluctuate with diuretic adherence",
          "no spontaneous bacterial peritonitis symptoms are reported",
        ],
        planPhrases: [
          "continue diuretics and low-sodium diet; monitor weight and girth",
          "consider repeat paracentesis if distention worsens",
        ],
      },
      {
        diagnosis: "Esophageal varices without bleeding",
        code: "I85.00",
        isHCC: true,
        hpiPhrases: ["no hematemesis or melena is reported"],
        planPhrases: ["continue nonselective beta blocker and GI surveillance"],
      },
      {
        diagnosis: "Coagulation defect",
        code: "D68.9",
        isHCC: true,
        hpiPhrases: ["easy bruising is unchanged from baseline"],
        planPhrases: ["monitor coagulation profile and bleeding symptoms"],
      },
    ],
    medications: [
      { name: "Lactulose (Constulose)", dose: "30 mL", frequency: "TID", route: "PO" },
      { name: "Rifaximin (Xifaxan)", dose: "550 mg", frequency: "BID", route: "PO" },
      { name: "Spironolactone (Aldactone)", dose: "100 mg", frequency: "daily", route: "PO" },
      { name: "Furosemide (Lasix)", dose: "40 mg", frequency: "daily", route: "PO" },
      { name: "Nadolol (Corgard)", dose: "20 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Hepatology follow-up",
        complaints: ["cirrhosis follow-up", "abdominal distention review", "confusion follow-up"],
        purpose: ["Cirrhosis management follow-up"],
      },
      {
        type: "Post-hospital follow-up",
        complaints: ["recent hepatic encephalopathy admission follow-up", "ascites review"],
        purpose: ["Post-discharge liver disease reassessment"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["fatigue and medication review", "lab follow-up"],
        purpose: ["Interval chronic liver disease follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Alcohol-related cirrhosis",
      "Hepatic encephalopathy",
      "Ascites",
      "Esophageal varices",
      "Remote alcohol use disorder",
      "Umbilical hernia repair",
    ],
    positiveRos: [
      "Reports abdominal fullness and fatigue.",
      "Intermittent forgetfulness improves with lactulose.",
      "No hematemesis or melena today.",
      "Appetite is reduced with early satiety.",
    ],
    positiveExam: [
      "Abdomen is softly distended with fluid wave.",
      "Mild scleral icterus is present.",
      "No asterixis is noted on today's exam.",
    ],
    vitalProfile: {
      systolic: [102, 138],
      diastolic: [58, 82],
      heartRate: [64, 92],
      temperature: [97.3, 99.2],
      weight: [132, 216],
      height: [59, 74],
      oxygenSaturation: [94, 99],
    },
    labProfile: {
      albumin: [2.5, 3.4],
      bilirubin: [1.8, 3.8],
      alkPhos: [120, 210],
      ast: [48, 102],
      alt: [38, 74],
      platelets: [78, 132],
      sodium: [128, 136],
    },
    panelKeys: ["hepatic"],
    imagingKeys: ["liver-us"],
    contradictions: [
      {
        hpi: "The HPI notes alcoholic cirrhosis with encephalopathy and ascites",
        ap: "Fatty liver without cirrhosis",
      },
      {
        hpi: "Family describes intermittent confusion responsive to lactulose",
        ap: "No history of hepatic encephalopathy",
      },
    ],
  },
  {
    id: "hfpef-obesity",
    name: "HFpEF + Morbid Obesity",
    summary:
      "heart failure with preserved ejection fraction combined with severe obesity, OSA, diabetes with complications, and venous stasis",
    problems: [
      {
        diagnosis: "Heart failure with preserved ejection fraction",
        code: "I50.30",
        isHCC: true,
        hpiPhrases: [
          "exertional dyspnea and edema fluctuate with dietary indiscretion",
          "weight is difficult to interpret because of chronic obesity and volume status",
        ],
        planPhrases: [
          "continue diuretic regimen, sodium restriction, and symptom surveillance",
          "review weight monitoring and cardiology follow-up",
        ],
      },
      {
        diagnosis: "Morbid obesity due to excess calories",
        code: "E66.01",
        isHCC: true,
        hpiPhrases: ["weight remains significantly above goal with limited mobility"],
        planPhrases: ["continue weight management counseling and monitor activity tolerance"],
      },
      {
        diagnosis: "Obstructive sleep apnea",
        code: "G47.33",
        isHCC: false,
        hpiPhrases: ["CPAP use is inconsistent"],
        planPhrases: ["reinforce nightly CPAP use"],
      },
      {
        diagnosis: "Type 2 diabetes mellitus with diabetic polyneuropathy",
        code: "E11.42",
        isHCC: true,
        hpiPhrases: ["foot numbness persists and sugars remain above goal"],
        planPhrases: ["continue diabetes management and foot care"],
      },
      {
        diagnosis: "Venous stasis dermatitis",
        code: "I87.2",
        isHCC: false,
        hpiPhrases: ["lower leg swelling and skin discoloration are chronic"],
        planPhrases: ["compression, elevation, and skin care reviewed"],
      },
    ],
    medications: [
      { name: "Torsemide (Demadex)", dose: "20 mg", frequency: "daily", route: "PO" },
      { name: "Spironolactone (Aldactone)", dose: "25 mg", frequency: "daily", route: "PO" },
      { name: "Semaglutide (Ozempic)", dose: "1 mg", frequency: "weekly", route: "SC" },
      { name: "Metformin (Glucophage)", dose: "500 mg", frequency: "BID", route: "PO" },
      { name: "Gabapentin (Neurontin)", dose: "300 mg", frequency: "TID", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Cardiometabolic follow-up",
        complaints: ["shortness of breath and edema follow-up", "weight review"],
        purpose: ["HFpEF and obesity follow-up"],
      },
      {
        type: "Annual wellness visit",
        complaints: ["annual exam", "cardiometabolic review"],
        purpose: ["Annual wellness visit with HFpEF review"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["diabetes and edema review", "sleep apnea follow-up"],
        purpose: ["Complex cardiometabolic follow-up"],
      },
    ],
    pastMedicalHistory: [
      "HFpEF",
      "Morbid obesity",
      "Obstructive sleep apnea",
      "Type 2 diabetes mellitus with neuropathy",
      "Venous stasis",
      "Remote C-section",
    ],
    positiveRos: [
      "Reports exertional dyspnea and chronic lower extremity edema.",
      "Foot numbness persists.",
      "Daytime sleepiness continues with poor CPAP adherence.",
      "No chest pain today.",
    ],
    positiveExam: [
      "1+ bilateral pitting edema with chronic venous stasis changes.",
      "Cardiopulmonary exam without acute distress.",
      "Diminished distal sensation at the feet.",
    ],
    vitalProfile: {
      systolic: [132, 166],
      diastolic: [72, 96],
      heartRate: [72, 96],
      temperature: [97.2, 99.0],
      weight: [260, 356],
      height: [59, 74],
      oxygenSaturation: [91, 97],
    },
    labProfile: {
      glucose: [126, 220],
      bun: [20, 34],
      creatinine: [0.9, 1.4],
      hdl: [28, 42],
      triglycerides: [170, 290],
    },
    panelKeys: ["heart-obesity"],
    imagingKeys: ["venous-duplex"],
    contradictions: [
      {
        hpi: "The HPI documents HFpEF with chronic edema",
        ap: "No history of heart failure",
      },
      {
        hpi: "Diabetic neuropathy is noted in the feet",
        ap: "Type 2 diabetes without complications",
      },
    ],
  },
  {
    id: "dementia",
    name: "Dementia + Multiple Chronic",
    summary:
      "vascular dementia with CHF, diabetes with complications, recurrent falls, and malnutrition",
    problems: [
      {
        diagnosis: "Vascular dementia without behavioral disturbance",
        code: "F01.50",
        isHCC: true,
        hpiPhrases: [
          "caregiver reports ongoing short-term memory impairment and missed medications",
          "orientation fluctuates more when the patient is tired",
        ],
        planPhrases: [
          "continue caregiver-supported medication administration and safety planning",
          "review fall prevention, nutrition, and advance care planning",
        ],
      },
      {
        diagnosis: "Heart failure with reduced ejection fraction",
        code: "I50.20",
        isHCC: true,
        hpiPhrases: ["breathing is stable but stamina remains poor"],
        planPhrases: ["continue heart failure therapy and daily weights"],
      },
      {
        diagnosis: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        code: "E11.22",
        isHCC: true,
        hpiPhrases: ["glucose monitoring depends on family support"],
        planPhrases: ["continue simplified diabetes regimen and renal monitoring"],
      },
      {
        diagnosis: "History of falling",
        code: "Z91.81",
        isHCC: false,
        hpiPhrases: ["has had recurrent near-falls and unsteady gait"],
        planPhrases: ["continue walker use and home safety measures"],
      },
      {
        diagnosis: "Protein-calorie malnutrition",
        code: "E46",
        isHCC: true,
        hpiPhrases: ["appetite is poor and weight has trended down"],
        planPhrases: ["nutrition support and supplement use reviewed with caregiver"],
      },
    ],
    medications: [
      { name: "Donepezil (Aricept)", dose: "10 mg", frequency: "nightly", route: "PO" },
      { name: "Carvedilol (Coreg)", dose: "12.5 mg", frequency: "BID", route: "PO" },
      { name: "Insulin glargine (Lantus)", dose: "12 units", frequency: "nightly", route: "SC" },
      { name: "Furosemide (Lasix)", dose: "20 mg", frequency: "daily", route: "PO" },
      { name: "Nutritional supplement (Glucerna)", dose: "1 bottle", frequency: "BID", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Caregiver-assisted follow-up",
        complaints: ["memory follow-up", "falls and nutrition review"],
        purpose: ["Caregiver-assisted chronic disease follow-up"],
      },
      {
        type: "Annual wellness visit",
        complaints: ["annual exam", "dementia and fall risk review"],
        purpose: ["Annual wellness visit with cognitive review"],
      },
      {
        type: "Post-hospital follow-up",
        complaints: ["recent fall follow-up", "medication reconciliation"],
        purpose: ["Post-acute follow-up after fall or CHF flare"],
      },
    ],
    pastMedicalHistory: [
      "Vascular dementia",
      "HFrEF",
      "Type 2 diabetes mellitus with CKD",
      "Recurrent falls",
      "Protein-calorie malnutrition",
      "Remote ischemic stroke",
    ],
    positiveRos: [
      "Caregiver reports short-term memory loss and confusion.",
      "Unsteady gait and poor appetite are noted.",
      "No acute chest pain or fever.",
      "Energy and intake remain low.",
    ],
    positiveExam: [
      "Patient is pleasant but relies on caregiver for details.",
      "Gait is slow and cautious with walker.",
      "Temporal wasting and low body mass are noted.",
    ],
    vitalProfile: {
      systolic: [118, 154],
      diastolic: [64, 88],
      heartRate: [68, 94],
      temperature: [97.0, 99.0],
      weight: [96, 168],
      height: [58, 74],
      oxygenSaturation: [93, 98],
    },
    labProfile: {
      glucose: [116, 206],
      creatinine: [1.0, 1.6],
      albumin: [2.9, 3.6],
      hemoglobin: [10.4, 12.6],
    },
    panelKeys: ["cognitive-nutrition"],
    imagingKeys: ["brain-mri"],
    contradictions: [
      {
        hpi: "The HPI states vascular dementia with caregiver dependence",
        ap: "Memory complaints only, no dementia diagnosis",
      },
      {
        hpi: "Poor appetite and weight loss are described",
        ap: "Well-nourished without nutritional concerns",
      },
    ],
  },
  {
    id: "hiv",
    name: "HIV/AIDS",
    summary:
      "HIV disease on ART with lipodystrophy, chronic kidney disease, and neuropathy",
    problems: [
      {
        diagnosis: "Human immunodeficiency virus [HIV] disease",
        code: "B20",
        isHCC: true,
        hpiPhrases: [
          "remains on antiretroviral therapy with occasional missed doses",
          "denies recent opportunistic infection symptoms",
        ],
        planPhrases: [
          "continue ART and monitor viral load/CD4 count",
          "reinforce adherence and infectious disease follow-up",
        ],
      },
      {
        diagnosis: "Lipodystrophy",
        code: "E88.1",
        isHCC: false,
        hpiPhrases: ["body habitus changes remain bothersome but stable"],
        planPhrases: ["continue monitoring and supportive counseling"],
      },
      {
        diagnosis: "Chronic kidney disease, stage 3a",
        code: "N18.31",
        isHCC: true,
        hpiPhrases: ["renal function is monitored given long-term medication exposure"],
        planPhrases: ["trend renal function and avoid nephrotoxins"],
      },
      {
        diagnosis: "Polyneuropathy",
        code: "G62.9",
        isHCC: true,
        hpiPhrases: ["burning foot pain remains chronic but tolerable on medication"],
        planPhrases: ["continue neuropathy management and foot care"],
      },
      {
        diagnosis: "Hyperlipidemia",
        code: "E78.5",
        isHCC: false,
        hpiPhrases: ["lipids remain elevated on prior labs"],
        planPhrases: ["continue statin therapy and diet modification"],
      },
    ],
    medications: [
      {
        name: "Bictegravir/emtricitabine/tenofovir alafenamide (Biktarvy)",
        dose: "1 tablet",
        frequency: "daily",
        route: "PO",
      },
      { name: "Atorvastatin (Lipitor)", dose: "20 mg", frequency: "nightly", route: "PO" },
      { name: "Gabapentin (Neurontin)", dose: "300 mg", frequency: "TID", route: "PO" },
      { name: "Lisinopril (Prinivil)", dose: "10 mg", frequency: "daily", route: "PO" },
      { name: "Vitamin B complex (Nephrocap)", dose: "1 capsule", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Infectious disease follow-up",
        complaints: ["HIV follow-up", "lab review", "neuropathy follow-up"],
        purpose: ["HIV monitoring visit"],
      },
      {
        type: "Medication management",
        complaints: ["ART medication check", "adherence review"],
        purpose: ["Antiretroviral therapy follow-up"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["chronic kidney disease and HIV review", "lipid follow-up"],
        purpose: ["Integrated HIV primary care visit"],
      },
    ],
    pastMedicalHistory: [
      "HIV disease",
      "ART-associated lipodystrophy",
      "CKD stage 3",
      "Peripheral neuropathy",
      "Hyperlipidemia",
      "Remote shingles",
    ],
    positiveRos: [
      "Reports chronic neuropathic foot pain.",
      "No fevers, night sweats, or weight loss.",
      "Medication adherence is imperfect on some weekends.",
      "No recent opportunistic infection symptoms.",
    ],
    positiveExam: [
      "Distal sensory loss is present in both feet.",
      "No oral thrush or acute lymphadenopathy.",
      "Body habitus demonstrates chronic lipodystrophic change.",
    ],
    vitalProfile: {
      systolic: [118, 148],
      diastolic: [66, 90],
      heartRate: [70, 94],
      temperature: [97.0, 99.0],
      weight: [124, 216],
      height: [59, 75],
      oxygenSaturation: [95, 99],
    },
    labProfile: {
      creatinine: [1.0, 1.6],
      ldl: [90, 144],
      wbc: [3.6, 6.8],
      lymphocytes: [14, 28],
    },
    panelKeys: ["hiv"],
    imagingKeys: ["hiv-neuro"],
    contradictions: [
      {
        hpi: "The HPI confirms HIV disease on ART",
        ap: "HIV antibody positive only, not disease",
      },
      {
        hpi: "Chronic neuropathy is described in both feet",
        ap: "No neuropathy",
      },
    ],
  },
  {
    id: "hemiplegia",
    name: "Hemiplegia",
    summary:
      "hemiplegia following cerebral infarction with spasticity, dysphagia, neurogenic bladder, and depression",
    problems: [
      {
        diagnosis:
          "Hemiplegia and hemiparesis following cerebral infarction affecting right dominant side",
        code: "I69.351",
        isHCC: true,
        hpiPhrases: [
          "right-sided weakness remains stable but limits transfers and fine motor tasks",
          "continues home exercises with caregiver support",
        ],
        planPhrases: [
          "continue therapy exercises, fall precautions, and assistive device use",
          "monitor for skin breakdown and functional decline",
        ],
      },
      {
        diagnosis: "Spastic hemiplegia affecting right dominant side",
        code: "G81.11",
        isHCC: true,
        hpiPhrases: ["spasticity causes stiffness in the arm and leg, worse in the evening"],
        planPhrases: ["continue antispasmodic therapy and stretching program"],
      },
      {
        diagnosis: "Dysphagia following cerebral infarction",
        code: "I69.391",
        isHCC: true,
        hpiPhrases: ["still coughs occasionally with thin liquids"],
        planPhrases: ["continue modified diet and swallow precautions"],
      },
      {
        diagnosis: "Neurogenic bladder",
        code: "N31.9",
        isHCC: false,
        hpiPhrases: ["urinary urgency and occasional incontinence persist"],
        planPhrases: ["timed voiding and bladder regimen reviewed"],
      },
      {
        diagnosis: "Major depressive disorder, recurrent, moderate",
        code: "F33.1",
        isHCC: true,
        hpiPhrases: ["mood remains low due to chronic disability"],
        planPhrases: ["continue antidepressant therapy and support resources"],
      },
    ],
    medications: [
      { name: "Baclofen (Lioresal)", dose: "10 mg", frequency: "TID", route: "PO" },
      { name: "Sertraline (Zoloft)", dose: "50 mg", frequency: "daily", route: "PO" },
      { name: "Aspirin (Ecotrin)", dose: "81 mg", frequency: "daily", route: "PO" },
      { name: "Atorvastatin (Lipitor)", dose: "40 mg", frequency: "nightly", route: "PO" },
      { name: "Oxybutynin (Ditropan XL)", dose: "5 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Neurology follow-up",
        complaints: ["stroke follow-up", "spasticity review", "swallowing follow-up"],
        purpose: ["Post-stroke neurologic follow-up"],
      },
      {
        type: "Rehab medicine follow-up",
        complaints: ["mobility follow-up", "caregiver concerns"],
        purpose: ["Functional status and rehab follow-up"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["depression and neurogenic bladder review", "medication management"],
        purpose: ["Complex post-stroke primary care follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Cerebral infarction with residual right hemiplegia",
      "Dysphagia",
      "Neurogenic bladder",
      "Depression",
      "Hyperlipidemia",
      "PEG tube removed after recovery phase",
    ],
    positiveRos: [
      "Right-sided weakness and stiffness remain chronic.",
      "Occasional coughing with thin liquids.",
      "Urinary urgency and mood symptoms are ongoing.",
      "No new focal neurologic deficit reported.",
    ],
    positiveExam: [
      "Right upper and lower extremity weakness with increased tone.",
      "Speech is clear though slowed.",
      "Gait requires assistive device and supervision.",
    ],
    vitalProfile: {
      systolic: [118, 152],
      diastolic: [66, 90],
      heartRate: [64, 90],
      temperature: [97.0, 99.0],
      weight: [118, 210],
      height: [59, 75],
      oxygenSaturation: [94, 99],
    },
    labProfile: {
      glucose: [90, 154],
      ldl: [82, 138],
    },
    panelKeys: ["stroke-risk"],
    imagingKeys: ["swallow-study"],
    contradictions: [
      {
        hpi: "The HPI documents chronic right-sided hemiplegia after stroke",
        ap: "Left-sided weakness after TIA only",
      },
      {
        hpi: "Dysphagia with thin liquids is described",
        ap: "Swallowing normal",
      },
    ],
  },
  {
    id: "amputation",
    name: "Lower Extremity Amputation",
    summary:
      "below-knee amputation with diabetes, peripheral angiopathy with gangrene history, phantom limb pain, PAD, and CKD",
    problems: [
      {
        diagnosis: "Acquired absence of left leg below knee",
        code: "Z89.512",
        isHCC: true,
        hpiPhrases: [
          "phantom pain remains intermittent and worsens at night",
          "stump skin is monitored closely and currently without drainage",
        ],
        planPhrases: [
          "continue prosthetic and stump care with phantom pain regimen",
          "review skin checks and PM&R follow-up",
        ],
      },
      {
        diagnosis:
          "Type 2 diabetes mellitus with diabetic peripheral angiopathy with gangrene",
        code: "E11.52",
        isHCC: true,
        hpiPhrases: [
          "glucose control remains suboptimal with prior gangrene history reviewed",
          "denies new ulceration of the remaining foot",
        ],
        planPhrases: [
          "intensify diabetes control and continue daily foot surveillance",
          "podiatry follow-up for the remaining foot was reinforced",
        ],
      },
      {
        diagnosis: "Phantom limb syndrome with pain",
        code: "G54.6",
        isHCC: true,
        hpiPhrases: ["phantom pain causes sleep interruption several nights per week"],
        planPhrases: ["continue neuropathic pain management and stretching"],
      },
      {
        diagnosis: "Peripheral artery disease",
        code: "I73.9",
        isHCC: true,
        hpiPhrases: ["circulation to the remaining limb remains under surveillance"],
        planPhrases: ["continue vascular risk reduction and antiplatelet therapy"],
      },
      {
        diagnosis: "Chronic kidney disease, stage 3a",
        code: "N18.31",
        isHCC: true,
        hpiPhrases: ["renal function remains mildly reduced but stable"],
        planPhrases: ["repeat renal labs and avoid nephrotoxins"],
      },
    ],
    medications: [
      { name: "Insulin glargine (Lantus)", dose: "20 units", frequency: "nightly", route: "SC" },
      { name: "Clopidogrel (Plavix)", dose: "75 mg", frequency: "daily", route: "PO" },
      { name: "Gabapentin (Neurontin)", dose: "400 mg", frequency: "TID", route: "PO" },
      { name: "Rosuvastatin (Crestor)", dose: "20 mg", frequency: "nightly", route: "PO" },
      { name: "Lisinopril (Prinivil)", dose: "10 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Wound / prosthetic follow-up",
        complaints: ["stump follow-up", "phantom pain review", "diabetes follow-up"],
        purpose: ["Amputation and prosthetic care follow-up"],
      },
      {
        type: "Vascular follow-up",
        complaints: ["circulation follow-up", "remaining foot surveillance"],
        purpose: ["PAD and diabetes follow-up after amputation"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["pain and diabetes review", "lab follow-up"],
        purpose: ["Complex chronic disease follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Left below-knee amputation",
      "Diabetes with prior gangrene",
      "Peripheral artery disease",
      "Chronic kidney disease",
      "Phantom limb pain",
      "Prior transmetatarsal wound infection",
    ],
    positiveRos: [
      "Reports phantom limb pain and mobility limitations.",
      "No new drainage or fever.",
      "Blood sugars remain variably controlled.",
      "Remaining foot is checked daily by the patient or family.",
    ],
    positiveExam: [
      "Left below-knee amputation stump is healed without drainage.",
      "Remaining right foot has diminished pulses but intact skin today.",
      "Mobility uses prosthesis and assistive device.",
    ],
    vitalProfile: {
      systolic: [126, 160],
      diastolic: [70, 94],
      heartRate: [70, 96],
      temperature: [97.0, 99.2],
      weight: [128, 226],
      height: [59, 76],
      oxygenSaturation: [94, 99],
    },
    labProfile: {
      glucose: [138, 240],
      creatinine: [1.0, 1.7],
      ldl: [92, 146],
      hemoglobin: [10.8, 13.6],
    },
    panelKeys: ["wound-inflammatory"],
    imagingKeys: ["amputation-xray"],
    contradictions: [
      {
        hpi: "The HPI references prior gangrene and below-knee amputation",
        ap: "No amputation history",
      },
      {
        hpi: "Phantom limb pain is described as ongoing",
        ap: "Pain resolved",
      },
    ],
  },
];
