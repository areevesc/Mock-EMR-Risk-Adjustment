import type { ImagingReport } from "@/types/patient";
import type { ImagingKey, ProblemTemplate } from "@/lib/generator/types";

export const providers = [
  "Dr. Amelia Patel",
  "Dr. Samuel Brooks",
  "Dr. Hannah Nguyen",
  "Dr. Daniel Rivera",
  "Dr. Priya Shah",
  "Dr. Michael Chen",
  "Dr. Elena Torres",
  "Dr. Sophia Bennett",
] as const;

export const femaleFirstNames = [
  "Mary",
  "Linda",
  "Patricia",
  "Barbara",
  "Jennifer",
  "Susan",
  "Karen",
  "Nancy",
  "Lisa",
  "Donna",
  "Sandra",
  "Deborah",
  "Cynthia",
  "Helen",
  "Diane",
  "Carol",
  "Ruth",
  "Sharon",
  "Angela",
  "Brenda",
];

export const maleFirstNames = [
  "James",
  "Robert",
  "John",
  "Michael",
  "William",
  "David",
  "Richard",
  "Joseph",
  "Thomas",
  "Charles",
  "Christopher",
  "Daniel",
  "Matthew",
  "Anthony",
  "Mark",
  "Donald",
  "Steven",
  "Paul",
  "Andrew",
  "Kenneth",
];

export const lastNames = [
  "Anderson",
  "Baker",
  "Campbell",
  "Davis",
  "Edwards",
  "Foster",
  "Gonzalez",
  "Harris",
  "Jackson",
  "Kim",
  "Lopez",
  "Martinez",
  "Miller",
  "Moore",
  "Nguyen",
  "Parker",
  "Robinson",
  "Smith",
  "Turner",
  "Wilson",
];

export const commonProblemPool: ProblemTemplate[] = [
  {
    diagnosis: "Essential hypertension",
    code: "I10",
    isHCC: false,
    hpiPhrases: [
      "home blood pressure readings remain intermittently elevated",
      "continues antihypertensive therapy with fair adherence",
    ],
    planPhrases: [
      "continue current blood pressure regimen and reinforce sodium restriction",
      "review home BP log and titrate therapy if readings remain above goal",
    ],
  },
  {
    diagnosis: "Hyperlipidemia",
    code: "E78.5",
    isHCC: false,
    hpiPhrases: [
      "remains on statin therapy without myalgias",
      "lipid management discussed with focus on diet and adherence",
    ],
    planPhrases: [
      "continue statin and repeat lipid panel with next routine labs",
      "reinforce Mediterranean-style diet and medication adherence",
    ],
  },
  {
    diagnosis: "GERD",
    code: "K21.9",
    isHCC: false,
    hpiPhrases: [
      "heartburn is controlled on current acid suppression",
      "denies dysphagia or GI bleeding symptoms",
    ],
    planPhrases: [
      "continue proton pump inhibitor and reflux precautions",
      "avoid late meals and trigger foods",
    ],
  },
  {
    diagnosis: "Osteoarthritis",
    code: "M19.90",
    isHCC: false,
    hpiPhrases: [
      "reports chronic joint stiffness worse after prolonged activity",
      "pain remains manageable with topical therapy and pacing",
    ],
    planPhrases: [
      "continue topical analgesics and low-impact exercise program",
      "avoid chronic NSAID use given comorbid risk profile",
    ],
  },
  {
    diagnosis: "Peripheral neuropathy",
    code: "G62.9",
    isHCC: false,
    hpiPhrases: [
      "notes chronic burning discomfort in the feet",
      "denies new weakness but has persistent sensory symptoms",
    ],
    planPhrases: [
      "continue neuropathic pain regimen and foot surveillance",
      "review fall prevention and daily skin inspection",
    ],
  },
  {
    diagnosis: "Vitamin D deficiency",
    code: "E55.9",
    isHCC: false,
    hpiPhrases: [
      "is taking vitamin D supplementation inconsistently",
      "bone health reviewed during the visit",
    ],
    planPhrases: [
      "continue supplementation and recheck level with future labs",
      "review calcium intake and weight-bearing activity",
    ],
  },
  {
    diagnosis: "Chronic low back pain",
    code: "M54.50",
    isHCC: false,
    hpiPhrases: [
      "chronic back pain is stable without radicular progression",
      "functional limitations remain mild to moderate",
    ],
    planPhrases: [
      "continue conservative management and stretching regimen",
      "avoid escalation to sedating medications where possible",
    ],
  },
];

