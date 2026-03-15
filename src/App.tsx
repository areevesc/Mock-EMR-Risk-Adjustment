import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Moon,
  RefreshCw,
  SunMedium,
} from "lucide-react";
import { ChartSections } from "@/components/chart-sections";
import { Worksheet } from "@/components/worksheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { generatePatient } from "@/lib/generatePatient";
import { printPatientChart } from "@/lib/print";
import { cn } from "@/lib/utils";
import type { Annotation, EvidenceSnippet, Patient, SourceTab } from "@/types/patient";

type Theme = "light" | "dark";
type TabValue =
  | "encounters"
  | "problem-list"
  | "pmh"
  | "medications"
  | "labs"
  | "vitals"
  | "imaging";
type CaptureField = "diagnosis" | "evidence";

interface SelectionState {
  text: string;
  top: number;
  left: number;
  sourceTab: SourceTab;
  sourceType: string;
  sourceKey: string;
  sourceLabel: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function initialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem("emr-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function createAnnotation(): Annotation {
  return {
    id: `annotation-${Math.random().toString(36).slice(2, 10)}`,
    type: "Supported",
    diagnosis: "",
    diagnosisSource: undefined,
    evidence: [],
    notes: "",
    manualDiagnosis: false,
  };
}

export default function App() {
  const [patient, setPatient] = useState<Patient>(() => generatePatient());
  const [activeTab, setActiveTab] = useState<TabValue>("encounters");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [worksheetCollapsed, setWorksheetCollapsed] = useState(false);
  const [mobileWorksheetOpen, setMobileWorksheetOpen] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<{
    annotationId: string;
    field: CaptureField;
  } | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);
  const mobileSelectionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("emr-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!captureTarget) {
      setSelectionState(null);
      return;
    }

