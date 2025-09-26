'use client';

import { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import TopHeader from './TopHeader';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileLayout({ children, activeTab, setActiveTab }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col safe-area-inset">
      <TopHeader />
      
      <main className="flex-1 pb-16 px-4 pt-4 overflow-y-auto">
        {children}
      </main>
      
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