export const orphanMedicationPool = [
  {
    name: "Allopurinol (Zyloprim)",
    dose: "100 mg",
    frequency: "daily",
    route: "PO",
  },
  {
    name: "Tamsulosin (Flomax)",
    dose: "0.4 mg",
    frequency: "nightly",
    route: "PO",
  },
  {
    name: "Montelukast (Singulair)",
    dose: "10 mg",
    frequency: "nightly",
    route: "PO",
  },
  {
    name: "Oxybutynin (Ditropan XL)",
    dose: "10 mg",
    frequency: "daily",
    route: "PO",
  },
  {
    name: "Ferrous sulfate (Feosol)",
    dose: "325 mg",
    frequency: "daily",
    route: "PO",
  },
];

export const rosSystems = [
  "Constitutional",
  "Eyes",
  "ENT",
  "Cardiovascular",
  "Respiratory",
  "Gastrointestinal",
  "Genitourinary",
  "Musculoskeletal",
  "Skin",
  "Neurologic",
  "Psychiatric",
  "Endocrine",
  "Hematologic/Lymphatic",
  "Allergic/Immunologic",
] as const;

export const defaultRosStatements: Record<(typeof rosSystems)[number], string> = {
  Constitutional: "No fever, chills, or unintentional weight loss.",
  Eyes: "No acute visual change or eye pain.",
  ENT: "No sore throat, hearing loss, or epistaxis.",
  Cardiovascular: "No syncope or exertional chest pain.",
  Respiratory: "No hemoptysis.",
  Gastrointestinal: "No melena, hematochezia, or vomiting.",
  Genitourinary: "No dysuria or gross hematuria.",
  Musculoskeletal: "No new focal joint swelling beyond baseline chronic pain.",
  Skin: "No new rash or nonhealing lesion.",
  Neurologic: "No new focal weakness or seizure activity.",
  Psychiatric: "Mood and sleep concerns reviewed separately in HPI when relevant.",
  Endocrine: "No heat intolerance or polydipsia beyond baseline.",
  "Hematologic/Lymphatic": "No easy bruising or new adenopathy.",
  "Allergic/Immunologic": "No urticaria or recent allergic reaction.",
};

export const physicalExamTemplates = {
  Constitutional: [
    "Alert, oriented, and in no acute distress.",
    "Chronically ill appearing but cooperative and speaking in full sentences.",
  ],
  HEENT: [
    "Normocephalic, atraumatic. Oral mucosa moist.",
    "Pupils equal and reactive. Oropharynx clear without exudate.",
  ],
  Neck: [
    "Supple without JVD or cervical adenopathy.",
    "No carotid bruit. Trachea midline.",
  ],
  Cardiovascular: [
    "Regular rhythm with normal S1/S2 and no murmur appreciated.",
    "Irregularly irregular rhythm without gallop. Peripheral pulses palpable.",
  ],
  Respiratory: [
    "Breath sounds clear bilaterally without wheeze or rales.",
    "Mildly diminished breath sounds at the bases without accessory muscle use.",
  ],
  Abdomen: [
    "Soft, nontender, nondistended with active bowel sounds.",
    "Soft abdomen with mild chronic distention and no rebound or guarding.",
  ],
  Extremities: [
    "No clubbing or cyanosis. Trace bilateral lower extremity edema.",
    "No acute joint erythema. Peripheral perfusion intact.",
  ],
  Neurologic: [
    "No acute focal motor deficit. Gait slow but stable with assistive device.",
    "Speech fluent. Strength grossly intact except for chronic baseline deficits.",
  ],
  Skin: [
    "Warm and dry without new breakdown.",
    "Skin intact with chronic venous stasis changes of the lower legs.",
  ],
  Psychiatric: [
    "Affect appropriate with normal thought process.",
    "Mood mildly anxious but judgment and insight are preserved.",
  ],
} satisfies Record<string, string[]>;

