import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Users, MonitorPlay, Cog } from 'lucide-react'; // Using MonitorPlay for Display, Cog for Integrations

const SettingsPage: React.FC = () => {
  const settingsCategories = [
    {
      title: 'Display Settings',
      description: 'Customize the look and feel of the application.',
      link: '/settings/display',
      icon: <MonitorPlay className="h-6 w-6" />,
      comingSoon: false,
    },
    {
      title: 'Integrations',
      description: 'Manage connections to external services like Vicidial.',
      link: '/integration',
      icon: <Cog className="h-6 w-6" />,
    },
    {
      title: 'User Management',
      description: 'Add, remove, or modify user accounts and roles.',
      link: '/settings/users',
      icon: <Users className="h-6 w-6" />,
      comingSoon: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" />
            Application Settings
          </h1>
          <Link to="/supervisor">
            <Button variant="outline">Back to Supervisor Dashboard</Button>
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          Configure various aspects of the Vicidial Nexus application.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <Link to={category.link} key={category.title} className="hover-scale-custom">
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center text-blue-600 mb-2">
                  {category.icon}
                  <CardTitle className="ml-3 text-xl">{category.title}</CardTitle>
                </div>
                {category.comingSoon && (
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
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

export default SettingsPage;
