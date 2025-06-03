import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users } from 'lucide-react';

interface NoProjectAccessProps {
  title?: string;
  description?: string;
  showCard?: boolean;
}

export function NoProjectAccess({ 
  title = "No Project Access",
  description = "You don't have access to any projects yet. Please contact your workspace administrator to be added to a project to start viewing data.",
  showCard = true 
}: NoProjectAccessProps) {
  const content = (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <div>
          <h3 className="font-medium text-amber-900 mb-1">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100 rounded-md p-2">
          <Users className="h-3 w-3" />
          <span>Contact your administrator to request project access</span>
        </div>
      </AlertDescription>
    </Alert>
  );

  if (showCard) {
    return (
      <Card className="bg-card/50 border border-border/50">
        <CardContent className="p-6">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}
