'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useExpense } from '@/contexts/ExpenseContext';
import { TrendingUp, TrendingDown, PieChart, Calendar, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';

export default function Analytics() {
  const { expenses, budgets, categories, monthlySpent, monthlyIncome } = useExpense();

  // Calculate category spending
  const categorySpending = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.name);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = categoryExpenses.length;
    return {
      ...category,
      total,
      count,
      percentage: monthlySpent > 0 ? (total / monthlySpent) * 100 : 0
    };
  }).sort((a, b) => b.total - a.total);

  // Calculate daily spending for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dayExpenses = expenses.filter(exp => 
      format(new Date(exp.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      date,
      total,
      count: dayExpenses.length
    };
  }).reverse();

  const maxDailySpent = Math.max(...last7Days.map(day => day.total));

  // Budget analysis
  const budgetAnalysis = budgets.map(budget => {
    const categoryExpenses = expenses.filter(exp => exp.category === budget.category);
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = (spent / budget.limit) * 100;
    
    return {
      ...budget,
      spent,
      percentage,
      remaining: budget.limit - spent,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  });

  // Payment method analysis
  const paymentMethodStats = expenses.reduce((acc: any, expense) => {
    const methodName = expense.paymentMethod.name;
    if (!acc[methodName]) {
      acc[methodName] = {
        name: methodName,
        icon: expense.paymentMethod.icon,
        total: 0,
        count: 0
      };
    }
    acc[methodName].total += expense.amount;
    acc[methodName].count += 1;
    return acc;
  }, {});

  const paymentMethods = Object.values(paymentMethodStats).sort((a: any, b: any) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="minimal-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <p className="text-xl font-bold text-green-600">₹{monthlyIncome.toLocaleString()}</p>
          <p className="text-xs text-gray-500">This month</p>
        </Card>

        <Card className="minimal-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <p className="text-xl font-bold text-red-600">₹{monthlySpent.toLocaleString()}</p>
          <p className="text-xs text-gray-500">This month</p>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="minimal-card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Spending by Category
            </h3>
            
            <div className="space-y-4">
              {categorySpending.filter(cat => cat.total > 0).map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} transactions
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{category.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="minimal-card p-4">
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {paymentMethods.map((method: any) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{method.icon}</span>
                    <span>{method.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {method.count}
                    </Badge>
                  </div>
                  <span className="font-semibold">₹{method.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="minimal-card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 7 Days
            </h3>
            
            <div className="space-y-3">
              {last7Days.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{format(day.date, 'EEE, MMM d')}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {day.count} transactions
                      </Badge>
                      <span className="font-semibold">₹{day.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-black h-1 rounded-full"
                      style={{ 
                        width: `${maxDailySpent > 0 ? (day.total / maxDailySpent) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="minimal-card p-4">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{expenses.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{expenses.length > 0 ? (monthlySpent / expenses.length).toFixed(0) : '0'}
                </p>
                <p className="text-sm text-gray-600">Avg per Transaction</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-4">
          <Card className="minimal-card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budget Overview
            </h3>
            
            {budgetAnalysis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No budgets set</p>
                <p className="text-sm text-gray-400 mt-1">Set budgets to track your spending</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgetAnalysis.map((budget) => (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{budget.category}</span>
                      <Badge 
                        variant={budget.status === 'over' ? 'destructive' : 
                               budget.status === 'warning' ? 'default' : 'secondary'}
                      >
                        {budget.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={Math.min(budget.percentage, 100)} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{budget.spent.toLocaleString()} spent</span>
                      <span>₹{budget.limit.toLocaleString()} limit</span>
                    </div>
                    
                    {budget.remaining > 0 ? (
                      <p className="text-xs text-green-600">
                        ₹{budget.remaining.toLocaleString()} remaining
                      </p>
                    ) : (
                      <p className="text-xs text-red-600">
                        ₹{Math.abs(budget.remaining).toLocaleString()} over budget
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
