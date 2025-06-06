import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash, Save, X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { cn } from '@/lib/utils';

interface BDDScenario {
  id: string;
  title: string;
  steps: {
    type: 'given' | 'when' | 'then' | 'and' | 'but';
    content: string;
  }[];
}

interface BDDFeature {
  title: string;
  description?: string;
  scenarios: BDDScenario[];
}

interface BDDTestCaseCardProps {
  feature: BDDFeature;
  onUpdate: (feature: BDDFeature) => void;
  onDelete?: () => void;
  className?: string;
  hideTitle?: boolean;
  forceEditMode?: boolean;
}

export function BDDTestCaseCard({ feature, onUpdate, onDelete, className, hideTitle = false, forceEditMode = false }: BDDTestCaseCardProps) {
  const [isEditing, setIsEditing] = useState(forceEditMode);
  const [editedFeature, setEditedFeature] = useState<BDDFeature>(feature);

  // Sync edit mode with forceEditMode prop
  useEffect(() => {
    setIsEditing(forceEditMode);
  }, [forceEditMode]);

  // Sync editedFeature state when feature prop changes
  useEffect(() => {
    setEditedFeature({ ...feature });
  }, [feature]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFeature({ ...feature });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFeature({ ...feature });
  };

  const handleSave = () => {
    onUpdate(editedFeature);
    setIsEditing(false);
  };

  const updateFeatureTitle = (title: string) => {
    setEditedFeature(prev => ({ ...prev, title }));
  };

  const updateFeatureDescription = (description: string) => {
    setEditedFeature(prev => ({ ...prev, description }));
  };

  const updateScenarioTitle = (scenarioId: string, title: string) => {
    setEditedFeature(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === scenarioId ? { ...s, title } : s
      )
    }));
  };

  const updateStep = (scenarioId: string, stepIndex: number, field: 'content' | 'type', value: string) => {
    setEditedFeature(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === scenarioId
          ? {
            ...s,
            steps: s.steps.map((step, idx) =>
              idx === stepIndex ? { ...step, [field]: value } : step
            )
          }
          : s
      )
    }));
  };

  const addStep = (scenarioId: string, type: 'given' | 'when' | 'then' | 'and' | 'but') => {
    setEditedFeature(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === scenarioId
          ? {
            ...s,
            steps: [...s.steps, { type, content: '' }]
          }
          : s
      )
    }));
  };

  const removeStep = (scenarioId: string, stepIndex: number) => {
    setEditedFeature(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s =>
        s.id === scenarioId
          ? {
            ...s,
            steps: s.steps.filter((_, idx) => idx !== stepIndex)
          }
          : s
      )
    }));
  };




  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'given': return 'text-blue-500';
      case 'when': return 'text-purple-500';
      case 'then': return 'text-green-500';
      case 'and': return 'text-gray-500';
      case 'but': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      {!hideTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            {isEditing ? (
              <Input
                value={editedFeature.title}
                onChange={(e) => updateFeatureTitle(e.target.value)}
                className="font-semibold text-lg"
              />
            ) : (
              <CardTitle>{editedFeature.title}</CardTitle>
            )}
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {/* Only show description in edit mode or if it's meaningful and different from title */}
        {isEditing && (
          <AutosizeTextarea
            value={editedFeature.description || ''}
            onChange={(e) => updateFeatureDescription(e.target.value)}
            placeholder="Optional: Add feature description if needed"
            minHeight={20}
            maxHeight={200}
            className="text-sm h-4 mb-4"
          />
        )}

        {/* Simplified scenario display - since BDD should have 1:1 test case to scenario ratio */}
        <div className="space-y-4">
          {editedFeature.scenarios.map((scenario, scenarioIndex) => (
            <div key={scenario.id} className="space-y-3">
              {scenarioIndex > 0 && <Separator />}

              {/* Scenario title - only show in edit mode since it's often redundant with test case title */}
              {isEditing && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Scenario Title</label>
                  <AutosizeTextarea
                    value={scenario.title}
                    onChange={(e) => updateScenarioTitle(scenario.id, e.target.value)}
                    placeholder="Scenario title (often same as test case title)"
                    minHeight={20}
                    className="text-sm h-4"
                  />
                </div>
              )}

              {/* Steps */}
              <div className="space-y-2">
                {scenario.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    {isEditing ? (
                      <>
                        <Select
                          value={step.type}
                          onValueChange={(value) => updateStep(scenario.id, index, 'type', value)}
                        >
                          <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="given">Given</SelectItem>
                            <SelectItem value="when">When</SelectItem>
                            <SelectItem value="then">Then</SelectItem>
                            <SelectItem value="and">And</SelectItem>
                            <SelectItem value="but">But</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={step.content}
                          onChange={(e) => updateStep(scenario.id, index, 'content', e.target.value)}
                          placeholder="Step description"
                          className="flex-1 h-8 text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(scenario.id, index)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-start gap-3 w-full">
                        <span className={`${getStepTypeColor(step.type)} font-medium capitalize text-sm min-w-[60px]`}>
                          {step.type}
                        </span>
                        <span className="text-sm flex-1">{step.content}</span>
                      </div>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addStep(scenario.id, 'given')}
                      className="h-7 text-xs px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Step
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}