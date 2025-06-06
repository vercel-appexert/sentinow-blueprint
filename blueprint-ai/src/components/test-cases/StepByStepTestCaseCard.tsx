import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Edit,
  Trash,
  Save,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestStep {
  id: string;
  description: string;
  expectedResult?: string;
}

interface StepByStepTestCase {
  title: string;
  description?: string;
  preconditions?: string;
  steps: TestStep[];
  expectedOutcome?: string;
}

interface StepByStepTestCaseCardProps {
  testCase: StepByStepTestCase;
  onUpdate: (testCase: StepByStepTestCase) => void;
  onDelete?: () => void;
  className?: string;
  hideTitle?: boolean;
  forceEditMode?: boolean;
}

export function StepByStepTestCaseCard({
  testCase,
  onUpdate,
  onDelete,
  className,
  hideTitle = false,
  forceEditMode = false
}: StepByStepTestCaseCardProps) {
  const [isEditing, setIsEditing] = useState(forceEditMode);
  const [editedTestCase, setEditedTestCase] = useState<StepByStepTestCase>(testCase);
  const [expandedSteps, setExpandedSteps] = useState<boolean>(true);

  // Sync edit mode with forceEditMode prop
  useEffect(() => {
    setIsEditing(forceEditMode);
  }, [forceEditMode]);

  // Sync editedTestCase state when testCase prop changes
  useEffect(() => {
    setEditedTestCase({ ...testCase });
  }, [testCase]);

  const toggleSteps = () => {
    setExpandedSteps(!expandedSteps);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTestCase({ ...testCase });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTestCase({ ...testCase });
  };

  const handleSave = () => {
    onUpdate(editedTestCase);
    setIsEditing(false);
  };

  const updateTitle = (title: string) => {
    setEditedTestCase(prev => ({ ...prev, title }));
  };

  const updatePreconditions = (preconditions: string) => {
    setEditedTestCase(prev => ({ ...prev, preconditions }));
  };

  const updateExpectedOutcome = (expectedOutcome: string) => {
    setEditedTestCase(prev => ({ ...prev, expectedOutcome }));
  };

  const updateStepDescription = (stepId: string, description: string) => {
    setEditedTestCase(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, description } : step
      )
    }));
  };



  const addStep = () => {
    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      description: ''
    };

    setEditedTestCase(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (stepId: string) => {
    setEditedTestCase(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  return (
    <Card className={cn("w-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50", className)}>
      {!hideTitle && (
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              {isEditing ? (
                <Input
                  value={editedTestCase.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="font-semibold text-lg border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Test case title"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800 leading-tight">
                    {editedTestCase.title}
                  </CardTitle>
                </div>
              )}
              <Badge variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-600">
                {editedTestCase.steps.length} {editedTestCase.steps.length === 1 ? 'Step' : 'Steps'}
              </Badge>
            </div>
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave} className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600">
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6 space-y-6">
        {/* Preconditions and Expected Outcome - Description removed as it's already shown with title */}
        <div className="space-y-4">
          {(isEditing || editedTestCase.preconditions) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                <label className="text-sm font-medium text-slate-700">Preconditions</label>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedTestCase.preconditions || ''}
                  onChange={(e) => updatePreconditions(e.target.value)}
                  placeholder="What conditions must be met before executing this test?"
                  className="text-sm border-slate-200 focus:border-amber-300 focus:ring-amber-200"
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed pl-3">
                  {editedTestCase.preconditions}
                </p>
              )}
            </div>
          )}

          {(isEditing || editedTestCase.expectedOutcome) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                <label className="text-sm font-medium text-slate-700">Expected Outcome</label>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedTestCase.expectedOutcome || ''}
                  onChange={(e) => updateExpectedOutcome(e.target.value)}
                  placeholder="What should happen when all steps are completed successfully?"
                  className="text-sm border-slate-200 focus:border-green-300 focus:ring-green-200"
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed pl-3">
                  {editedTestCase.expectedOutcome}
                </p>
              )}
            </div>
          )}
        </div>

        {(editedTestCase.preconditions || editedTestCase.expectedOutcome) && <Separator className="bg-slate-100" />}

        {/* Test Steps */}
        <div className="space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={toggleSteps}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Test Steps</h3>
                <p className="text-xs text-slate-500">Step-by-step execution guide</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {expandedSteps ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {expandedSteps && (
            <div className="space-y-3 pl-2">
              {editedTestCase.steps.map((step, index) => (
                <div key={step.id} className="group">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white/50 hover:bg-white hover:shadow-sm transition-all duration-200">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-3">
                      {/* Action - Removed redundant label since step number badge makes it clear */}
                      <div className="space-y-2">
                        {isEditing ? (
                          <Textarea
                            value={step.description}
                            onChange={(e) => updateStepDescription(step.id, e.target.value)}
                            placeholder="Describe the action to perform"
                            className="text-sm border-slate-200 focus:border-blue-300 focus:ring-blue-200 min-h-[60px]"
                          />
                        ) : (
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {step.description}
                          </p>
                        )}
                      </div>

                      {/* Expected Result - Only show if NOT editing and expectedResult exists */}
                      {(!isEditing && step.expectedResult) && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">Expected Result</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {step.expectedResult}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Step Button */}
              {isEditing && (
                <Button
                  variant="outline"
                  className="w-full mt-4 border-dashed border-slate-300 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                  onClick={addStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Step
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}