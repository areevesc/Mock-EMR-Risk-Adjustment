import { useEffect, useState } from "react";
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
import { HighlightedText } from "@/components/highlighted-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChartSearchResult, SearchFocusTarget } from "@/lib/chart-search";
import { cn } from "@/lib/utils";
import type { ChartTabValue, Patient } from "@/types/patient";

interface ChartSectionsProps {
  patient: Patient;
  activeTab: ChartTabValue;
  onTabChange: (value: ChartTabValue) => void;
  searchQuery: string;
  searchResults: ChartSearchResult[];
  searchFocus: SearchFocusTarget | null;
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
] satisfies Array<{ value: ChartTabValue; label: string; icon: typeof Stethoscope }>;

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function matchingSourceKeys(searchResults: ChartSearchResult[], tab: ChartTabValue) {
  return uniqueValues(
    searchResults
      .filter((result) => result.tab === tab)
      .map((result) => result.sourceKey),
  );
}

export function ChartSections({
  patient,
  activeTab,
  onTabChange,
  searchQuery,
  searchResults,
  searchFocus,
}: ChartSectionsProps) {
  const [openEncounterItems, setOpenEncounterItems] = useState<string[]>([]);
  const [openLabPanels, setOpenLabPanels] = useState<string[]>([]);
  const [openImagingReports, setOpenImagingReports] = useState<string[]>([]);

  const encounterValues = uniqueValues([
    ...openEncounterItems,
    ...matchingSourceKeys(searchResults, "encounters"),
    ...(searchFocus?.tab === "encounters" ? [searchFocus.sourceKey] : []),
  ]);
  const labValues = uniqueValues([
    ...openLabPanels,
    ...matchingSourceKeys(searchResults, "labs"),
    ...(searchFocus?.tab === "labs" ? [searchFocus.sourceKey] : []),
  ]);
  const imagingValues = uniqueValues([
    ...openImagingReports,
    ...matchingSourceKeys(searchResults, "imaging"),
    ...(searchFocus?.tab === "imaging" ? [searchFocus.sourceKey] : []),
  ]);

  useEffect(() => {
    if (!searchFocus || activeTab !== searchFocus.tab) {
      return;
    }

    const timer = window.setTimeout(() => {
      const element = document.querySelector(
        `[data-source-type="${searchFocus.sourceType}"][data-source-key="${searchFocus.sourceKey}"]`,
      ) as HTMLElement | null;

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    activeTab,
    searchFocus,
    encounterValues.join("|"),
    imagingValues.join("|"),
    labValues.join("|"),
  ]);

  function isFocusedSource(sourceType: string, sourceKey: string) {
    return (
      searchFocus?.sourceType === sourceType &&
      searchFocus.sourceKey === sourceKey
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as ChartTabValue)}
    >
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
        <Accordion
          type="multiple"
          value={encounterValues}
          onValueChange={setOpenEncounterItems}
          className="border-t border-border/70"
        >
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
                      <HighlightedText text={encounter.type} query={searchQuery} /> ·{" "}
                      <HighlightedText text={encounter.provider} query={searchQuery} />
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <HighlightedText text={encounter.billingCode} query={searchQuery} />
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <article
                  data-source-tab="Encounters"
                  data-source-type="encounter"
                  data-source-key={encounter.id}
                  data-source-label={`Encounters - ${formatDate(encounter.date)}`}
                  className={cn(
                    "scroll-mt-24 space-y-6 pb-2 text-sm transition-colors",
                    isFocusedSource("encounter", encounter.id) && "rounded-2xl bg-primary/5 p-3",
                  )}
                >
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Chief Complaint
                    </h3>
                    <p className="mt-3">
                      <HighlightedText text={encounter.chiefComplaint} query={searchQuery} />
                    </p>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      History of Present Illness
                    </h3>
                    <p className="mt-3">
                      <HighlightedText text={encounter.hpi} query={searchQuery} />
                    </p>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Review of Systems
                    </h3>
                    <ul className="mt-3 space-y-1">
                      {encounter.reviewOfSystems.map((item) => (
                        <li key={item}>
                          <HighlightedText text={item} query={searchQuery} />
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="border-t border-border/60 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Vitals
                    </h3>
                    <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
                      <div>
                        <HighlightedText
                          text={`BP ${encounter.vitals.systolic}/${encounter.vitals.diastolic}`}
                          query={searchQuery}
                        />
                      </div>
                      <div>
                        <HighlightedText
                          text={`HR ${encounter.vitals.heartRate}`}
                          query={searchQuery}
                        />
                      </div>
                      <div>
                        <HighlightedText
                          text={`Temp ${encounter.vitals.temperature}F`}
                          query={searchQuery}
                        />
                      </div>
                      <div>
                        <HighlightedText
                          text={`Wt ${encounter.vitals.weight} lb`}
                          query={searchQuery}
                        />
                      </div>
                      <div>
                        <HighlightedText
                          text={`BMI ${encounter.vitals.bmi}`}
                          query={searchQuery}
                        />
                      </div>
                      <div>
                        <HighlightedText
                          text={`O2 ${encounter.vitals.oxygenSaturation}%`}
                          query={searchQuery}
                        />
                      </div>
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
                            <HighlightedText text={item.system} query={searchQuery} />
                          </div>
                          <div className="mt-1">
                            <HighlightedText text={item.text} query={searchQuery} />
                          </div>
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
                            {index + 1}.{" "}
                            <HighlightedText text={plan.problem} query={searchQuery} />
                          </div>
                          <div className="mt-1 text-muted-foreground">
                            <HighlightedText text={plan.detail} query={searchQuery} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <footer className="space-y-1 pt-2 text-xs text-muted-foreground">
                    <div>
                      Electronically signed by{" "}
                      <HighlightedText text={encounter.provider} query={searchQuery} /> on{" "}
                      {formatDate(encounter.date)} at{" "}
                      <HighlightedText text={encounter.signatureTime} query={searchQuery} />
                    </div>
                    <div>
                      Billing Code:{" "}
                      <HighlightedText text={encounter.billingCode} query={searchQuery} />
                    </div>
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
                  className={cn(
                    "scroll-mt-24 border-b border-border/70",
                    isFocusedSource("problem", problem.id) && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3 font-medium">
                    <HighlightedText text={problem.diagnosis} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <HighlightedText text={problem.code} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={formatDate(problem.dateAdded)} query={searchQuery} />
                  </td>
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
              className={cn(
                "scroll-mt-24 py-4",
                isFocusedSource("pmh", String(index)) && "rounded-xl bg-primary/5 px-3",
              )}
            >
              <span>
                <HighlightedText text={item} query={searchQuery} />
              </span>
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
                  className={cn(
                    "scroll-mt-24 border-b border-border/70",
                    isFocusedSource("medication", medication.id) && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      <HighlightedText text={medication.name} query={searchQuery} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={medication.dose} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={medication.frequency} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={medication.route} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={medication.prescriber} query={searchQuery} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="labs">
        <Accordion
          type="multiple"
          value={labValues}
          onValueChange={setOpenLabPanels}
          className="border-t border-border/70"
        >
          {patient.labs.map((panel) => (
            <AccordionItem
              key={panel.id}
              value={panel.id}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      <HighlightedText text={panel.name} query={searchQuery} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <HighlightedText text={formatDate(panel.date)} query={searchQuery} />
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
                  className={cn(
                    "scroll-mt-24 overflow-x-auto scrollbar-thin",
                    isFocusedSource("lab-panel", panel.id) && "rounded-2xl bg-primary/5 p-3",
                  )}
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
                          <td className="px-3 py-2">
                            <HighlightedText text={result.component} query={searchQuery} />
                          </td>
                          <td className={cn("px-3 py-2 font-semibold", flagClass(result.flag))}>
                            <HighlightedText
                              text={`${result.value} ${result.unit}`.trim()}
                              query={searchQuery}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <HighlightedText text={result.referenceRange} query={searchQuery} />
                          </td>
                          <td className={cn("px-3 py-2 uppercase tracking-[0.14em]", flagClass(result.flag))}>
                            <HighlightedText text={result.flag} query={searchQuery} />
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
                  className={cn(
                    "scroll-mt-24 border-b border-border/70",
                    isFocusedSource("vital", vital.id) && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3">
                    <HighlightedText text={formatDate(vital.date)} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText
                      text={`${vital.systolic}/${vital.diastolic}`}
                      query={searchQuery}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={vital.heartRate} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={`${vital.temperature}F`} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={`${vital.weight} lb`} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={`${vital.height} in`} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText text={vital.bmi} query={searchQuery} />
                  </td>
                  <td className="px-4 py-3">
                    <HighlightedText
                      text={`${vital.oxygenSaturation}%`}
                      query={searchQuery}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="imaging">
        <Accordion
          type="multiple"
          value={imagingValues}
          onValueChange={setOpenImagingReports}
          className="border-t border-border/70"
        >
          {patient.imaging.map((report) => (
            <AccordionItem
              key={report.id}
              value={report.id}
              className="border-b border-border/70"
            >
              <AccordionTrigger className="py-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      <HighlightedText text={report.type} query={searchQuery} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <HighlightedText text={formatDate(report.date)} query={searchQuery} /> ·{" "}
                      <HighlightedText text={report.indication} query={searchQuery} />
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
                  className={cn(
                    "scroll-mt-24 space-y-4 pb-2 text-sm transition-colors",
                    isFocusedSource("imaging", report.id) && "rounded-2xl bg-primary/5 p-3",
                  )}
                >
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Indication
                    </div>
                    <div className="mt-1">
                      <HighlightedText text={report.indication} query={searchQuery} />
                    </div>
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Findings
                    </div>
                    <p className="mt-1 leading-6">
                      <HighlightedText text={report.findings} query={searchQuery} />
                    </p>
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Impression
                    </div>
                    <ol className="mt-2 space-y-2">
                      {report.impression.map((line) => (
                        <li key={line}>
                          <HighlightedText text={line} query={searchQuery} />
                        </li>
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
