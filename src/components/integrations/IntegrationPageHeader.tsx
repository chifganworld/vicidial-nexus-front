
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface IntegrationPageHeaderProps {
  backLink: string;
}

const IntegrationPageHeader: React.FC<IntegrationPageHeaderProps> = ({ backLink }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl">Integrations</CardTitle>
        <Link to={backLink}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <CardDescription>
        Configure connection details for external services like Vicidial or a SIP Server.
        Be careful with API credentials and connection settings.
      </CardDescription>
    </CardHeader>
  );
};

export default IntegrationPageHeader;