const additionalImagingTemplates = [
  {
    type: "Chest X-ray",
    indication: [
      "chronic cardiopulmonary surveillance",
      "follow-up for dyspnea and chronic cough",
      "assessment of volume status and pulmonary symptoms",
    ],
    findings: [
      "Two-view chest radiographs demonstrate mild bibasilar linear scarring without focal consolidation. Cardiomediastinal silhouette is mildly enlarged. No pleural effusion or pneumothorax.",
      "Cardiomediastinal silhouette is stable. Mild hyperinflation is present. No acute focal infiltrate. Mild chronic bibasilar reticulation is unchanged from prior study.",
      "Low lung volume exam with mild bibasilar atelectatic change. No focal airspace disease. Trace chronic blunting of the left costophrenic angle is unchanged.",
    ],
    impressions: [
      ["No acute cardiopulmonary abnormality.", "Mild chronic bibasilar scarring."],
      ["Hyperinflation without focal pneumonia.", "Stable mild cardiomegaly."],
      ["No acute infiltrate.", "Mild chronic bibasilar atelectatic change."],
    ],
  },
  {
    type: "Abdominal Ultrasound",
    indication: [
      "evaluation of abdominal distention and chronic liver disease",
      "follow-up of abnormal liver enzymes",
      "assessment of chronic renal and hepatobiliary disease",
    ],
    findings: [
      "Ultrasound of the abdomen demonstrates coarse hepatic echotexture without focal mass. Gallbladder is surgically absent. Common bile duct measures 5 mm. Kidneys are normal in contour without hydronephrosis.",
      "The liver is mildly enlarged with increased echogenicity. Portal venous flow is hepatopetal. No sonographic Murphy sign. Spleen is mildly enlarged measuring 14.8 cm.",
      "Right upper quadrant ultrasound shows nodular liver contour with trace perihepatic ascites. No focal hepatic lesion identified on this examination. Main portal vein remains patent.",
    ],
    impressions: [
      ["Coarse hepatic echotexture without focal hepatic lesion.", "No biliary obstruction."],
      ["Hepatic steatosis and mild splenomegaly.", "No cholelithiasis or ductal dilatation."],
      ["Cirrhotic liver morphology with trace ascites.", "Patent portal vein."],
    ],
  },
  {
    type: "DEXA Scan",
    indication: [
      "osteoporosis screening",
      "interval bone density monitoring",
      "follow-up of chronic steroid exposure and fracture risk",
    ],
    findings: [
      "Bone mineral density demonstrates T-score of -2.6 at the left femoral neck and -2.1 at the lumbar spine. No interval compression deformity is evident on lateral assessment.",
      "DEXA reveals osteopenia at the total hip with T-score of -2.0 and osteoporosis at the distal radius with T-score of -2.7. Comparison with prior study shows mild interval decline.",
      "Dual-energy x-ray absorptiometry shows low bone mass with lumbar spine T-score of -1.9 and femoral neck T-score of -2.5.",
    ],
    impressions: [
      ["Osteoporosis by WHO criteria."],
      ["Mixed osteopenia and osteoporosis with mild interval decline."],
      ["Low bone density, greatest at the femoral neck."],
    ],
  },
];

let imagingCounter = 0;

function imagingId() {
  imagingCounter += 1;
  return `img-${imagingCounter}`;
}

export function buildAdditionalImaging(date: string) {
  const template =
    additionalImagingTemplates[
      Math.floor(Math.random() * additionalImagingTemplates.length)
    ];
  return {
    id: imagingId(),
    type: template.type,
    date,
    indication:
      template.indication[Math.floor(Math.random() * template.indication.length)],
    findings:
      template.findings[Math.floor(Math.random() * template.findings.length)],
    impression:
      template.impressions[Math.floor(Math.random() * template.impressions.length)],
  } satisfies ImagingReport;
}

