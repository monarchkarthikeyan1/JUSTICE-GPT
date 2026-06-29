import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
        <p className="text-sm text-amber-700">
          This is an educational tool only. The information provided should not be considered as legal advice. 
          Please consult with a qualified legal professional for specific legal matters.
        </p>
      </div>
    </div>
  );
};