import type { ScenarioDef } from "@/lib/generator/types";

export const scenariosA: ScenarioDef[] = [
  {
    id: "diabetes-ckd",
    name: "Diabetes + CKD",
    summary:
      "type 2 diabetes with diabetic kidney disease, neuropathy, hypertension, and hyperlipidemia",
    problems: [
      {
        diagnosis: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        code: "E11.22",
        isHCC: true,
        hpiPhrases: [
          "fasting sugars are still running above goal with intermittent dietary lapses",
          "home glucose readings remain variable and neuropathic symptoms are active",
        ],
        planPhrases: [
          "continue diabetes regimen, reinforce carbohydrate control, and repeat HbA1c",
          "review foot care and monitor renal function closely",
        ],
      },
      {
        diagnosis: "Chronic kidney disease, stage 3a",
        code: "N18.31",
        isHCC: true,
        hpiPhrases: [
          "renal function has remained stable without edema or urinary obstruction symptoms",
          "avoids NSAIDs and has been trying to stay hydrated",
        ],
        planPhrases: [
          "trend creatinine and urine albumin; continue ACE inhibitor for renal protection",
          "dose medications for renal function and avoid nephrotoxic agents",
        ],
      },
      {
        diagnosis: "Diabetic polyneuropathy",
        code: "E11.42",
        isHCC: true,
        hpiPhrases: [
          "numbness and tingling in both feet are worse at night",
          "balance remains mildly impaired but there have been no recent falls",
        ],
        planPhrases: [
          "continue neuropathy medication and reinforce daily foot inspection",
          "review fall precautions and podiatry follow-up",
        ],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure control has been fair with occasional elevated home readings"],
        planPhrases: ["continue antihypertensive therapy and low-sodium diet"],
      },
      {
        diagnosis: "Hyperlipidemia",
        code: "E78.5",
        isHCC: false,
        hpiPhrases: ["remains on statin therapy without side effects"],
        planPhrases: ["continue statin and lifestyle counseling"],
      },
    ],
    medications: [
      { name: "Metformin (Glucophage)", dose: "500 mg", frequency: "BID", route: "PO" },
      { name: "Empagliflozin (Jardiance)", dose: "10 mg", frequency: "daily", route: "PO" },
      { name: "Lisinopril (Prinivil)", dose: "20 mg", frequency: "daily", route: "PO" },
      { name: "Rosuvastatin (Crestor)", dose: "20 mg", frequency: "nightly", route: "PO" },
      { name: "Gabapentin (Neurontin)", dose: "300 mg", frequency: "TID", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Chronic disease follow-up",
        complaints: ["diabetes follow-up", "kidney function review", "neuropathy check"],
        purpose: [
          "Quarterly diabetes and CKD management visit",
          "Follow-up for diabetic kidney disease and neuropathic symptoms",
        ],
      },
      {
        type: "Annual wellness visit",
        complaints: ["annual wellness examination", "chronic condition review"],
        purpose: ["Annual preventive visit with chronic disease review"],
      },
      {
        type: "Medication management",
        complaints: ["medication refill review", "lab review and medication adjustment"],
        purpose: ["Interval medication and lab review"],
      },
    ],
    pastMedicalHistory: [
      "Type 2 diabetes mellitus diagnosed 14 years ago",
      "CKD stage 3 since 2022",
      "Hypertension",
      "Hyperlipidemia",
      "Cataract surgery bilaterally",
      "Appendectomy in youth",
    ],
    positiveRos: [
      "Reports fatigue and variable home glucose readings.",
      "Intermittent foot numbness and burning are present.",
      "Mild nocturia without dysuria.",
      "Denies chest pain but notes reduced exercise tolerance.",
    ],
    positiveExam: [
      "Diminished sensation to monofilament testing at the plantar feet.",
      "Trace bilateral ankle edema without skin breakdown.",
      "Pedal pulses reduced but palpable.",
    ],
    vitalProfile: {
      systolic: [128, 154],
      diastolic: [70, 92],
      heartRate: [68, 88],
      temperature: [97.4, 99.1],
      weight: [158, 242],
      height: [60, 73],
      oxygenSaturation: [95, 99],
    },
    labProfile: {
      glucose: [122, 226],
      bun: [22, 38],
      creatinine: [1.15, 1.72],
      hemoglobin: [11.1, 13.4],
      ldl: [82, 128],
      triglycerides: [140, 240],
    },
    panelKeys: ["glycemic-renal"],
    imagingKeys: ["renal-ultrasound"],
    contradictions: [
      {
        hpi: "The HPI references CKD stage 3a based on prior labs",
        ap: "Chronic kidney disease, stage 2",
      },
      {
        hpi: "The patient describes diabetes with numbness in both feet",
        ap: "Type 2 diabetes mellitus without complications",
      },
    ],
  },
  {
    id: "chf",
    name: "CHF",
    summary:
      "heart failure with reduced ejection fraction, atrial fibrillation, coronary artery disease, CKD, and hypertension",
    problems: [
      {
        diagnosis: "Heart failure with reduced ejection fraction",
        code: "I50.20",
        isHCC: true,
        hpiPhrases: [
          "dyspnea on exertion is stable but the patient still needs frequent rest breaks",
          "daily weights show mild fluctuation with occasional lower extremity swelling",
        ],
        planPhrases: [
          "continue guideline-directed medical therapy and monitor weights closely",
          "review sodium restriction, fluid goals, and return precautions for decompensation",
        ],
      },
      {
        diagnosis: "Atrial fibrillation",
        code: "I48.91",
        isHCC: true,
        hpiPhrases: [
          "reports occasional palpitations without syncope",
          "remains on anticoagulation without bleeding symptoms",
        ],
        planPhrases: [
          "continue rate control and anticoagulation; monitor for bleeding",
          "reinforce adherence and cardiology follow-up",
        ],
      },
      {
        diagnosis: "Coronary artery disease without angina",
        code: "I25.10",
        isHCC: true,
        hpiPhrases: [
          "denies exertional chest pain but has limited stamina",
          "continues secondary prevention regimen",
        ],
        planPhrases: [
          "continue aspirin, statin, and beta blocker therapy",
          "encourage gradual activity as tolerated",
        ],
      },
      {
        diagnosis: "Chronic kidney disease, stage 3b",
        code: "N18.32",
        isHCC: true,
        hpiPhrases: ["renal function remains under surveillance while on diuretic therapy"],
        planPhrases: ["repeat renal panel after medication adjustments"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["home blood pressure is improved but not consistently at goal"],
        planPhrases: ["continue current regimen and low-sodium diet"],
      },
    ],
    medications: [
      { name: "Sacubitril/valsartan (Entresto)", dose: "49/51 mg", frequency: "BID", route: "PO" },
      { name: "Metoprolol succinate (Toprol XL)", dose: "100 mg", frequency: "daily", route: "PO" },
      { name: "Furosemide (Lasix)", dose: "40 mg", frequency: "daily", route: "PO" },
      { name: "Apixaban (Eliquis)", dose: "5 mg", frequency: "BID", route: "PO" },
      { name: "Atorvastatin (Lipitor)", dose: "40 mg", frequency: "nightly", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Heart failure follow-up",
        complaints: ["shortness of breath follow-up", "edema review", "heart failure management"],
        purpose: ["Follow-up for HFrEF symptom surveillance"],
      },
      {
        type: "Cardiology comanagement visit",
        complaints: ["cardiac medication check", "atrial fibrillation follow-up"],
        purpose: ["Chronic cardiac disease management visit"],
      },
      {
        type: "Post-hospital follow-up",
        complaints: ["recent CHF admission follow-up", "volume status reassessment"],
        purpose: ["Interval post-discharge reassessment after volume overload"],
      },
    ],
    pastMedicalHistory: [
      "HFrEF",
      "Atrial fibrillation",
      "Coronary artery disease with prior stent placement",
      "Chronic kidney disease",
      "Hypertension",
      "Remote cholecystectomy",
    ],
    positiveRos: [
      "Reports exertional dyspnea and intermittent ankle swelling.",
      "Occasional palpitations without syncope.",
      "Sleeps with two pillows and notes mild orthopnea.",
      "Denies chest pain today.",
    ],
    positiveExam: [
      "Irregularly irregular rhythm with controlled ventricular response.",
      "Trace to 1+ pitting edema at both ankles.",
      "Bibasilar crackles are faint but present.",
    ],
    vitalProfile: {
      systolic: [132, 168],
      diastolic: [72, 96],
      heartRate: [72, 104],
      temperature: [97.2, 99.0],
      weight: [162, 250],
      height: [62, 75],
      oxygenSaturation: [93, 98],
    },
    labProfile: {
      bun: [24, 40],
      creatinine: [1.18, 1.86],
      sodium: [132, 139],
      hemoglobin: [10.8, 13.2],
      ldl: [78, 118],
    },
    panelKeys: ["bnp"],
    imagingKeys: ["echo"],
    contradictions: [
      {
        hpi: "The HPI describes known HFrEF with EF in the 35% range",
        ap: "Heart failure with preserved ejection fraction",
      },
      {
        hpi: "Palpitations are attributed to chronic atrial fibrillation",
        ap: "Paroxysmal supraventricular tachycardia",
      },
    ],
  },
  {
    id: "copd",
    name: "COPD",
    summary:
      "COPD with acute exacerbation, tobacco dependence, hypertension, osteoporosis, and GERD",
    problems: [
      {
        diagnosis: "Chronic obstructive pulmonary disease with acute exacerbation",
        code: "J44.1",
        isHCC: true,
        hpiPhrases: [
          "cough and wheeze have increased over the past week with thicker sputum",
          "uses rescue inhaler several times per day during flares",
        ],
        planPhrases: [
          "continue maintenance inhalers and short prednisone taper for exacerbation management",
          "review inhaler technique and ER precautions for worsening dyspnea",
        ],
      },
      {
        diagnosis: "Nicotine dependence, cigarettes",
        code: "F17.210",
        isHCC: false,
        hpiPhrases: ["continues to smoke despite counseling and has cut down modestly"],
        planPhrases: ["repeat smoking cessation counseling and discuss nicotine replacement"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure is monitored periodically at home"],
        planPhrases: ["continue current antihypertensive therapy"],
      },
      {
        diagnosis: "Age-related osteoporosis",
        code: "M81.0",
        isHCC: false,
        hpiPhrases: ["bone health remains a concern due to steroid exposure and low activity"],
        planPhrases: ["continue bone health treatment and fall prevention"],
      },
      {
        diagnosis: "GERD",
        code: "K21.9",
        isHCC: false,
        hpiPhrases: ["reflux symptoms remain controlled on therapy"],
        planPhrases: ["continue acid suppression and lifestyle modification"],
      },
    ],
    medications: [
      { name: "Tiotropium (Spiriva)", dose: "18 mcg", frequency: "daily", route: "INH" },
      { name: "Budesonide/formoterol (Symbicort)", dose: "160/4.5 mcg", frequency: "2 puffs BID", route: "INH" },
      { name: "Albuterol (Ventolin HFA)", dose: "2 puffs", frequency: "q4-6h PRN", route: "INH" },
      { name: "Prednisone (Deltasone)", dose: "20 mg", frequency: "daily x5 days", route: "PO" },
      { name: "Pantoprazole (Protonix)", dose: "40 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Acute visit",
        complaints: ["worsening cough", "shortness of breath", "COPD flare"],
        purpose: ["Urgent COPD exacerbation evaluation"],
      },
      {
        type: "Pulmonary follow-up",
        complaints: ["chronic cough follow-up", "inhaler review"],
        purpose: ["Pulmonary chronic disease management visit"],
      },
      {
        type: "Medication management",
        complaints: ["inhaler refill", "breathing follow-up"],
        purpose: ["Interval inhaler and symptom review"],
      },
    ],
    pastMedicalHistory: [
      "COPD",
      "Longstanding tobacco use",
      "Hypertension",
      "Osteoporosis",
      "GERD",
      "Remote total abdominal hysterectomy",
    ],
    positiveRos: [
      "Reports cough, wheeze, and increased sputum production.",
      "Dyspnea is worse with exertion and stairs.",
      "No hemoptysis is reported.",
      "Intermittent reflux symptoms are controlled with medication.",
    ],
    positiveExam: [
      "Expiratory wheezes are present bilaterally.",
      "Mildly diminished breath sounds with prolonged expiratory phase.",
      "Speaking in full sentences without accessory muscle use.",
    ],
    vitalProfile: {
      systolic: [124, 156],
      diastolic: [68, 92],
      heartRate: [82, 108],
      temperature: [97.4, 99.6],
      weight: [108, 178],
      height: [58, 72],
      oxygenSaturation: [88, 95],
    },
    labProfile: {
      co2: [29, 36],
      wbc: [7.2, 12.8],
      glucose: [96, 146],
    },
    panelKeys: ["abg"],
    imagingKeys: ["chest-ct"],
    contradictions: [
      {
        hpi: "The HPI describes COPD with acute exacerbation and frequent rescue inhaler use",
        ap: "Stable COPD without exacerbation",
      },
      {
        hpi: "The patient still smokes daily",
        ap: "Former smoker",
      },
    ],
  },
  {
    id: "pad",
    name: "PAD",
    summary:
      "peripheral artery disease with claudication, diabetes with peripheral angiopathy, hypertension, hyperlipidemia, and CKD",
    problems: [
      {
        diagnosis:
          "Atherosclerosis of native arteries of extremities with intermittent claudication, bilateral legs",
        code: "I70.213",
        isHCC: true,
        hpiPhrases: [
          "calf pain begins after walking one to two blocks and improves with rest",
          "leg fatigue has limited exercise tolerance and shopping trips",
        ],
        planPhrases: [
          "continue antiplatelet/statin therapy and encourage graded walking program",
          "vascular surgery follow-up and foot protection were reviewed",
        ],
      },
      {
        diagnosis:
          "Type 2 diabetes mellitus with diabetic peripheral angiopathy without gangrene",
        code: "E11.51",
        isHCC: true,
        hpiPhrases: [
          "blood sugars remain variably controlled with chronic foot numbness",
          "denies active foot ulceration",
        ],
        planPhrases: [
          "optimize glycemic control and reinforce daily foot checks",
          "continue diabetes medications and podiatry follow-up",
        ],
      },
      {
        diagnosis: "Chronic kidney disease, stage 3a",
        code: "N18.31",
        isHCC: true,
        hpiPhrases: ["renal function is stable without urinary complaints"],
        planPhrases: ["repeat renal studies and avoid nephrotoxic medications"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure remains acceptable on current regimen"],
        planPhrases: ["continue current antihypertensive therapy"],
      },
      {
        diagnosis: "Hyperlipidemia",
        code: "E78.5",
        isHCC: false,
        hpiPhrases: ["continues high-intensity statin therapy"],
        planPhrases: ["continue statin and repeat lipids"],
      },
    ],
    medications: [
      { name: "Clopidogrel (Plavix)", dose: "75 mg", frequency: "daily", route: "PO" },
      { name: "Atorvastatin (Lipitor)", dose: "80 mg", frequency: "nightly", route: "PO" },
      { name: "Metformin (Glucophage)", dose: "500 mg", frequency: "BID", route: "PO" },
      { name: "Losartan (Cozaar)", dose: "50 mg", frequency: "daily", route: "PO" },
      { name: "Cilostazol (Pletal)", dose: "100 mg", frequency: "BID", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Vascular follow-up",
        complaints: ["leg pain with walking", "claudication follow-up", "PAD surveillance"],
        purpose: ["Peripheral arterial disease follow-up visit"],
      },
      {
        type: "Chronic care follow-up",
        complaints: ["diabetes and circulation review", "lab review"],
        purpose: ["Combined diabetes and vascular risk management visit"],
      },
      {
        type: "Annual wellness visit",
        complaints: ["annual examination", "vascular disease follow-up"],
        purpose: ["Annual wellness visit with PAD review"],
      },
    ],
    pastMedicalHistory: [
      "Peripheral artery disease",
      "Type 2 diabetes mellitus",
      "CKD stage 3",
      "Hypertension",
      "Hyperlipidemia",
      "Remote femoral angioplasty",
    ],
    positiveRos: [
      "Reports bilateral calf pain with exertion.",
      "Foot numbness is chronic but stable.",
      "No rest pain or new ulceration.",
      "Exercise tolerance is limited by leg fatigue.",
    ],
    positiveExam: [
      "Pedal pulses are diminished bilaterally.",
      "Lower legs show cool distal skin and sparse hair growth.",
      "No active foot ulcer is identified.",
    ],
    vitalProfile: {
      systolic: [128, 162],
      diastolic: [70, 94],
      heartRate: [68, 92],
      temperature: [97.3, 99.0],
      weight: [142, 232],
      height: [60, 74],
      oxygenSaturation: [94, 99],
    },
    labProfile: {
      glucose: [118, 210],
      creatinine: [1.08, 1.6],
      ldl: [88, 140],
      triglycerides: [140, 240],
    },
    panelKeys: ["vascular-diabetes"],
    imagingKeys: ["arterial-duplex"],
    contradictions: [
      {
        hpi: "The HPI notes diabetic peripheral angiopathy",
        ap: "Type 2 diabetes without circulatory complications",
      },
      {
        hpi: "The patient describes bilateral claudication after short walking distance",
        ap: "Peripheral artery disease asymptomatic",
      },
    ],
  },
  {
    id: "morbid-obesity",
    name: "Morbid Obesity",
    summary:
      "morbid obesity with OSA, diabetes without complications, hypertension, GERD, and osteoarthritis",
    problems: [
      {
        diagnosis: "Morbid obesity due to excess calories",
        code: "E66.01",
        isHCC: true,
        hpiPhrases: [
          "weight has remained elevated despite attempts at portion control",
          "mobility is limited by knee pain and poor stamina",
        ],
        planPhrases: [
          "continue structured nutrition counseling and discuss weight-loss pharmacotherapy",
          "encourage gradual activity increase and monitor for obesity-related complications",
        ],
      },
      {
        diagnosis: "Body mass index 42.0-42.9, adult",
        code: "Z68.41",
        isHCC: false,
        hpiPhrases: ["BMI remains in the morbid obesity range"],
        planPhrases: ["document BMI and reinforce weight management plan"],
      },
      {
        diagnosis: "Obstructive sleep apnea",
        code: "G47.33",
        isHCC: false,
        hpiPhrases: ["uses CPAP inconsistently and still wakes unrefreshed"],
        planPhrases: ["reinforce nightly CPAP use and sleep hygiene"],
      },
      {
        diagnosis: "Type 2 diabetes mellitus without complications",
        code: "E11.9",
        isHCC: false,
        hpiPhrases: ["blood sugars are above goal but there are no known microvascular complications"],
        planPhrases: ["continue diabetes therapy and repeat HbA1c"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure remains variably elevated"],
        planPhrases: ["continue antihypertensive regimen and home BP monitoring"],
      },
      {
        diagnosis: "GERD",
        code: "K21.9",
        isHCC: false,
        hpiPhrases: ["reflux symptoms increase with late meals"],
        planPhrases: ["continue PPI and elevate head of bed"],
      },
    ],
    medications: [
      { name: "Semaglutide (Ozempic)", dose: "0.5 mg", frequency: "weekly", route: "SC" },
      { name: "Metformin (Glucophage)", dose: "500 mg", frequency: "BID", route: "PO" },
      { name: "Losartan (Cozaar)", dose: "50 mg", frequency: "daily", route: "PO" },
      { name: "Pantoprazole (Protonix)", dose: "40 mg", frequency: "daily", route: "PO" },
      { name: "Acetaminophen (Tylenol)", dose: "650 mg", frequency: "q8h PRN", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Weight management follow-up",
        complaints: ["weight loss follow-up", "diabetes and weight review", "sleep apnea follow-up"],
        purpose: ["Obesity medicine follow-up visit"],
      },
      {
        type: "Annual wellness visit",
        complaints: ["annual wellness exam", "chronic disease review"],
        purpose: ["Annual wellness visit with obesity and metabolic review"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["blood pressure and weight review", "medication follow-up"],
        purpose: ["Primary care interval follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Morbid obesity",
      "Obstructive sleep apnea on CPAP",
      "Type 2 diabetes mellitus",
      "Hypertension",
      "GERD",
      "Bilateral knee osteoarthritis",
    ],
    positiveRos: [
      "Reports daytime fatigue and poor exercise tolerance.",
      "Snoring and fragmented sleep persist.",
      "Knee pain limits walking distance.",
      "No chest pain or new edema.",
    ],
    positiveExam: [
      "Body habitus notable for central obesity.",
      "Mild bilateral knee crepitus without acute effusion.",
      "No acute respiratory distress.",
    ],
    vitalProfile: {
      systolic: [130, 164],
      diastolic: [72, 98],
      heartRate: [72, 96],
      temperature: [97.3, 99.0],
      weight: [248, 336],
      height: [60, 72],
      oxygenSaturation: [92, 98],
    },
    labProfile: {
      glucose: [118, 198],
      triglycerides: [160, 280],
      hdl: [28, 42],
    },
    panelKeys: ["thyroid-metabolic"],
    imagingKeys: ["sleep-study"],
    contradictions: [
      {
        hpi: "The HPI documents BMI above 42 with severe obesity",
        ap: "Overweight",
      },
      {
        hpi: "The patient reports using CPAP only intermittently",
        ap: "OSA well controlled on CPAP",
      },
    ],
  },
  {
    id: "depression",
    name: "Depression",
    summary:
      "major depressive disorder recurrent, generalized anxiety, chronic pain, insomnia, and hypertension",
    problems: [
      {
        diagnosis: "Major depressive disorder, recurrent, moderate",
        code: "F33.1",
        isHCC: true,
        hpiPhrases: [
          "mood remains low with reduced motivation and social withdrawal",
          "energy is poor and concentration remains inconsistent",
        ],
        planPhrases: [
          "continue antidepressant therapy and behavioral health follow-up",
          "review coping strategies, crisis resources, and sleep hygiene",
        ],
      },
      {
        diagnosis: "Generalized anxiety disorder",
        code: "F41.1",
        isHCC: false,
        hpiPhrases: ["ongoing worry and restlessness interfere with sleep"],
        planPhrases: ["continue counseling and PRN anxiety management plan"],
      },
      {
        diagnosis: "Chronic pain syndrome",
        code: "G89.4",
        isHCC: true,
        hpiPhrases: ["chronic back and joint pain remain a daily burden"],
        planPhrases: ["continue multimodal pain plan with emphasis on function"],
      },
      {
        diagnosis: "Insomnia",
        code: "G47.00",
        isHCC: false,
        hpiPhrases: ["sleep remains fragmented with frequent overnight awakening"],
        planPhrases: ["review sleep hygiene and medication timing"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure remains reasonably controlled"],
        planPhrases: ["continue current therapy"],
      },
    ],
    medications: [
      { name: "Sertraline (Zoloft)", dose: "100 mg", frequency: "daily", route: "PO" },
      { name: "Buspirone (Buspar)", dose: "10 mg", frequency: "BID", route: "PO" },
      { name: "Trazodone (Desyrel)", dose: "50 mg", frequency: "nightly", route: "PO" },
      { name: "Duloxetine (Cymbalta)", dose: "60 mg", frequency: "daily", route: "PO" },
      { name: "Lisinopril (Prinivil)", dose: "10 mg", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Behavioral health follow-up",
        complaints: ["depression follow-up", "anxiety and insomnia review", "medication follow-up"],
        purpose: ["Behavioral health and primary care follow-up"],
      },
      {
        type: "Medication management",
        complaints: ["mood medication check", "sleep and anxiety follow-up"],
        purpose: ["Psychotropic medication management visit"],
      },
      {
        type: "Primary care follow-up",
        complaints: ["chronic pain and mood review", "blood pressure follow-up"],
        purpose: ["Integrated mood and medical follow-up"],
      },
    ],
    pastMedicalHistory: [
      "Major depressive disorder",
      "Generalized anxiety disorder",
      "Chronic low back pain",
      "Insomnia",
      "Hypertension",
      "Remote carpal tunnel release",
    ],
    positiveRos: [
      "Reports low mood, reduced motivation, and poor sleep.",
      "Anxiety remains elevated during stress.",
      "Chronic pain is present without new neurologic deficits.",
      "No active suicidal ideation reported.",
    ],
    positiveExam: [
      "Affect is constricted but cooperative.",
      "Thought process is linear without psychosis.",
      "Mild paraspinal tenderness without acute neurologic deficit.",
    ],
    vitalProfile: {
      systolic: [122, 154],
      diastolic: [68, 92],
      heartRate: [70, 98],
      temperature: [97.1, 99.0],
      weight: [132, 228],
      height: [59, 74],
      oxygenSaturation: [95, 99],
    },
    labProfile: {
      glucose: [92, 132],
      sodium: [134, 141],
    },
    panelKeys: ["mood-medical"],
    imagingKeys: ["mental-health-screen"],
    contradictions: [
      {
        hpi: "The HPI documents recurrent moderate major depression",
        ap: "Depression in remission",
      },
      {
        hpi: "Sleep remains fragmented with persistent insomnia",
        ap: "Insomnia resolved",
      },
    ],
  },
  {
    id: "dialysis",
    name: "CKD on Dialysis",
    summary:
      "end-stage renal disease on hemodialysis with diabetes, hypertension, anemia, and secondary hyperparathyroidism",
    problems: [
      {
        diagnosis: "End stage renal disease",
        code: "N18.6",
        isHCC: true,
        hpiPhrases: [
          "continues hemodialysis three times weekly with post-treatment fatigue",
          "dry weight is reviewed regularly with the dialysis unit",
        ],
        planPhrases: [
          "continue dialysis schedule and coordinate with nephrology",
          "review fluid restriction and access surveillance",
        ],
      },
      {
        diagnosis: "Dependence on renal dialysis",
        code: "Z99.2",
        isHCC: false,
        hpiPhrases: ["AV fistula function has been acceptable without recent infiltration"],
        planPhrases: ["continue dialysis access monitoring"],
      },
      {
        diagnosis: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
        code: "E11.22",
        isHCC: true,
        hpiPhrases: ["glucose control remains variable around dialysis days"],
        planPhrases: ["continue current insulin plan and monitor peri-dialysis sugars"],
      },
      {
        diagnosis: "Secondary hyperparathyroidism of renal origin",
        code: "N25.81",
        isHCC: true,
        hpiPhrases: ["phosphorus control remains difficult despite binder use"],
        planPhrases: ["continue phosphate binder and calcimimetic therapy"],
      },
      {
        diagnosis: "Anemia in chronic kidney disease",
        code: "D63.1",
        isHCC: true,
        hpiPhrases: ["fatigue is partly attributed to anemia of kidney disease"],
        planPhrases: ["trend hemoglobin and continue ESA per nephrology protocol"],
      },
      {
        diagnosis: "Essential hypertension",
        code: "I10",
        isHCC: false,
        hpiPhrases: ["blood pressure fluctuates around dialysis sessions"],
        planPhrases: ["continue current regimen and fluid restriction"],
      },
    ],
    medications: [
      { name: "Insulin glargine (Lantus)", dose: "18 units", frequency: "nightly", route: "SC" },
      { name: "Sevelamer carbonate (Renvela)", dose: "800 mg", frequency: "TID with meals", route: "PO" },
      { name: "Cinacalcet (Sensipar)", dose: "30 mg", frequency: "daily", route: "PO" },
      { name: "Amlodipine (Norvasc)", dose: "10 mg", frequency: "daily", route: "PO" },
      { name: "B complex with folic acid (Nephro-Vite)", dose: "1 tablet", frequency: "daily", route: "PO" },
    ],
    encounterTypes: [
      {
        type: "Nephrology follow-up",
        complaints: ["dialysis follow-up", "lab review", "fatigue after dialysis"],
        purpose: ["ESRD interval follow-up"],
      },
      {
        type: "Post-dialysis reassessment",
        complaints: ["blood pressure follow-up", "dialysis access review"],
        purpose: ["Dialysis-related medical follow-up"],
      },
      {
        type: "Chronic care follow-up",
        complaints: ["diabetes and dialysis management", "anemia review"],
        purpose: ["Complex chronic disease follow-up"],
      },
    ],
    pastMedicalHistory: [
      "ESRD on hemodialysis",
      "Type 2 diabetes mellitus",
      "Hypertension",
      "Secondary hyperparathyroidism",
      "Anemia of CKD",
      "Left upper extremity AV fistula creation",
    ],
    positiveRos: [
      "Reports fatigue after dialysis treatments.",
      "Occasional cramping near the end of dialysis sessions.",
      "No fever or access drainage.",
      "Appetite is fair with fluid restriction challenges.",
    ],
    positiveExam: [
      "Left upper extremity AV fistula with palpable thrill and bruit.",
      "Trace edema present at the ankles.",
      "Chronically ill appearing but not in acute distress.",
    ],
    vitalProfile: {
      systolic: [138, 176],
      diastolic: [70, 96],
      heartRate: [72, 98],
      temperature: [97.2, 99.1],
      weight: [136, 252],
      height: [58, 76],
      oxygenSaturation: [93, 98],
    },
    labProfile: {
      bun: [46, 72],
      creatinine: [4.8, 8.6],
      hemoglobin: [8.8, 11.2],
      calcium: [8.2, 9.2],
    },
    panelKeys: ["dialysis-mineral"],
    imagingKeys: ["dialysis-access"],
    contradictions: [
      {
        hpi: "The HPI references ESRD on maintenance hemodialysis",
        ap: "Chronic kidney disease stage 4",
      },
      {
        hpi: "The fistula is used regularly for dialysis",
        ap: "Peritoneal dialysis dependence",
      },
    ],
  },
];
