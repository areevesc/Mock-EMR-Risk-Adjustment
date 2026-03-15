import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileOutput,
  Highlighter,
  PencilLine,
  Plus,
  Printer,
  Quote,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Annotation, AnnotationType } from "@/types/patient";

type CaptureField = "diagnosis" | "evidence";

interface WorksheetProps {
  annotations: Annotation[];
  captureTarget: { annotationId: string; field: CaptureField } | null;
  onAddAnnotation: () => void;
  onRemoveAnnotation: (annotationId: string) => void;
  onUpdateAnnotation: (
    annotationId: string,
    updater: (annotation: Annotation) => Annotation,
  ) => void;
  onRemoveEvidence: (annotationId: string, evidenceId: string) => void;
  onStartCapture: (annotationId: string, field: CaptureField) => void;
  onPrint: (mode: "referenced" | "full") => void;
}

const annotationTypeOptions: Array<{ label: AnnotationType; value: AnnotationType }> = [
  { label: "Supported", value: "Supported" },
  { label: "Contradictory", value: "Contradictory" },
  { label: "Not Supported", value: "Not Supported" },
  { label: "Query Needed", value: "Query Needed" },
  { label: "Suspect Condition", value: "Suspect Condition" },
  { label: "General Note", value: "General Note" },
];

