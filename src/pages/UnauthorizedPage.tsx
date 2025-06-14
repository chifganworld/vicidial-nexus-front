
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-4">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Access Denied</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        You do not have permission to view this page.
      </p>
      <Link to="/">
        <Button className="mt-6">Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
