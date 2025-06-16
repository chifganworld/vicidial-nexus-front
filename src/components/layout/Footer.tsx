
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 text-sm text-slate-500 text-center">
      <p>&copy; {new Date().getFullYear()} Vicidial Nexus. All rights reserved.</p>
      <p>Powered by Lovable AI</p>
    </footer>
  );
};

export default Footer;
