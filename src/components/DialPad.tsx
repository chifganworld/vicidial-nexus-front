
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, PhoneOff, Backpack } from 'lucide-react'; // Changed Backspace to Backpack

const DialPad: React.FC = () => {
  const [dialedNumber, setDialedNumber] = useState('');

  const handleKeyPress = (key: string) => {
    setDialedNumber((prev) => prev + key);
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    // Placeholder for actual call functionality
    console.log(`Calling ${dialedNumber}...`);
    // We'll integrate API calls here later
  };

  const handleHangUp = () => {
    // Placeholder for actual hang-up functionality
    console.log('Hanging up...');
    // We'll integrate API calls here later
  };

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ];

  return (
    <div className="w-full max-w-xs mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
      <Input
        type="text"
        value={dialedNumber}
        readOnly
        placeholder="Enter number"
        className="text-center text-xl h-12 mb-4"
      />
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant="outline"
            className="text-xl h-14"
            onClick={() => handleKeyPress(btn)}
          >
            {btn}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="ghost" onClick={handleBackspace} className="h-12">
          <Backpack className="h-6 w-6" /> {/* Changed Backspace to Backpack */}
        </Button>
        <Button variant="destructive" onClick={handleClear} className="h-12 col-span-1">
          Clear
        </Button>
         <Button variant="ghost" onClick={handleHangUp} className="text-red-500 hover:bg-red-100 h-12">
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
      <Button
        variant="default"
        className="w-full h-14 bg-green-500 hover:bg-green-600 text-white"
        onClick={handleCall}
      >
        <Phone className="mr-2 h-5 w-5" /> Call
      </Button>
    </div>
  );
};

export default DialPad;
