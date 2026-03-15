import type { ChartTabValue, Patient } from "@/types/patient";

export interface ChartSearchResult {
  id: string;
  tab: ChartTabValue;
  sourceType: string;
  sourceKey: string;
  sourceLabel: string;
  sectionLabel: string;
  preview: string;
  matchCount: number;
}

export interface SearchFocusTarget {
  marker: number;
  resultId: string;
  tab: ChartTabValue;
  sourceType: string;
  sourceKey: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeSearchQuery(query: string) {
  return normalizeText(query);
}

function matchCountForText(text: string, query: string) {
  if (!query) {
    return 0;
  }

  const haystack = normalizeText(text).toLowerCase();
  const needle = query.toLowerCase();
  let count = 0;
  let nextIndex = 0;

  while (true) {
    const matchIndex = haystack.indexOf(needle, nextIndex);
    if (matchIndex === -1) {
      return count;
    }
    count += 1;
    nextIndex = matchIndex + needle.length;
  }
}

function buildPreview(text: string, query: string) {
  const normalized = normalizeText(text);
  if (!query) {
    return normalized;
  }

  const lowerText = normalized.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) {
    return normalized;
  }

  const radius = 84;
  const start = Math.max(0, index - radius);
  const end = Math.min(normalized.length, index + query.length + radius);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < normalized.length ? "..." : "";
  return `${prefix}${normalized.slice(start, end)}${suffix}`;
}

function pushResult(
  results: ChartSearchResult[],
  query: string,
  {
    tab,
    sourceType,
    sourceKey,
    sourceLabel,
    sectionLabel,
    text,
  }: Omit<ChartSearchResult, "id" | "preview" | "matchCount"> & { text: string },
) {
  const normalizedText = normalizeText(text);
  const matchCount = matchCountForText(normalizedText, query);

  if (matchCount === 0) {
    return;
  }

  results.push({
    id: `${sourceType}:${sourceKey}:${sectionLabel}:${results.length}`,
    tab,
    sourceType,
    sourceKey,
    sourceLabel,
    sectionLabel,
    preview: buildPreview(normalizedText, query),
    matchCount,
  });
}

export function buildSearchResults(patient: Patient, query: string) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return [];
  }

  const results: ChartSearchResult[] = [];

  patient.encounters.forEach((encounter) => {
    const sourceLabel = `Encounters - ${formatDate(encounter.date)}`;
    pushResult(results, normalizedQuery, {
      tab: "encounters",
      sourceType: "encounter",
      sourceKey: encounter.id,
      sourceLabel,
      sectionLabel: "Summary",
      text: `${encounter.type} ${encounter.provider} ${encounter.billingCode}`,
    });
    pushResult(results, normalizedQuery, {
      tab: "encounters",
      sourceType: "encounter",
      sourceKey: encounter.id,
      sourceLabel,
      sectionLabel: "Chief Complaint",
      text: encounter.chiefComplaint,
    });
    pushResult(results, normalizedQuery, {
      tab: "encounters",
      sourceType: "encounter",
      sourceKey: encounter.id,
      sourceLabel,
      sectionLabel: "HPI",
      text: encounter.hpi,
    });
    encounter.reviewOfSystems.forEach((item) =>
      pushResult(results, normalizedQuery, {
        tab: "encounters",
        sourceType: "encounter",
        sourceKey: encounter.id,
        sourceLabel,
        sectionLabel: "ROS",
        text: item,
      }),
    );
    encounter.physicalExam.forEach((item) =>
      pushResult(results, normalizedQuery, {
        tab: "encounters",
        sourceType: "encounter",
        sourceKey: encounter.id,
        sourceLabel,
        sectionLabel: `Physical Exam - ${item.system}`,
        text: `${item.system} ${item.text}`,
      }),
    );
    encounter.assessmentPlan.forEach((item) =>
      pushResult(results, normalizedQuery, {
        tab: "encounters",
        sourceType: "encounter",
        sourceKey: encounter.id,
        sourceLabel,
        sectionLabel: "Assessment & Plan",
        text: `${item.problem} ${item.detail}`,
      }),
    );
  });

  patient.problems.forEach((problem) =>
    pushResult(results, normalizedQuery, {
      tab: "problem-list",
      sourceType: "problem",
      sourceKey: problem.id,
      sourceLabel: `Problem List - ${problem.diagnosis}`,
      sectionLabel: "Problem",
      text: `${problem.diagnosis} ${problem.code} ${formatDate(problem.dateAdded)}`,
    }),
  );

  patient.pastMedicalHistory.forEach((item, index) =>
    pushResult(results, normalizedQuery, {
      tab: "pmh",
      sourceType: "pmh",
      sourceKey: String(index),
      sourceLabel: `Past Medical Hx - ${item}`,
      sectionLabel: "Condition",
      text: item,
    }),
  );

  patient.medications.forEach((medication) =>
    pushResult(results, normalizedQuery, {
      tab: "medications",
      sourceType: "medication",
      sourceKey: medication.id,
      sourceLabel: `Medications - ${medication.name}`,
      sectionLabel: "Medication",
      text: `${medication.name} ${medication.dose} ${medication.frequency} ${medication.route} ${medication.prescriber}`,
    }),
  );

  patient.labs.forEach((panel) => {
    const sourceLabel = `Labs - ${panel.name} - ${formatDate(panel.date)}`;
    pushResult(results, normalizedQuery, {
      tab: "labs",
      sourceType: "lab-panel",
      sourceKey: panel.id,
      sourceLabel,
      sectionLabel: "Panel",
      text: `${panel.name} ${formatDate(panel.date)}`,
    });
    panel.results.forEach((result) =>
      pushResult(results, normalizedQuery, {
        tab: "labs",
        sourceType: "lab-panel",
        sourceKey: panel.id,
        sourceLabel,
        sectionLabel: `Lab - ${result.component}`,
        text: `${result.component} ${result.value} ${result.unit} ${result.referenceRange} ${result.flag}`,
      }),
    );
  });

  patient.vitals.forEach((vital) =>
    pushResult(results, normalizedQuery, {
      tab: "vitals",
      sourceType: "vital",
      sourceKey: vital.id,
      sourceLabel: `Vitals - ${formatDate(vital.date)}`,
      sectionLabel: "Vital Row",
      text: `${formatDate(vital.date)} ${vital.systolic}/${vital.diastolic} ${vital.heartRate} ${vital.temperature} ${vital.weight} ${vital.height} ${vital.bmi} ${vital.oxygenSaturation}`,
    }),
  );

  patient.imaging.forEach((report) => {
    const sourceLabel = `Imaging - ${report.type} - ${formatDate(report.date)}`;
    pushResult(results, normalizedQuery, {
      tab: "imaging",
      sourceType: "imaging",
      sourceKey: report.id,
      sourceLabel,
      sectionLabel: "Summary",
      text: `${report.type} ${report.indication} ${formatDate(report.date)}`,
    });
    pushResult(results, normalizedQuery, {
      tab: "imaging",
      sourceType: "imaging",
      sourceKey: report.id,
      sourceLabel,
      sectionLabel: "Findings",
      text: report.findings,
    });
    report.impression.forEach((line) =>
      pushResult(results, normalizedQuery, {
        tab: "imaging",
        sourceType: "imaging",
        sourceKey: report.id,
        sourceLabel,
        sectionLabel: "Impression",
        text: line,
      }),
    );
  });

  return results;
}
