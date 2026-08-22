import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-brand-500 to-amber-500 animate-pulse pointer-events-none" />
  );
};