    const extractSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return null;
      }

      const text = selection.toString().replace(/\s+/g, " ").trim();
      if (!text) {
        return null;
      }

      const range = selection.getRangeAt(0);
      const anchor =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? (range.commonAncestorContainer as HTMLElement)
          : range.commonAncestorContainer.parentElement;

      if (!anchor || !chartRef.current?.contains(anchor)) {
        return null;
      }

      const sourceElement = anchor.closest("[data-source-tab]") as HTMLElement | null;
      if (!sourceElement) {
        return null;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        return null;
      }

      const isMobile = window.innerWidth < 640;
      const width = Math.min(320, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - 12,
      );
      const top = Math.max(12, rect.top - (isMobile ? 72 : 58));

      return {
        text,
        top,
        left,
        sourceTab: (sourceElement.dataset.sourceTab ?? "Encounters") as SourceTab,
        sourceType: sourceElement.dataset.sourceType ?? "chart",
        sourceKey: sourceElement.dataset.sourceKey ?? text.slice(0, 24),
        sourceLabel: sourceElement.dataset.sourceLabel ?? "Chart",
      } satisfies SelectionState;
    };

    const finalizeSelection = () => {
      if (!captureTarget) {
        return;
      }
      setSelectionState(extractSelection());
    };

    const handleSelectionStart = (event: Event) => {
      const target = event.target as Node | null;
      if (!target || !chartRef.current?.contains(target)) {
        return;
      }
      isSelectingRef.current = true;
      setSelectionState(null);
    };

    const handleSelectionEnd = () => {
      isSelectingRef.current = false;
      window.setTimeout(finalizeSelection, 0);
    };

    const handleSelectionChange = () => {
      if (window.innerWidth >= 640 || isSelectingRef.current) {
        return;
      }

      if (mobileSelectionTimerRef.current) {
        window.clearTimeout(mobileSelectionTimerRef.current);
      }

      mobileSelectionTimerRef.current = window.setTimeout(() => {
        finalizeSelection();
      }, 180);
    };

    const hideToolbar = () => {
      setSelectionState(null);
    };

    document.addEventListener("mousedown", handleSelectionStart, true);
    document.addEventListener("mouseup", handleSelectionEnd, true);
    document.addEventListener("touchstart", handleSelectionStart, true);
    document.addEventListener("touchend", handleSelectionEnd, true);
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("resize", hideToolbar);
    window.addEventListener("scroll", hideToolbar, true);

    return () => {
      if (mobileSelectionTimerRef.current) {
        window.clearTimeout(mobileSelectionTimerRef.current);
      }
      document.removeEventListener("mousedown", handleSelectionStart, true);
      document.removeEventListener("mouseup", handleSelectionEnd, true);
      document.removeEventListener("touchstart", handleSelectionStart, true);
      document.removeEventListener("touchend", handleSelectionEnd, true);
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("resize", hideToolbar);
      window.removeEventListener("scroll", hideToolbar, true);
    };
  }, [captureTarget]);

  function clearSelection() {
    setSelectionState(null);
    window.getSelection()?.removeAllRanges();
  }

  function resetChart() {
    setPatient(generatePatient());
    setAnnotations([]);
    setActiveTab("encounters");
    setCaptureTarget(null);
    clearSelection();
  }

  function updateAnnotation(
    annotationId: string,
    updater: (annotation: Annotation) => Annotation,
  ) {
    setAnnotations((current) =>
      current.map((annotation) =>
        annotation.id === annotationId ? updater(annotation) : annotation,
      ),
    );
  }

  function buildSnippet(selection: SelectionState): EvidenceSnippet {
    return {
      id: `snippet-${Math.random().toString(36).slice(2, 10)}`,
      sourceTab: selection.sourceTab,
      sourceType: selection.sourceType,
      sourceKey: selection.sourceKey,
      sourceLabel: selection.sourceLabel,
      text: selection.text,
    };
  }

  function confirmSelection() {
    if (!captureTarget || !selectionState) {
      return;
    }

    const snippet = buildSnippet(selectionState);
    updateAnnotation(captureTarget.annotationId, (annotation) => {
      if (captureTarget.field === "diagnosis") {
        return {
          ...annotation,
          diagnosis: snippet.text,
          diagnosisSource: snippet,
          manualDiagnosis: false,
        };
      }

      const duplicate = annotation.evidence.some(
        (item) =>
          item.sourceKey === snippet.sourceKey &&
          item.text === snippet.text &&
          item.sourceType === snippet.sourceType,
      );

      return duplicate
        ? annotation
        : {
            ...annotation,
            evidence: [...annotation.evidence, snippet],
          };
    });

    setCaptureTarget(null);
    clearSelection();
  }

  function removeEvidence(annotationId: string, evidenceId: string) {
    updateAnnotation(annotationId, (annotation) => ({
      ...annotation,
      evidence: annotation.evidence.filter((item) => item.id !== evidenceId),
    }));
  }

  const worksheet = (
    <Worksheet
      annotations={annotations}
      captureTarget={captureTarget}
      onAddAnnotation={() =>
        setAnnotations((current) => [...current, createAnnotation()])
      }
      onRemoveAnnotation={(annotationId) =>
        setAnnotations((current) =>
          current.filter((annotation) => annotation.id !== annotationId),
        )
      }
      onUpdateAnnotation={updateAnnotation}
      onRemoveEvidence={removeEvidence}
      onStartCapture={(annotationId, field) => {
        setCaptureTarget((current) =>
          current?.annotationId === annotationId && current.field === field
            ? null
            : { annotationId, field },
        );
        setMobileWorksheetOpen(false);
        clearSelection();
      }}
      onPrint={(mode) => printPatientChart(patient, annotations, mode)}
    />
  );

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 lg:px-6">
      <aside
        className={cn(
          "fixed bottom-4 right-4 top-4 z-40 hidden xl:flex transition-all duration-300",
          worksheetCollapsed ? "w-16" : "w-[380px]",
        )}
      >
        <div className="relative flex h-full w-full">
          <Button
            variant="secondary"
            size="icon"
            className="absolute -left-8 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full shadow-panel"
            onClick={() => setWorksheetCollapsed((current) => !current)}
          >
            {worksheetCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex h-full w-full overflow-hidden rounded-[24px] border border-border bg-card shadow-panel">
            {worksheetCollapsed ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 px-3">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                <Badge variant="secondary">{annotations.length}</Badge>
              </div>
            ) : (
              worksheet
            )}
          </div>
        </div>
      </aside>

      <Drawer open={mobileWorksheetOpen} onOpenChange={setMobileWorksheetOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-6 right-5 z-40 h-14 rounded-full px-5 shadow-panel xl:hidden"
            size="lg"
          >
            <ClipboardCheck className="h-5 w-5" />
            Worksheet
            <Badge variant="secondary" className="ml-1">
              {annotations.length}
            </Badge>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[88vh] p-0">
          <DrawerTitle className="sr-only">Coding Worksheet</DrawerTitle>
          <div className="max-h-[80vh] overflow-hidden">{worksheet}</div>
        </DrawerContent>
      </Drawer>

      <main
        className={cn(
          "mx-auto rounded-[24px] border border-border bg-card shadow-panel",
          worksheetCollapsed ? "xl:pr-24" : "xl:pr-[416px]",
        )}
      >
        <header className="border-b border-border/70 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-xl font-semibold text-primary sm:flex">
                {patient.initials}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{patient.age}</span>
                    <span>·</span>
                    <span>{patient.gender}</span>
                    <span>·</span>
                    <span>DOB {formatDate(patient.dob)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">MRN {patient.mrn}</Badge>
                  <Badge variant="secondary">{patient.provider}</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button onClick={resetChart}>
                <RefreshCw className="h-4 w-4" />
                Generate New Chart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setTheme((current) => (current === "light" ? "dark" : "light"))
                }
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <SunMedium className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <section className="px-4 py-4 sm:px-6 sm:py-6">
          <div ref={chartRef}>
            <ChartSections
              patient={patient}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </section>
      </main>

      {captureTarget ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,680px)] -translate-x-1/2 rounded-full border border-primary/30 bg-card px-4 py-3 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              {captureTarget.field === "diagnosis"
                ? "Select a diagnosis - highlight text in the chart"
                : "Add evidence - highlight supporting text in the chart"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCaptureTarget(null);
                clearSelection();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      {selectionState ? (
        <div
          className="fixed z-[60] rounded-2xl border border-border bg-card p-3 shadow-panel"
          style={{
            top: selectionState.top,
            left: selectionState.left,
            width:
              typeof window === "undefined"
                ? 320
                : Math.min(320, window.innerWidth - 24),
          }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {selectionState.sourceLabel}
          </div>
          <div className="mt-2 max-h-16 overflow-hidden text-sm leading-5">
            {selectionState.text}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              className="min-h-11 flex-1"
              onClick={confirmSelection}
            >
              {captureTarget?.field === "diagnosis" ? "Select" : "Add Evidence"}
            </Button>
            <Button variant="outline" className="min-h-11" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
