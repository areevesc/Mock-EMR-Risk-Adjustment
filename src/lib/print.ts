import type { Annotation, EvidenceSnippet, Patient } from "@/types/patient";

export function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function snippetSet(annotations: Annotation[]) {
  const keys = new Set<string>();
  annotations.forEach((annotation) => {
    annotation.evidence.forEach((snippet) =>
      keys.add(`${snippet.sourceType}:${snippet.sourceKey}`),
    );
    if (annotation.diagnosisSource) {
      keys.add(
        `${annotation.diagnosisSource.sourceType}:${annotation.diagnosisSource.sourceKey}`,
      );
    }
  });
  return keys;
}

function renderEvidence(snippet: EvidenceSnippet) {
  return `<div class="quote">
    <div class="source">${esc(snippet.sourceLabel)}</div>
    <div>${esc(snippet.text)}</div>
  </div>`;
}

function renderWorksheet(annotations: Annotation[]) {
  if (annotations.length === 0) {
    return `<section><h2>Coding Worksheet</h2><p>No annotations captured.</p></section>`;
  }

  return `<section>
    <h2>Coding Worksheet</h2>
    ${annotations
      .map(
        (annotation, index) => `<article class="annotation">
          <div class="annotation-head">
            <span class="index">${index + 1}</span>
            <span class="tag">${esc(annotation.type)}</span>
            <strong>${esc(annotation.diagnosis || "Unspecified diagnosis")}</strong>
          </div>
          ${
            annotation.notes
              ? `<p class="notes">${esc(annotation.notes)}</p>`
              : ""
          }
          ${
            annotation.diagnosisSource
              ? `<div class="diagnosis-source">${renderEvidence(annotation.diagnosisSource)}</div>`
              : ""
          }
          ${
            annotation.evidence.length > 0
              ? `<div class="evidence-list">${annotation.evidence
                  .map((snippet) => renderEvidence(snippet))
                  .join("")}</div>`
              : "<p class='muted'>No supporting evidence captured.</p>"
          }
        </article>`,
      )
      .join("")}
  </section>`;
}

function renderTable(headers: string[], rows: string[][]) {
  return `<table>
    <thead>
      <tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
        )
        .join("")}
    </tbody>
  </table>`;
}

