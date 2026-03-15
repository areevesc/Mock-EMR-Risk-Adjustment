import {
  Activity,
  ClipboardList,
  FileClock,
  FlaskConical,
  HeartPulse,
  Image as ImageIcon,
  Pill,
  Stethoscope,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/patient";

type TabValue =
  | "encounters"
  | "problem-list"
  | "pmh"
  | "medications"
  | "labs"
  | "vitals"
  | "imaging";

interface ChartSectionsProps {
  patient: Patient;
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function flagClass(flag: string) {
  if (flag === "critical") {
    return "text-red-700 dark:text-red-300";
  }
  if (flag === "abnormal") {
    return "text-amber-700 dark:text-amber-300";
  }
  return "text-emerald-700 dark:text-emerald-300";
}

const tabs = [
  { value: "encounters", label: "Encounters", icon: Stethoscope },
  { value: "problem-list", label: "Problem List", icon: ClipboardList },
  { value: "pmh", label: "Past Medical Hx", icon: FileClock },
  { value: "medications", label: "Medications", icon: Pill },
  { value: "labs", label: "Labs", icon: FlaskConical },
  { value: "vitals", label: "Vitals", icon: HeartPulse },
  { value: "imaging", label: "Imaging", icon: ImageIcon },
] satisfies Array<{ value: TabValue; label: string; icon: typeof Stethoscope }>;

export function ChartSections({
  patient,
  activeTab,
  onTabChange,
}: ChartSectionsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabValue)}>
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <TabsList className="min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="min-w-[52px] px-3 sm:min-w-[132px]"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value="encounters">
        <Accordion type="multiple" className="border-t border-border/70">
          {patient.encounters.map((encounter) => (
            <AccordionItem
              key={encounter.id}
              value={encounter.id}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-5">
                <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      {formatDate(encounter.date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {encounter.type} · {encounter.provider}
                    </div>
                  </div>
                  <Badge variant="secondary">{encounter.billingCode}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <article
                  data-source-tab="Encounters"
                  data-source-type="encounter"
                  data-source-key={encounter.id}
                  data-source-label={`Encounters - ${formatDate(encounter.date)}`}
                  className="space-y-6 pb-2 text-sm"
                >
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Chief Complaint
                    </h3>
                    <p className="mt-3">{encounter.chiefComplaint}</p>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      History of Present Illness
                    </h3>
                    <p className="mt-3">{encounter.hpi}</p>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Review of Systems
                    </h3>
                    <ul className="mt-3 space-y-1">
                      {encounter.reviewOfSystems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Vitals
                    </h3>
                    <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
                      <div>BP {encounter.vitals.systolic}/{encounter.vitals.diastolic}</div>
                      <div>HR {encounter.vitals.heartRate}</div>
                      <div>Temp {encounter.vitals.temperature}F</div>
                      <div>Wt {encounter.vitals.weight} lb</div>
                      <div>BMI {encounter.vitals.bmi}</div>
                      <div>O2 {encounter.vitals.oxygenSaturation}%</div>
                    </div>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Physical Exam
                    </h3>
                    <div className="mt-3 space-y-4">
                      {encounter.physicalExam.map((item) => (
                        <div key={`${encounter.id}-${item.system}`} className="space-y-1">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {item.system}
                          </div>
                          <div className="mt-1">{item.text}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Assessment &amp; Plan
                    </h3>
                    <ol className="mt-3 space-y-4">
                      {encounter.assessmentPlan.map((plan, index) => (
                        <li key={plan.id} className="space-y-1">
                          <div className="font-semibold">
                            {index + 1}. {plan.problem}
                          </div>
                          <div className="mt-1 text-muted-foreground">{plan.detail}</div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <footer className="space-y-1 pt-2 text-xs text-muted-foreground">
                    <div>
                      Electronically signed by {encounter.provider} on{" "}
                      {formatDate(encounter.date)} at {encounter.signatureTime}
                    </div>
                    <div>Billing Code: {encounter.billingCode}</div>
                  </footer>
                </article>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="problem-list">
        <div className="overflow-x-auto border-t border-border/70 scrollbar-thin">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border/70 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Diagnosis</th>
                <th className="px-4 py-3 font-medium">ICD-10</th>
                <th className="px-4 py-3 font-medium">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {patient.problems.map((problem) => (
                <tr
                  key={problem.id}
                  data-source-tab="Problem List"
                  data-source-type="problem"
                  data-source-key={problem.id}
                  data-source-label={`Problem List - ${problem.diagnosis}`}
                  className="border-b border-border/70"
                >
                  <td className="px-4 py-3 font-medium">{problem.diagnosis}</td>
                  <td className="px-4 py-3 font-mono text-xs">{problem.code}</td>
                  <td className="px-4 py-3">{formatDate(problem.dateAdded)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="pmh">
        <ul className="divide-y divide-border/70 border-t border-border/70">
          {patient.pastMedicalHistory.map((item, index) => (
            <li
              key={`${item}-${index}`}
              data-source-tab="Past Medical Hx"
              data-source-type="pmh"
              data-source-key={String(index)}
              data-source-label={`Past Medical Hx - ${item}`}
              className="py-4"
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="medications">
        <div className="overflow-x-auto border-t border-border/70 scrollbar-thin">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border/70 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Medication</th>
                <th className="px-4 py-3 font-medium">Dose</th>
                <th className="px-4 py-3 font-medium">Frequency</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Prescriber</th>
              </tr>
            </thead>
            <tbody>
              {patient.medications.map((medication) => (
                <tr
                  key={medication.id}
                  data-source-tab="Medications"
                  data-source-type="medication"
                  data-source-key={medication.id}
                  data-source-label={`Medications - ${medication.name}`}
                  className="border-b border-border/70"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{medication.name}</div>
                  </td>
                  <td className="px-4 py-3">{medication.dose}</td>
                  <td className="px-4 py-3">{medication.frequency}</td>
                  <td className="px-4 py-3">{medication.route}</td>
                  <td className="px-4 py-3">{medication.prescriber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="labs">
        <Accordion type="multiple" className="border-t border-border/70">
          {patient.labs.map((panel) => (
            <AccordionItem
              key={panel.id}
              value={panel.id}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{panel.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(panel.date)}
                    </div>
                  </div>
                  <FlaskConical className="h-4 w-4 text-primary" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  data-source-tab="Labs"
                  data-source-type="lab-panel"
                  data-source-key={panel.id}
                  data-source-label={`Labs - ${panel.name} - ${formatDate(panel.date)}`}
                  className="overflow-x-auto scrollbar-thin"
                >
                  <table className="min-w-full text-sm">
                    <thead className="border-b border-border/70 text-left text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Component</th>
                        <th className="px-3 py-2 font-medium">Value</th>
                        <th className="px-3 py-2 font-medium">Reference</th>
                        <th className="px-3 py-2 font-medium">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {panel.results.map((result) => (
                        <tr key={result.id} className="border-b border-border/70">
                          <td className="px-3 py-2">{result.component}</td>
                          <td className={cn("px-3 py-2 font-semibold", flagClass(result.flag))}>
                            {result.value} {result.unit}
                          </td>
                          <td className="px-3 py-2">{result.referenceRange}</td>
                          <td className={cn("px-3 py-2 uppercase tracking-[0.14em]", flagClass(result.flag))}>
                            {result.flag}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>

      <TabsContent value="vitals">
        <div className="overflow-x-auto border-t border-border/70 scrollbar-thin">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border/70 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">BP</th>
                <th className="px-4 py-3 font-medium">HR</th>
                <th className="px-4 py-3 font-medium">Temp</th>
                <th className="px-4 py-3 font-medium">Weight</th>
                <th className="px-4 py-3 font-medium">Height</th>
                <th className="px-4 py-3 font-medium">BMI</th>
                <th className="px-4 py-3 font-medium">O2 Sat</th>
              </tr>
            </thead>
            <tbody>
              {patient.vitals.map((vital) => (
                <tr
                  key={vital.id}
                  data-source-tab="Vitals"
                  data-source-type="vital"
                  data-source-key={vital.id}
                  data-source-label={`Vitals - ${formatDate(vital.date)}`}
                  className="border-b border-border/70"
                >
                  <td className="px-4 py-3">{formatDate(vital.date)}</td>
                  <td className="px-4 py-3">{vital.systolic}/{vital.diastolic}</td>
                  <td className="px-4 py-3">{vital.heartRate}</td>
                  <td className="px-4 py-3">{vital.temperature}F</td>
                  <td className="px-4 py-3">{vital.weight} lb</td>
                  <td className="px-4 py-3">{vital.height} in</td>
                  <td className="px-4 py-3">{vital.bmi}</td>
                  <td className="px-4 py-3">{vital.oxygenSaturation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="imaging">
        <Accordion type="multiple" className="border-t border-border/70">
          {patient.imaging.map((report) => (
            <AccordionItem
              key={report.id}
              value={report.id}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{report.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(report.date)} · {report.indication}
                    </div>
                  </div>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <article
                  data-source-tab="Imaging"
                  data-source-type="imaging"
                  data-source-key={report.id}
                  data-source-label={`Imaging - ${report.type} - ${formatDate(report.date)}`}
                  className="space-y-4 pb-2 text-sm"
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Indication
                    </div>
                    <div className="mt-1">{report.indication}</div>
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Findings
                    </div>
                    <p className="mt-1 leading-6">{report.findings}</p>
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Impression
                    </div>
                    <ol className="mt-2 space-y-2">
                      {report.impression.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ol>
                  </div>
                </article>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
}
