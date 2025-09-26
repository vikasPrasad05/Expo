'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/contexts/ExpenseContext';

export default function TopHeader() {
  const { totalBalance } = useExpense();

  return (
    <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <h2 className='text-xl ml-4 font-bold'>EXPO</h2>
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Balance</p>
          <p className="text-lg font-semibold">₹{totalBalance.toLocaleString()}</p>
        </div>
        
        {/* <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </header>
  );
}
