
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Shield } from 'lucide-react';

const AdministrationPage: React.FC = () => {
  const adminCategories = [
    {
      title: 'Application Settings',
      description: 'Configure integrations, display, and user management.',
      link: '/settings',
      icon: <SettingsIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="mr-3 h-8 w-8" />
            Administration
          </h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          Manage system-wide settings and configurations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCategories.map((category) => (
          <Link to={category.link} key={category.title} className="hover-scale-custom">
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center text-red-600 mb-2">
                  {category.icon}
                  <CardTitle className="ml-3 text-xl">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdministrationPage;
