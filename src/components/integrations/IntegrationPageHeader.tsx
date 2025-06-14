
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
        <CardTitle className="text-2xl">Vicidial Integration Settings</CardTitle>
        <Link to={backLink}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <CardDescription>
        Configure the connection details for your Vicidial server.
        Be careful with API credentials.
      </CardDescription>
    </CardHeader>
  );
};

export default IntegrationPageHeader;
