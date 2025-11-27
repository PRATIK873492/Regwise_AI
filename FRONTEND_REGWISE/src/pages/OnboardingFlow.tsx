import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { onboardingAPI } from "../services/api";
import { OnboardingWorkflow } from "../types";
import { CountrySelector } from "../components/CountrySelector";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  FileText,
  Download,
  AlertCircle,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";

export const OnboardingFlow = () => {
  const { selectedCountry } = useApp();
  const [workflow, setWorkflow] = useState<OnboardingWorkflow | null>(null);
  const [draftWorkflow, setDraftWorkflow] = useState<OnboardingWorkflow | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [exportLoading, setExportLoading] = useState<"pdf" | "json" | null>(
    null
  );
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedCountry) {
      loadWorkflow();
    }
  }, [selectedCountry]);

  const loadWorkflow = async () => {
    if (!selectedCountry) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await onboardingAPI.getWorkflow(selectedCountry.name);
      setWorkflow(data);
      setDraftWorkflow(data);
    } catch (err) {
      setError("Failed to load onboarding workflow. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = () => {
    setDraftWorkflow(workflow);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setDraftWorkflow(workflow);
    setEditMode(false);
  };

  const addStep = () => {
    if (!draftWorkflow) return;
    const newStep = {
      id: `${selectedCountry?.code || "c"}-step-${Date.now()}`,
      stepNumber: draftWorkflow.steps.length + 1,
      title: "New Step",
      description: "",
      required: false,
      documents: [],
      threshold: undefined,
      conditions: [],
      estimatedTime: undefined,
    } as any;
    const newWorkflow = {
      ...draftWorkflow,
      steps: [...draftWorkflow.steps, newStep],
    };
    setDraftWorkflow(newWorkflow);
  };

  const deleteStep = (stepId: string) => {
    if (!draftWorkflow) return;
    const steps = draftWorkflow.steps.filter((s) => s.id !== stepId);
    const renumbered = steps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setDraftWorkflow({ ...draftWorkflow, steps: renumbered });
  };

  const updateStepField = (stepId: string, field: string, value: any) => {
    if (!draftWorkflow) return;
    const steps = draftWorkflow.steps.map((s) => {
      if (s.id !== stepId) return s;
      return { ...s, [field]: value };
    });
    setDraftWorkflow({ ...draftWorkflow, steps });
  };

  const saveWorkflow = async () => {
    if (!selectedCountry || !draftWorkflow) return;
    setIsSaving(true);
    try {
      await onboardingAPI.saveWorkflow(selectedCountry.code, draftWorkflow);
      setWorkflow(draftWorkflow);
      setEditMode(false);
    } catch (err) {
      setError("Failed saving workflow. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: "pdf" | "json") => {
    if (!selectedCountry || !workflow) return;

    setExportLoading(format);

    try {
      if (format === "json") {
        const jsonData = JSON.stringify(workflow, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `onboarding-workflow-${
          selectedCountry.code
        }-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("PDF export would download here. Backend integration required.");
      }
    } catch (err) {
      setError("Export failed. Please try again.");
    } finally {
      setExportLoading(null);
    }
  };

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const currentWorkflow = editMode && draftWorkflow ? draftWorkflow : workflow;
  const completionPercentage = currentWorkflow
    ? (completedSteps.size / currentWorkflow.steps.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-teal-600 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-foreground">Onboarding Flow Generator</h1>
              <p className="text-muted-foreground">
                Generate customized KYC/AML workflows
              </p>
            </div>
          </div>
        </div>

        {/* Country Selection */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-secondary/5 to-teal-600/5">
            <CardTitle>Select Jurisdiction</CardTitle>
            <CardDescription>
              Choose a country to view compliance onboarding requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <CountrySelector variant="compact" />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workflow ? (
          <div className="space-y-6">
            {/* Workflow Overview */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-secondary/10 to-teal-600/10">
              <div className="h-2 bg-gradient-to-r from-secondary to-teal-600 rounded-t-lg" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-2">
                      <Sparkles className="w-6 h-6 text-secondary" />
                      <span>Workflow Overview</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {currentWorkflow?.country} •{" "}
                      {currentWorkflow?.complianceLevel} Level
                    </CardDescription>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-3xl font-bold text-secondary">
                      {completionPercentage.toFixed(0)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Complete</p>
                    {!editMode ? (
                      <div>
                        <Button
                          size="sm"
                          onClick={startEdit}
                          className="bg-white"
                        >
                          Edit Workflow
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveWorkflow}
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : "Save Workflow"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-white">
                    <div
                      style={{ width: `${completionPercentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-secondary to-teal-600 transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                    <Clock className="w-8 h-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estimated Time
                      </p>
                      {editMode ? (
                        <input
                          value={draftWorkflow?.estimatedTime || ""}
                          onChange={(e) =>
                            setDraftWorkflow(
                              (prev) =>
                                ({
                                  ...(prev || {}),
                                  estimatedTime: e.target.value,
                                } as OnboardingWorkflow)
                            )
                          }
                          className="border px-2 py-1 rounded text-sm w-full"
                        />
                      ) : (
                        <p className="font-semibold text-foreground">
                          {currentWorkflow?.estimatedTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                    <FileText className="w-8 h-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Steps
                      </p>
                      <p className="font-semibold text-foreground">
                        {(draftWorkflow || workflow)?.steps.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                    <Shield className="w-8 h-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Compliance
                      </p>
                      {editMode ? (
                        <select
                          value={
                            draftWorkflow?.complianceLevel ||
                            (workflow.complianceLevel as any)
                          }
                          onChange={(e) =>
                            setDraftWorkflow(
                              (prev) =>
                                ({
                                  ...(prev || {}),
                                  complianceLevel: e.target.value,
                                } as OnboardingWorkflow)
                            )
                          }
                          className="border px-2 py-1 rounded text-sm"
                        >
                          <option value="basic">Basic</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option
                            value={currentWorkflow?.complianceLevel as any}
                          >
                            {currentWorkflow?.complianceLevel}
                          </option>
                        </select>
                      ) : (
                        <p className="font-semibold text-foreground">
                          {currentWorkflow?.complianceLevel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/50">
                  <Button
                    variant="outline"
                    onClick={() => handleExport("json")}
                    disabled={!!exportLoading}
                    className="bg-white hover:bg-white/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exportLoading === "json" ? "Exporting..." : "Export JSON"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport("pdf")}
                    disabled={!!exportLoading}
                    className="bg-white hover:bg-white/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exportLoading === "pdf" ? "Exporting..." : "Export PDF"}
                  </Button>
                  {editMode && (
                    <div className="ml-auto">
                      <Button variant="default" size="sm" onClick={addStep}>
                        Add Step
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-teal-600 to-secondary hidden md:block" />

              <div className="space-y-6">
                {(draftWorkflow || workflow).steps.map((step, index) => {
                  const isCompleted = completedSteps.has(step.id);
                  return (
                    <Card
                      key={step.id}
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative ml-0 md:ml-16 ${
                        isCompleted ? "bg-secondary/5" : ""
                      }`}
                    >
                      {/* Step Number Circle */}
                      <div
                        className={`absolute -left-16 top-8 w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg hidden md:flex ${
                          isCompleted
                            ? "bg-gradient-to-br from-secondary to-teal-600 text-white"
                            : "bg-white text-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          step.stepNumber
                        )}
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              {editMode ? (
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={!!step.required}
                                    onChange={(e) =>
                                      updateStepField(
                                        step.id,
                                        "required",
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <span className="text-sm">Required</span>
                                </label>
                              ) : (
                                <Badge
                                  variant={
                                    step.required ? "default" : "secondary"
                                  }
                                  className={
                                    step.required
                                      ? "bg-red-100 text-red-800"
                                      : ""
                                  }
                                >
                                  {step.required ? "Required" : "Optional"}
                                </Badge>
                              )}
                              <span className="md:hidden text-sm font-bold text-muted-foreground">
                                Step {step.stepNumber}
                              </span>
                            </div>
                            {editMode ? (
                              <div>
                                <input
                                  value={step.title}
                                  onChange={(e) =>
                                    updateStepField(
                                      step.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="border px-2 py-1 rounded w-full mb-2"
                                />
                                <textarea
                                  value={step.description || ""}
                                  onChange={(e) =>
                                    updateStepField(
                                      step.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="border px-2 py-1 rounded w-full mb-2"
                                />
                                <input
                                  placeholder="Estimated Time (e.g., 5-10 mins)"
                                  value={step.estimatedTime || ""}
                                  onChange={(e) =>
                                    updateStepField(
                                      step.id,
                                      "estimatedTime",
                                      e.target.value
                                    )
                                  }
                                  className="border px-2 py-1 rounded w-full"
                                />
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-xl">
                                  {step.title}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  {step.description}
                                </CardDescription>
                              </>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={isCompleted ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleStepCompletion(step.id)}
                                  className={
                                    isCompleted
                                      ? "bg-gradient-to-r from-secondary to-teal-600"
                                      : ""
                                  }
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Mark as{" "}
                                  {isCompleted ? "incomplete" : "complete"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {editMode && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteStep(step.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Documents */}
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-3 flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-secondary" />
                            <span>Required Documents</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {editMode ? (
                              <textarea
                                className="border p-2 rounded w-full"
                                value={(step.documents || []).join(", ")}
                                onChange={(e) =>
                                  updateStepField(
                                    step.id,
                                    "documents",
                                    e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            ) : (
                              step.documents?.map((doc, docIndex) => (
                                <div
                                  key={docIndex}
                                  className="flex items-center space-x-2 text-sm p-2 bg-white rounded"
                                >
                                  <ChevronRight className="w-4 h-4 text-secondary flex-shrink-0" />
                                  <span className="text-foreground">{doc}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Threshold */}
                        {(editMode || step.threshold) && (
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900">
                                Threshold
                              </p>
                              {editMode ? (
                                <input
                                  className="border px-2 py-1 rounded text-sm"
                                  value={step.threshold || ""}
                                  onChange={(e) =>
                                    updateStepField(
                                      step.id,
                                      "threshold",
                                      e.target.value
                                    )
                                  }
                                />
                              ) : (
                                <p className="text-sm text-blue-800">
                                  {step.threshold}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Conditions */}
                        {(editMode ||
                          (step.conditions && step.conditions.length > 0)) && (
                          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                            <h4 className="font-medium text-amber-900 mb-2">
                              Conditional Requirements
                            </h4>
                            <ul className="space-y-1">
                              {editMode ? (
                                <li>
                                  <input
                                    className="border px-2 py-1 rounded w-full"
                                    value={(step.conditions || []).join(", ")}
                                    onChange={(e) =>
                                      updateStepField(
                                        step.id,
                                        "conditions",
                                        e.target.value
                                          .split(",")
                                          .map((s) => s.trim())
                                          .filter(Boolean)
                                      )
                                    }
                                  />
                                </li>
                              ) : (
                                step.conditions?.map((condition, condIndex) => (
                                  <li
                                    key={condIndex}
                                    className="flex items-start space-x-2 text-sm text-amber-800"
                                  >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{condition}</span>
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        )}
                      </CardContent>

                      {/* Connection Line to Next Step */}
                      {index < workflow.steps.length - 1 && (
                        <div className="absolute -bottom-3 left-6 transform -translate-x-1/2 hidden md:block">
                          <ChevronRight className="w-6 h-6 text-secondary rotate-90" />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Completion Card */}
            {completedSteps.size === workflow.steps.length && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-lg" />
                <CardContent className="py-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Workflow Complete!
                      </h3>
                      <p className="text-muted-foreground">
                        All {currentWorkflow?.steps.length} steps have been
                        completed for {currentWorkflow?.country}
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg">
                      Generate Compliance Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Workflow Selected
              </h3>
              <p className="text-muted-foreground">
                Select a country above to generate an onboarding workflow
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
