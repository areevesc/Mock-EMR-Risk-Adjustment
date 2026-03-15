import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Moon,
  RefreshCw,
  Search,
  SunMedium,
} from "lucide-react";
import { ChartSections } from "@/components/chart-sections";
import { HighlightedText } from "@/components/highlighted-text";
import { Worksheet } from "@/components/worksheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  buildSearchResults,
  normalizeSearchQuery,
  type ChartSearchResult,
  type SearchFocusTarget,
} from "@/lib/chart-search";
import { generatePatient } from "@/lib/generatePatient";
import { printPatientChart } from "@/lib/print";
import { cn } from "@/lib/utils";
import type {
  Annotation,
  ChartTabValue,
  EvidenceSnippet,
  Patient,
  SourceTab,
} from "@/types/patient";

type Theme = "light" | "dark";
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

interface PersistedSession {
  version: 1;
  patient: Patient;
  annotations: Annotation[];
  activeTab: ChartTabValue;
}

const THEME_STORAGE_KEY = "emr-theme";
const SESSION_STORAGE_KEY = "mock-emr-session-v1";
const DEFAULT_TAB: ChartTabValue = "encounters";
const VISIBLE_SEARCH_RESULT_LIMIT = 12;
const chartTabs: ChartTabValue[] = [
  "encounters",
  "problem-list",
  "pmh",
  "medications",
  "labs",
  "vitals",
  "imaging",
];

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
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function isChartTabValue(value: unknown): value is ChartTabValue {
  return chartTabs.includes(value as ChartTabValue);
}

function loadPersistedSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedSession>;
    if (
      parsed.version !== 1 ||
      !parsed.patient ||
      typeof parsed.patient.id !== "string" ||
      !Array.isArray(parsed.annotations) ||
      !isChartTabValue(parsed.activeTab)
    ) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return parsed as PersistedSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function initialAppState(): PersistedSession {
  const persisted = loadPersistedSession();
  if (persisted) {
    return persisted;
  }

  return {
    version: 1,
    patient: generatePatient(),
    annotations: [],
    activeTab: DEFAULT_TAB,
  };
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
  const [initialState] = useState(initialAppState);
  const [patient, setPatient] = useState<Patient>(initialState.patient);
  const [activeTab, setActiveTab] = useState<ChartTabValue>(initialState.activeTab);
  const [annotations, setAnnotations] = useState<Annotation[]>(initialState.annotations);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [worksheetCollapsed, setWorksheetCollapsed] = useState(false);
  const [mobileWorksheetOpen, setMobileWorksheetOpen] = useState(false);
  const [captureTarget, setCaptureTarget] = useState<{
    annotationId: string;
    field: CaptureField;
  } | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState<SearchFocusTarget | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);
  const mobileSelectionTimerRef = useRef<number | null>(null);
  const selectionSnapshotRef = useRef<SelectionState | null>(null);
  const deferredSearchQuery = useDeferredValue(normalizeSearchQuery(searchQuery));
  const searchResults = buildSearchResults(patient, deferredSearchQuery);
  const visibleSearchResults = searchResults.slice(0, VISIBLE_SEARCH_RESULT_LIMIT);
  const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 640;
  const showDesktopCaptureBanner = Boolean(captureTarget && !isMobileViewport && !selectionState);
  const activeSelection = selectionState ?? selectionSnapshotRef.current;
  const canConfirmSelection = Boolean(activeSelection);

  function extractSelection() {
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
    const firstRect = range.getClientRects()[0];
    const resolvedRect =
      rect.width === 0 && rect.height === 0 && firstRect ? firstRect : rect;

    if (resolvedRect.width === 0 && resolvedRect.height === 0) {
      return null;
    }

    const width = Math.min(320, window.innerWidth - 24);
    const left = Math.min(
      Math.max(12, resolvedRect.left + resolvedRect.width / 2 - width / 2),
      window.innerWidth - width - 12,
    );
    const top = Math.max(12, resolvedRect.top - (window.innerWidth < 640 ? 72 : 58));

    return {
      text,
      top,
      left,
      sourceTab: (sourceElement.dataset.sourceTab ?? "Encounters") as SourceTab,
      sourceType: sourceElement.dataset.sourceType ?? "chart",
      sourceKey: sourceElement.dataset.sourceKey ?? text.slice(0, 24),
      sourceLabel: sourceElement.dataset.sourceLabel ?? "Chart",
    } satisfies SelectionState;
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    try {
      const session: PersistedSession = {
        version: 1,
        patient,
        annotations,
        activeTab,
      };
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage write failures and continue with in-memory state.
    }
  }, [activeTab, annotations, patient]);

  useEffect(() => {
    if (!deferredSearchQuery) {
      setSearchFocus(null);
      return;
    }

    setSearchFocus((current) => {
      if (!current) {
        return null;
      }

      const stillVisible = searchResults.some(
        (result) =>
          result.tab === current.tab &&
          result.sourceType === current.sourceType &&
          result.sourceKey === current.sourceKey,
      );

      return stillVisible ? current : null;
    });
  }, [deferredSearchQuery, searchResults]);

  useEffect(() => {
    if (!captureTarget) {
      setSelectionState(null);
      selectionSnapshotRef.current = null;
      return;
    }

    const scheduleFinalizeSelection = (delay: number, attempts = 1) => {
      if (mobileSelectionTimerRef.current) {
        window.clearTimeout(mobileSelectionTimerRef.current);
      }

      mobileSelectionTimerRef.current = window.setTimeout(() => {
        const nextSelection = extractSelection();
        if (nextSelection) {
          selectionSnapshotRef.current = nextSelection;
        }
        setSelectionState(nextSelection);

        if (!nextSelection && attempts > 1) {
          scheduleFinalizeSelection(160, attempts - 1);
        }
      }, delay);
    };

    const handleSelectionStart = (event: Event) => {
      const target = event.target as Node | null;
      if (!target || !chartRef.current?.contains(target)) {
        return;
      }
      isSelectingRef.current = true;
      setSelectionState(null);
      selectionSnapshotRef.current = null;
    };

    const handleSelectionEnd = () => {
      isSelectingRef.current = false;
      scheduleFinalizeSelection(window.innerWidth < 640 ? 220 : 0, window.innerWidth < 640 ? 3 : 1);
    };

    const handleSelectionChange = () => {
      if (window.innerWidth >= 640 && isSelectingRef.current) {
        return;
      }

      scheduleFinalizeSelection(window.innerWidth < 640 ? 220 : 180, window.innerWidth < 640 ? 3 : 1);
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
    selectionSnapshotRef.current = null;
    window.getSelection()?.removeAllRanges();
  }

  function resetChart() {
    setPatient(generatePatient());
    setAnnotations([]);
    setActiveTab(DEFAULT_TAB);
    setCaptureTarget(null);
    setSearchQuery("");
    setSearchFocus(null);
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
    if (!captureTarget) {
      return;
    }

    const nextSelection =
      selectionState ?? selectionSnapshotRef.current ?? extractSelection();
    if (!nextSelection) {
      return;
    }

    const snippet = buildSnippet(nextSelection);
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

  function focusSearchResult(result: ChartSearchResult) {
    startTransition(() => {
      setActiveTab(result.tab);
      setSearchFocus({
        marker: Date.now(),
        resultId: result.id,
        tab: result.tab,
        sourceType: result.sourceType,
        sourceKey: result.sourceKey,
      });
    });
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
          <div className="mb-6 rounded-[24px] border border-border/70 bg-background/70 p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Chart Search
                </div>
                <p className="text-sm text-muted-foreground">
                  Find terms across encounters, problems, medications, labs,
                  vitals, and imaging.
                </p>
              </div>

              <div className="w-full max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search the full chart"
                    className="pl-9 pr-20"
                  />
                  {searchQuery ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 h-8 -translate-y-1/2"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocus(null);
                      }}
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {deferredSearchQuery ? (
              <div className="mt-4 border-t border-border/60 pt-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary">
                    {searchResults.length} match{searchResults.length === 1 ? "" : "es"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Searching for{" "}
                    <span className="font-medium text-foreground">
                      <HighlightedText
                        text={deferredSearchQuery}
                        query={deferredSearchQuery}
                      />
                    </span>
                  </span>
                </div>

                {visibleSearchResults.length > 0 ? (
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {visibleSearchResults.map((result) => {
                      const focused = searchFocus?.resultId === result.id;

                      return (
                        <button
                          key={result.id}
                          type="button"
                          className={cn(
                            "rounded-2xl border border-border/70 bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5",
                            focused && "border-primary/50 bg-primary/5",
                          )}
                          onClick={() => focusSearchResult(result)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold">
                                <HighlightedText
                                  text={result.sourceLabel}
                                  query={deferredSearchQuery}
                                />
                              </div>
                              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                                <HighlightedText
                                  text={result.sectionLabel}
                                  query={deferredSearchQuery}
                                />
                              </div>
                            </div>
                            <Badge variant="outline">{result.matchCount}</Badge>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">
                            <HighlightedText
                              text={result.preview}
                              query={deferredSearchQuery}
                            />
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-muted-foreground">
                    No matches found in this chart.
                  </div>
                )}

                {searchResults.length > visibleSearchResults.length ? (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Showing the first {VISIBLE_SEARCH_RESULT_LIMIT} results. Refine
                    the search to narrow matches.
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div ref={chartRef}>
            <ChartSections
              patient={patient}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={deferredSearchQuery}
              searchResults={searchResults}
              searchFocus={searchFocus}
            />
          </div>
        </section>
      </main>

      {captureTarget && isMobileViewport ? (
        <div
          className="fixed inset-x-3 z-50 rounded-3xl border border-primary/30 bg-card px-4 py-4 shadow-panel"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <div className="text-sm font-medium">
            {captureTarget.field === "diagnosis"
              ? "Select a diagnosis"
              : "Add evidence"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Highlight text in the chart, then tap{" "}
            {captureTarget.field === "diagnosis" ? "Select Highlight" : "Add Evidence"}.
          </div>
          {activeSelection ? (
            <>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {activeSelection.sourceLabel}
              </div>
              <div className="mt-2 max-h-16 overflow-hidden text-sm leading-5">
                {activeSelection.text}
              </div>
            </>
          ) : null}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="min-h-11 flex-1"
              onClick={() => {
                setCaptureTarget(null);
                clearSelection();
              }}
            >
              Cancel
            </Button>
            <Button
              className="min-h-11 flex-1"
              onClick={confirmSelection}
              disabled={!canConfirmSelection}
            >
              {captureTarget.field === "diagnosis" ? "Select Highlight" : "Add Evidence"}
            </Button>
          </div>
        </div>
      ) : null}

      {captureTarget && showDesktopCaptureBanner ? (
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

      {!isMobileViewport && selectionState ? (
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