export function printPatientChart(
  patient: Patient,
  annotations: Annotation[],
  mode: "referenced" | "full",
) {
  const snippetKeys = snippetSet(annotations);
  const encounterRows =
    mode === "full"
      ? patient.encounters
      : patient.encounters.filter((encounter) =>
          snippetKeys.has(`encounter:${encounter.id}`),
        );
  const labRows =
    mode === "full"
      ? patient.labs
      : patient.labs.filter((panel) => snippetKeys.has(`lab-panel:${panel.id}`));
  const vitalRows =
    mode === "full"
      ? patient.vitals
      : patient.vitals.filter((vital) => snippetKeys.has(`vital:${vital.id}`));
  const imagingRows =
    mode === "full"
      ? patient.imaging
      : patient.imaging.filter((report) =>
          snippetKeys.has(`imaging:${report.id}`),
        );
  const problemRows =
    mode === "full"
      ? patient.problems
      : patient.problems.filter((problem) =>
          snippetKeys.has(`problem:${problem.id}`),
        );
  const medicationRows =
    mode === "full"
      ? patient.medications
      : patient.medications.filter((medication) =>
          snippetKeys.has(`medication:${medication.id}`),
        );
  const pmhRows =
    mode === "full"
      ? patient.pastMedicalHistory
      : patient.pastMedicalHistory.filter((item, index) =>
          snippetKeys.has(`pmh:${index}`),
        );

  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>EMR Worksheet Print</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
        h1, h2, h3 { margin: 0 0 12px; }
        section { margin-top: 28px; page-break-inside: avoid; }
        .patient-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
        .meta { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 10px; background: #f8fafc; }
        .annotation { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-bottom: 12px; }
        .annotation-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .index { width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 999px; background: #dbeafe; font-weight: 700; }
        .tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 8px; background: #e2e8f0; border-radius: 999px; }
        .quote { border-left: 3px solid #2563eb; padding-left: 10px; margin-top: 10px; }
        .source { color: #475569; font-size: 12px; margin-bottom: 4px; }
        .muted, .notes { color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #eff6ff; }
        .encounter { border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; margin-top: 12px; }
        .mono { font-family: "Courier New", monospace; }
      </style>
    </head>
    <body>
      <header>
        <h1>${esc(`${patient.firstName} ${patient.lastName}`)}</h1>
        <div class="patient-grid">
          <div class="meta"><strong>Scenario</strong><br/>${esc(patient.scenarioName)}</div>
          <div class="meta"><strong>Age / Gender</strong><br/>${esc(
            `${patient.age} / ${patient.gender}`,
          )}</div>
          <div class="meta"><strong>DOB</strong><br/>${esc(
            formatDate(patient.dob),
          )}</div>
          <div class="meta"><strong>MRN</strong><br/>${esc(patient.mrn)}</div>
          <div class="meta"><strong>Provider</strong><br/>${esc(patient.provider)}</div>
          <div class="meta"><strong>Print Mode</strong><br/>${esc(
            mode === "full" ? "Full Chart" : "Worksheet + Referenced",
          )}</div>
        </div>
      </header>
      ${renderWorksheet(annotations)}
      ${
        problemRows.length > 0
          ? `<section><h2>Problem List</h2>${renderTable(
              ["Diagnosis", "ICD-10", "Date Added"],
              problemRows.map((problem) => [
                esc(problem.diagnosis),
                esc(problem.code),
                esc(formatDate(problem.dateAdded)),
              ]),
            )}</section>`
          : ""
      }
      ${
        pmhRows.length > 0
          ? `<section><h2>Past Medical History</h2><ul>${pmhRows
              .map((item) => `<li>${esc(item)}</li>`)
              .join("")}</ul></section>`
          : ""
      }
      ${
        medicationRows.length > 0
          ? `<section><h2>Medications</h2>${renderTable(
              ["Medication", "Dose", "Frequency", "Route", "Prescriber"],
              medicationRows.map((medication) => [
                esc(medication.name),
                esc(medication.dose),
                esc(medication.frequency),
                esc(medication.route),
                esc(medication.prescriber),
              ]),
            )}</section>`
          : ""
      }
      ${
        labRows.length > 0
          ? `<section><h2>Labs</h2>${labRows
              .map(
                (panel) => `<article class="encounter">
                  <h3>${esc(panel.name)} - ${esc(formatDate(panel.date))}</h3>
                  ${renderTable(
                    ["Component", "Value", "Reference", "Flag"],
                    panel.results.map((result) => [
                      esc(result.component),
                      esc(`${result.value} ${result.unit}`.trim()),
                      esc(result.referenceRange),
                      esc(result.flag),
                    ]),
                  )}
                </article>`,
              )
              .join("")}</section>`
          : ""
      }
      ${
        vitalRows.length > 0
          ? `<section><h2>Vitals</h2>${renderTable(
              ["Date", "BP", "HR", "Temp", "Weight", "Height", "BMI", "O2 Sat"],
              vitalRows.map((vital) => [
                esc(formatDate(vital.date)),
                esc(`${vital.systolic}/${vital.diastolic}`),
                esc(String(vital.heartRate)),
                esc(String(vital.temperature)),
                esc(`${vital.weight} lb`),
                esc(`${vital.height} in`),
                esc(String(vital.bmi)),
                esc(`${vital.oxygenSaturation}%`),
              ]),
            )}</section>`
          : ""
      }
      ${
        imagingRows.length > 0
          ? `<section><h2>Imaging</h2>${imagingRows
              .map(
                (report) => `<article class="encounter">
                  <h3>${esc(report.type)} - ${esc(formatDate(report.date))}</h3>
                  <p><strong>Indication:</strong> ${esc(report.indication)}</p>
                  <p><strong>Findings:</strong> ${esc(report.findings)}</p>
                  <ol>${report.impression
                    .map((item) => `<li>${esc(item)}</li>`)
                    .join("")}</ol>
                </article>`,
              )
              .join("")}</section>`
          : ""
      }
      ${
        encounterRows.length > 0
          ? `<section><h2>Encounters</h2>${encounterRows
              .map(
                (encounter) => `<article class="encounter">
                  <h3>${esc(formatDate(encounter.date))} - ${esc(encounter.type)}</h3>
                  <p><strong>Chief Complaint:</strong> ${esc(encounter.chiefComplaint)}</p>
                  <p><strong>HPI:</strong> ${esc(encounter.hpi)}</p>
                  <p><strong>ROS:</strong> ${esc(encounter.reviewOfSystems.join(" "))}</p>
                  <p><strong>Vitals:</strong> ${esc(
                    `${encounter.vitals.systolic}/${encounter.vitals.diastolic} BP, HR ${encounter.vitals.heartRate}, Temp ${encounter.vitals.temperature}, Wt ${encounter.vitals.weight} lb, O2 ${encounter.vitals.oxygenSaturation}%`,
                  )}</p>
                  <p><strong>Physical Exam:</strong> ${esc(
                    encounter.physicalExam
                      .map((item) => `${item.system}: ${item.text}`)
                      .join(" "),
                  )}</p>
                  <ol>${encounter.assessmentPlan
                    .map(
                      (item) =>
                        `<li><strong>${esc(item.problem)}:</strong> ${esc(item.detail)}</li>`,
                    )
                    .join("")}</ol>
                  <p class="mono">Electronically signed by ${esc(
                    encounter.provider,
                  )} on ${esc(formatDate(encounter.date))} at ${esc(
                    encounter.signatureTime,
                  )}</p>
                  <p><strong>Billing Code:</strong> ${esc(encounter.billingCode)}</p>
                </article>`,
              )
              .join("")}</section>`
          : ""
      }
    </body>
  </html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (!printWindow) {
    URL.revokeObjectURL(url);
    return;
  }

  const revoke = () => URL.revokeObjectURL(url);
  printWindow.addEventListener("load", () => {
    printWindow.print();
    setTimeout(revoke, 2000);
  });
}
