
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatItem {
  name: string;
  value: string | number;
}

const agentStats: StatItem[] = [
  { name: 'Calls Made', value: 25 },
  { name: 'Talk Time', value: '2h 15m' },
  { name: 'Leads Converted', value: 5 },
  { name: 'Average Handle Time', value: '5m 30s' },
];

const chartData = [
  { name: 'Mon', calls: 10, duration: 120 },
  { name: 'Tue', calls: 15, duration: 180 },
  { name: 'Wed', calls: 8, duration: 90 },
  { name: 'Thu', calls: 20, duration: 240 },
  { name: 'Fri', calls: 12, duration: 150 },
];

const AgentStatsDisplay: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Real-time Stats</CardTitle>
        {/* Icon can be added here if desired, e.g., <BarChart2 className="h-4 w-4 text-muted-foreground" /> */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">Performance</div>
        <p className="text-xs text-muted-foreground mb-4">
          Your current session statistics.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {agentStats.map((stat) => (
            <div key={stat.name} className="p-3 bg-gray-50 rounded-md shadow-sm">
              <p className="text-xs text-muted-foreground">{stat.name}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="h-48"> {/* Fixed height for the chart container */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#8884d8" name="Calls" />
              {/* <Bar dataKey="duration" fill="#82ca9d" name="Duration (min)" /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentStatsDisplay;
