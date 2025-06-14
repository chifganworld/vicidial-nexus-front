
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SupervisorTools: React.FC = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Supervisor Tools</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button asChild><Link to="/reports">View Agent Stats</Link></Button>
        <Button asChild><Link to="/settings/users">Manage Users</Link></Button>
        <Button asChild><Link to="/settings">Campaign Settings</Link></Button>
        <Button asChild><Link to="/hopper">View Hopper</Link></Button>
      </div>
    </>
  );
};

export default SupervisorTools;
