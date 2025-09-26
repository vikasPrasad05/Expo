'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExpense } from '@/contexts/ExpenseContext';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

export default function Dashboard() {
  const { totalBalance, monthlySpent, monthlyIncome, expenses, budgets } = useExpense();

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthlyBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const budgetUsed = monthlyBudget > 0 ? (monthlySpent / monthlyBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="minimal-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Income</p>
              <p className="font-semibold">₹{monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="minimal-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Spent</p>
              <p className="font-semibold">₹{monthlySpent.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card className="minimal-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Monthly Budget
          </h3>
          <Badge variant={budgetUsed > 80 ? "destructive" : "default"}>
            {budgetUsed.toFixed(0)}% used
          </Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${budgetUsed > 80 ? 'bg-red-500' : 'bg-black'}`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>₹{monthlySpent.toLocaleString()}</span>
          <span>₹{monthlyBudget.toLocaleString()}</span>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Recent Transactions
        </h3>
        
        <div className="space-y-3">
          {recentExpenses.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No transactions yet</p>
          ) : (
            recentExpenses.map((expense:any) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{expense.category === 'Food & Dining' ? '🍽️' : '💰'}</div>
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-₹{expense.amount}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