export function imagingTemplateFor(key: ImagingKey) {
  switch (key) {
    case "renal-ultrasound":
      return {
        type: "Renal Ultrasound",
        indication: [
          "chronic kidney disease surveillance",
          "follow-up of diabetic kidney disease",
        ],
        findings: [
          "Ultrasound of both kidneys demonstrates preserved cortical thickness with mild diffuse increased echogenicity. Right kidney measures 10.1 cm and left kidney 10.4 cm. No hydronephrosis or shadowing calculus is identified.",
          "Mild bilateral cortical thinning with increased echogenicity is present, compatible with chronic medical renal disease. No focal renal mass or hydronephrosis.",
        ],
        impressions: [
          ["Mild chronic medical renal disease.", "No hydronephrosis."],
          ["Bilateral cortical echogenicity consistent with chronic kidney disease."],
        ],
      };
    case "echo":
      return {
        type: "Echocardiogram",
        indication: [
          "evaluation of cardiomyopathy and dyspnea",
          "interval assessment of chronic heart failure",
        ],
        findings: [
          "Transthoracic echocardiogram demonstrates mildly dilated left ventricle with global hypokinesis and estimated ejection fraction of 35-40%. Mild left atrial enlargement. Mild functional mitral regurgitation. No pericardial effusion.",
          "Left ventricular systolic function is moderately reduced with estimated EF 30-35%. Right ventricular size is normal. Mild pulmonary hypertension with estimated RVSP of 42 mmHg.",
        ],
        impressions: [
          ["Reduced left ventricular systolic function, EF 35-40%.", "Mild left atrial enlargement."],
          ["HFrEF with moderate global hypokinesis.", "Mild pulmonary hypertension."],
        ],
      };
    case "chest-ct":
      return {
        type: "CT Chest",
        indication: [
          "persistent cough and chronic hypoxemia",
          "evaluation of COPD and progressive dyspnea",
        ],
        findings: [
          "Noncontrast CT chest shows moderate upper-lobe predominant centrilobular emphysema with mild diffuse bronchial wall thickening. No focal consolidation. Stable 4 mm right upper lobe pulmonary nodule. No pleural effusion.",
          "CT chest demonstrates hyperinflation, scattered biapical emphysematous change, and mild chronic scarring in the right middle lobe. No suspicious mass or acute infiltrate.",
        ],
        impressions: [
          ["Moderate emphysema without acute intrathoracic process."],
          ["Chronic emphysematous change and bronchitic airway thickening."],
        ],
      };
    case "arterial-duplex":
      return {
        type: "Lower Extremity Arterial Duplex",
        indication: [
          "claudication and peripheral arterial disease surveillance",
          "leg pain with diminished pedal pulses",
        ],
        findings: [
          "Duplex ultrasound demonstrates diffuse atherosclerotic plaque throughout the femoropopliteal segments with elevated peak systolic velocities in the distal superficial femoral artery. Monophasic waveforms are present below the knee bilaterally, greater on the left.",
          "Hemodynamically significant stenosis of the right superficial femoral artery estimated at 50-75%. Distal runoff vessels show diminished monophasic flow.",
        ],
        impressions: [
          ["Moderate multilevel peripheral arterial disease.", "Greatest stenosis in the distal superficial femoral artery."],
          ["Hemodynamically significant femoropopliteal disease with impaired distal runoff."],
        ],
      };
    case "sleep-study":
      return {
        type: "Polysomnography",
        indication: [
          "obstructive sleep apnea evaluation",
          "persistent daytime somnolence and obesity",
        ],
        findings: [
          "Overnight polysomnography reveals severe obstructive sleep apnea with apnea-hypopnea index of 38 events per hour and oxygen nadir of 82%. Marked supine predominance is noted.",
          "Sleep study demonstrates moderate to severe obstructive sleep apnea with frequent desaturations and improved events on CPAP titration.",
        ],
        impressions: [
          ["Severe obstructive sleep apnea."],
          ["Moderate to severe OSA with response to CPAP titration."],
        ],
      };
    case "mental-health-screen":
      return {
        type: "Behavioral Health Assessment",
        indication: [
          "ongoing depression and anxiety monitoring",
          "screening for persistent mood symptoms",
        ],
        findings: [
          "PHQ-9 score is 16 consistent with moderate depressive symptoms. GAD-7 score is 13. No active suicidal ideation endorsed during structured interview.",
          "Behavioral health screening reveals chronic insomnia, reduced energy, and persistent anxious rumination affecting daily function.",
        ],
        impressions: [
          ["Moderate recurrent depressive symptoms."],
          ["Clinically significant anxiety symptoms without acute safety concern."],
        ],
      };
    case "dialysis-access":
      return {
        type: "Dialysis Access Duplex",
        indication: [
          "AV fistula surveillance",
          "evaluation of hemodialysis access function",
        ],
        findings: [
          "Ultrasound of the left upper extremity AV fistula demonstrates patent anastomosis with volume flow of 780 mL/min. Mild venous outflow stenosis is present without thrombosis.",
          "Patent brachiocephalic fistula with focal narrowing in the outflow vein and elevated velocities across the stenotic segment. No adjacent fluid collection.",
        ],
        impressions: [
          ["Patent AV fistula with mild outflow stenosis."],
          ["No access thrombosis."],
        ],
      };
    case "hrct":
      return {
        type: "High-Resolution CT Chest",
        indication: [
          "rheumatoid arthritis associated interstitial lung disease surveillance",
          "progressive exertional dyspnea in connective tissue disease",
        ],
        findings: [
          "High-resolution CT chest demonstrates basilar predominant subpleural reticulation and traction bronchiectasis with mild honeycombing at the posterior lower lobes. No focal consolidation or pleural effusion.",
          "Peripheral and basilar fibrotic interstitial changes are present with scattered ground-glass opacity and mild traction bronchiolectasis. No pneumothorax.",
        ],
        impressions: [
          ["Chronic fibrotic interstitial lung disease with basilar predominance."],
          ["No acute superimposed pulmonary process."],
        ],
      };
    case "liver-us":
      return {
        type: "Liver Ultrasound",
        indication: [
          "cirrhosis surveillance with ascites",
          "follow-up of chronic liver disease and portal hypertension",
        ],
        findings: [
          "Ultrasound demonstrates nodular hepatic contour with heterogeneous echotexture. Moderate perihepatic and pelvic ascites is present. Spleen measures 16.2 cm. No discrete hepatic mass identified on this examination.",
          "The liver is shrunken and nodular. Recanalized paraumbilical vein is noted. Small to moderate ascites present. Main portal vein is patent with slow hepatopetal flow.",
        ],
        impressions: [
          ["Cirrhotic liver morphology with portal hypertension and ascites."],
          ["No focal liver lesion identified by ultrasound."],
        ],
      };
    case "venous-duplex":
      return {
        type: "Venous Duplex Lower Extremities",
        indication: [
          "edema and venous stasis evaluation",
          "leg swelling in heart failure and obesity",
        ],
        findings: [
          "No evidence of acute deep venous thrombosis in either lower extremity. Reflux is present in the bilateral great saphenous veins with subcutaneous edema and chronic skin thickening.",
          "Exam is negative for DVT. Mild superficial venous reflux is demonstrated below the knees bilaterally.",
        ],
        impressions: [
          ["No acute DVT.", "Chronic venous insufficiency changes are present."],
          ["Negative for deep venous thrombosis.", "Mild superficial venous reflux."],
        ],
      };
    case "brain-mri":
      return {
        type: "MRI Brain",
        indication: [
          "cognitive decline and recurrent falls",
          "vascular dementia evaluation",
        ],
        findings: [
          "MRI brain without contrast shows confluent periventricular and subcortical white matter hyperintensities consistent with chronic microvascular ischemic change. Mild diffuse cerebral volume loss. No acute infarct or hemorrhage.",
          "Moderate chronic microvascular ischemic changes and old lacunar infarcts in the bilateral basal ganglia. Generalized cerebral atrophy is present.",
        ],
        impressions: [
          ["Chronic microvascular ischemic change without acute intracranial abnormality."],
          ["Mild diffuse cerebral atrophy and old lacunar infarcts."],
        ],
      };
    case "hiv-neuro":
      return {
        type: "EMG/Nerve Conduction Study",
        indication: [
          "neuropathy evaluation in HIV disease",
          "progressive distal sensory symptoms",
        ],
        findings: [
          "Electrodiagnostic testing demonstrates length-dependent axonal sensorimotor polyneuropathy with reduced sural amplitudes and mildly slowed conduction velocities. No focal mononeuropathy identified.",
          "Nerve conduction studies show distal symmetric sensory-predominant polyneuropathy affecting both lower extremities.",
        ],
        impressions: [
          ["Axonal sensorimotor polyneuropathy."],
          ["Findings compatible with chronic distal symmetric neuropathy."],
        ],
      };
    case "swallow-study":
      return {
        type: "Modified Barium Swallow",
        indication: [
          "dysphagia after prior stroke",
          "coughing with thin liquids and aspiration risk",
        ],
        findings: [
          "Fluoroscopic swallow study shows delayed swallow initiation with penetration of thin liquids and trace silent aspiration. Nectar-thick liquids and puree consistency were tolerated without aspiration.",
          "Mild to moderate oropharyngeal dysphagia with reduced laryngeal elevation and intermittent aspiration of thin liquids.",
        ],
        impressions: [
          ["Oropharyngeal dysphagia with aspiration of thin liquids."],
          ["Diet modification recommended based on aspiration risk."],
        ],
      };
    case "amputation-xray":
      return {
        type: "Left Tibia/Fibula X-ray",
        indication: [
          "post-amputation stump pain evaluation",
          "assessment of phantom pain and wound healing",
        ],
        findings: [
          "Postsurgical below-knee amputation changes are noted. No acute osseous erosion or periosteal reaction. Mild soft tissue swelling overlies the distal stump without soft tissue gas.",
          "Stable transtibial amputation changes with smooth cortical margins. No acute fracture or radiographic evidence of osteomyelitis.",
        ],
        impressions: [
          ["Stable below-knee amputation changes."],
          ["No radiographic evidence of acute osteomyelitis."],
        ],
      };
  }
}
