
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneMissed, PhoneOff, PhoneIncoming, PhoneForwarded } from 'lucide-react';

const stats = [
  { title: 'Answered Calls', value: '125', icon: <Phone className="h-6 w-6 text-green-500" /> },
  { title: 'Abandoned Calls', value: '12', icon: <PhoneOff className="h-6 w-6 text-red-500" /> },
  { title: 'Calls in Queue', value: '5', icon: <PhoneIncoming className="h-6 w-6 text-yellow-500" /> },
  { title: 'Missed Calls', value: '8', icon: <PhoneMissed className="h-6 w-6 text-orange-500" /> },
  { title: 'Failed Calls', value: '2', icon: <PhoneForwarded className="h-6 w-6 text-purple-500" /> },
];

const StatsBar: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsBar;