const typeClassMap: Record<AnnotationType, string> = {
  Supported: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Contradictory: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  "Not Supported":
    "border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  "Query Needed":
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "Suspect Condition":
    "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "General Note":
    "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

export function Worksheet({
  annotations,
  captureTarget,
  onAddAnnotation,
  onRemoveAnnotation,
  onUpdateAnnotation,
  onRemoveEvidence,
  onStartCapture,
  onPrint,
}: WorksheetProps) {
  const [editingSourceFor, setEditingSourceFor] = useState<string | null>(null);
  const [editingSourceText, setEditingSourceText] = useState("");

  useEffect(() => {
    if (!editingSourceFor) {
      return;
    }

    const source = annotations.find((annotation) => annotation.id === editingSourceFor)?.diagnosisSource;
    if (!source) {
      setEditingSourceFor(null);
      setEditingSourceText("");
    }
  }, [annotations, editingSourceFor]);

  function startEditingSource(annotation: Annotation) {
    if (!annotation.diagnosisSource) {
      return;
    }
    setEditingSourceFor(annotation.id);
    setEditingSourceText(annotation.diagnosisSource.text);
  }

  function cancelEditingSource() {
    setEditingSourceFor(null);
    setEditingSourceText("");
  }

  function saveEditingSource(annotationId: string) {
    const nextText = editingSourceText.replace(/\s+/g, " ").trim();
    if (!nextText) {
      return;
    }

    onUpdateAnnotation(annotationId, (current) => {
      if (!current.diagnosisSource) {
        return current;
      }

      const shouldSyncDiagnosis =
        !current.manualDiagnosis || current.diagnosis === current.diagnosisSource.text;

      return {
        ...current,
        diagnosis: shouldSyncDiagnosis ? nextText : current.diagnosis,
        diagnosisSource: {
          ...current.diagnosisSource,
          text: nextText,
        },
      };
    });

    cancelEditingSource();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/70 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Coding Worksheet</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Capture diagnoses and support directly from the chart.
            </p>
          </div>
          <Badge variant="secondary">{annotations.length}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onAddAnnotation} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            Add Annotation
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onPrint("referenced")}>
                <FileOutput className="mr-2 h-4 w-4" />
                Worksheet + Referenced
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onPrint("full")}>
                <FileOutput className="mr-2 h-4 w-4" />
                Full Chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {annotations.length === 0 ? (
          <div className="border-t border-dashed border-border pt-5 text-sm text-muted-foreground">
            Create an annotation, then use text highlighting in the chart to capture a diagnosis or supporting evidence.
          </div>
        ) : null}

        {annotations.map((annotation, index) => (
          <article
            key={annotation.id}
            className="border-t border-border/70 py-5 first:border-t-0 first:pt-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold">Annotation {index + 1}</div>
                  <div className="text-xs text-muted-foreground">
                    Evidence snippets: {annotation.evidence.length}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAnnotation(annotation.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 space-y-5">
              <section className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Type
                </label>
                <Select
                  value={annotation.type}
                  options={annotationTypeOptions}
                  onChange={(event) =>
                    onUpdateAnnotation(annotation.id, (current) => ({
                      ...current,
                      type: event.target.value as AnnotationType,
                    }))
                  }
                />
                <div>
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      typeClassMap[annotation.type],
                    )}
                  >
                    {annotation.type}
                  </span>
                </div>
              </section>

              <section className="space-y-3 border-t border-border/60 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Diagnosis
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onUpdateAnnotation(annotation.id, (current) => ({
                        ...current,
                        manualDiagnosis: !current.manualDiagnosis,
                      }))
                    }
                  >
                    <PencilLine className="h-4 w-4" />
                    {annotation.manualDiagnosis ? "Use Capture" : "Manual Entry"}
                  </Button>
                </div>
                <Input
                  value={annotation.diagnosis}
                  readOnly={!annotation.manualDiagnosis}
                  placeholder={
                    annotation.manualDiagnosis
                      ? "Type a diagnosis"
                      : "Use “Select from Chart” to capture diagnosis text"
                  }
                  onChange={(event) =>
                    onUpdateAnnotation(annotation.id, (current) => ({
                      ...current,
                      diagnosis: event.target.value,
                    }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      captureTarget?.annotationId === annotation.id &&
                      captureTarget.field === "diagnosis"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => onStartCapture(annotation.id, "diagnosis")}
                  >
                    <Highlighter className="h-4 w-4" />
                    Select from Chart
                  </Button>
                  <Button
                    variant={
                      captureTarget?.annotationId === annotation.id &&
                      captureTarget.field === "evidence"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => onStartCapture(annotation.id, "evidence")}
                  >
                    <Quote className="h-4 w-4" />
                    Add Evidence
                  </Button>
                </div>
                {annotation.diagnosisSource ? (
                  <div className="border-l-2 border-sky-500/50 pl-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
                          Captured Diagnosis Source
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {annotation.diagnosisSource.sourceLabel}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingSourceFor === annotation.id ? null : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingSource(annotation)}
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit Source
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (editingSourceFor === annotation.id) {
                              cancelEditingSource();
                            }
                            onUpdateAnnotation(annotation.id, (current) => ({
                              ...current,
                              diagnosisSource: undefined,
                              manualDiagnosis: true,
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Source
                        </Button>
                      </div>
                    </div>
                    {editingSourceFor === annotation.id ? (
                      <div className="mt-3 space-y-3">
                        <Textarea
                          value={editingSourceText}
                          onChange={(event) => setEditingSourceText(event.target.value)}
                          className="min-h-[96px]"
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEditingSource(annotation.id)}
                            disabled={!editingSourceText.trim()}
                          >
                            Save Source
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEditingSource}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <blockquote className="mt-3 border-l-2 border-sky-500/40 pl-3 italic">
                        {annotation.diagnosisSource.text}
                      </blockquote>
                    )}
                  </div>
                ) : null}
              </section>

              <section className="space-y-2 border-t border-border/60 pt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Evidence / Details
                </label>
                <div className="space-y-2">
                  {annotation.evidence.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No evidence captured yet.
                    </div>
                  ) : null}
                  {annotation.evidence.length > 0 ? (
                    <div className="divide-y divide-border/60 border-t border-border/60">
                      {annotation.evidence.map((snippet) => (
                        <div key={snippet.id} className="py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <blockquote className="border-l-2 border-primary/70 pl-3 italic">
                                {snippet.text}
                              </blockquote>
                              <div className="mt-2 text-xs text-muted-foreground">
                                {snippet.sourceLabel}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveEvidence(annotation.id, snippet.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="space-y-2 border-t border-border/60 pt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Notes
                </label>
                <Textarea
                  value={annotation.notes}
                  placeholder="Reviewer comments, query rationale, or coding notes"
                  onChange={(event) =>
                    onUpdateAnnotation(annotation.id, (current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </section>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
