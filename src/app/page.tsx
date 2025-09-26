'use client';

import { useState, useEffect } from 'react';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import MobileLayout from '@/components/layout/MobileLayout';
import Dashboard from '@/components/Dashboard';
import ExpenseList from '@/components/ExpenseList';
import IncomeList from '@/components/IncomeList';
import Analytics from '@/components/Analytics';
import Settings from '@/components/Settings';
import AddExpense from '@/components/AddExpense';
import AddIncome from '@/components/AddIncome';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [transactionTab, setTransactionTab] = useState('expenses');
  const [fabMenuOpen, setFabMenuOpen] = useState(false);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setFabMenuOpen(false);
    };

    if (fabMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [fabMenuOpen]);

  const handleFabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFabMenuOpen(!fabMenuOpen);
  };

  const handleIncomeClick = () => {
    setShowAddIncome(true);
    setFabMenuOpen(false);
  };

  const handleExpenseClick = () => {
    setShowAddExpense(true);
    setFabMenuOpen(false);
  };

  return (
    <ExpenseProvider>
      <MobileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <Tabs value={transactionTab} onValueChange={setTransactionTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
              </TabsList>

              <TabsContent value="expenses">
                <ExpenseList />
              </TabsContent>

              <TabsContent value="income">
                <IncomeList />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <Settings />}

        {/* Floating Action Button with Menu */}
        <div className="fixed bottom-20 right-4 z-50">
          {/* Menu Items - appear when fabMenuOpen is true */}
          <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${fabMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}>
            {/* Add Income Button */}
            <div className="flex items-center gap-3">
              <span className={`bg-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${fabMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                Add Income
              </span>
              <Button
                onClick={handleIncomeClick}
                className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
                size="icon"
                style={{
                  transitionDelay: fabMenuOpen ? '100ms' : '0ms'
                }}
              >
                <TrendingUp className="h-5 w-5" />
              </Button>
            </div>

            {/* Add Expense Button */}
            <div className="flex items-center gap-3">
              <span className={`bg-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${fabMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                Add Expense
              </span>
              <Button
                onClick={handleExpenseClick}
                className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
                size="icon"
                style={{
                  transitionDelay: fabMenuOpen ? '50ms' : '0ms'
                }}
              >
                <TrendingDown className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main FAB Button */}
          <Button
            onClick={handleFabClick}
            className={`h-14 w-14 rounded-full flat-button shadow-lg transition-all duration-300 ${fabMenuOpen ? 'rotate-45' : 'rotate-0'
              } hover:scale-110`}
            size="icon"
          >
            <Plus className="h-10 w-10" />
          </Button>

        </div>

        {/* Backdrop overlay when menu is open */}
        {/* {fabMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300" />
        )} */}

        {showAddExpense && (
          <AddExpense
            open={showAddExpense}
            onClose={() => setShowAddExpense(false)}
          />
        )}

        {showAddIncome && (
          <AddIncome
            open={showAddIncome}
            onClose={() => setShowAddIncome(false)}
          />
        )}
      </MobileLayout>
    </ExpenseProvider>
  );
}
