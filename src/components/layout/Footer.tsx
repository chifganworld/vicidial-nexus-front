
import React from 'react';
import { useDisplaySettings } from '@/contexts/DisplaySettingsContext';

const Footer: React.FC = () => {
  const { settings } = useDisplaySettings();

  return (
    <footer className="mt-12 text-sm text-slate-500 text-center">
      {settings.companyLogo && (
        <div className="mb-4">
          <img 
            src={settings.companyLogo} 
            alt="Company Logo" 
            className="h-8 mx-auto object-contain"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <p>&copy; {new Date().getFullYear()} {settings.footerText}</p>
      <p>Powered by Lovable AI</p>
    </footer>
  );
};

export default Footer;
