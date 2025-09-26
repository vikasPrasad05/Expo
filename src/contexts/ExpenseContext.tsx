'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Expense, Income, Budget, PaymentMethod, Category } from '@/types/expense';

interface ExpenseContextType {
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  paymentMethods: PaymentMethod[];
  categories: Category[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  totalBalance: number;
  monthlySpent: number;
  monthlyIncome: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#FF6B6B',
    subcategories: ['Restaurants', 'Groceries', 'Fast Food', 'Coffee']
  },
  {
    id: '2',
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    subcategories: ['Fuel', 'Public Transport', 'Taxi/Uber', 'Parking']
  },
  {
    id: '3',
    name: 'Entertainment',
    icon: '🎬',
    color: '#45B7D1',
    subcategories: ['Movies', 'Games', 'Streaming', 'Events']
  },
  {
    id: '4',
    name: 'Shopping',
    icon: '🛍️',
    color: '#96CEB4',
    subcategories: ['Clothing', 'Electronics', 'Books', 'Gifts']
  },
  {
    id: '5',
    name: 'Bills & Utilities',
    icon: '📄',
    color: '#FFEAA7',
    subcategories: ['Electricity', 'Water', 'Internet', 'Phone']
  },
  {
    id: '6',
    name: 'Healthcare',
    icon: '🏥',
    color: '#FD79A8',
    subcategories: ['Medicine', 'Doctor', 'Insurance', 'Fitness']
  }
];

const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Cash', type: 'cash', icon: '💵' },
  { id: '2', name: 'Credit Card', type: 'card', icon: '💳' },
  { id: '3', name: 'UPI', type: 'digital', icon: '📱' },
  { id: '4', name: 'Bank Transfer', type: 'bank', icon: '🏦' }
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [income, setIncome] = useLocalStorage<Income[]>('income', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [paymentMethods] = useLocalStorage<PaymentMethod[]>('paymentMethods', defaultPaymentMethods);
  const [categories] = useLocalStorage<Category[]>('categories', defaultCategories);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addIncome = (newIncome: Omit<Income, 'id'>) => {
    const incomeWithId = {
      ...newIncome,
      id: Date.now().toString(),
    };
    setIncome([...income, incomeWithId]);
  };

  const updateIncome = (id: string, updatedIncome: Partial<Income>) => {
    setIncome(income.map(inc => 
      inc.id === id ? { ...inc, ...updatedIncome } : inc
    ));
  };

  const deleteIncome = (id: string) => {
    setIncome(income.filter(inc => inc.id !== id));
  };

  const addBudget = (newBudget: Omit<Budget, 'id'>) => {
    const budgetWithId = {
      ...newBudget,
      id: Date.now().toString(),
      spent: 0
    };
    setBudgets([...budgets, budgetWithId]);
  };

  // Update budget spent amounts when expenses change
  useEffect(() => {
    if (budgets.length > 0) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const updatedBudgets = budgets.map(budget => {
        const categoryExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          let isCurrentPeriod = false;
          
          switch (budget.period) {
            case 'monthly':
              isCurrentPeriod = expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
              break;
            case 'weekly':
              // Simple weekly logic - you can enhance this
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              isCurrentPeriod = expenseDate >= weekAgo;
              break;
            case 'yearly':
              isCurrentPeriod = expenseDate.getFullYear() === currentYear;
              break;
          }
          
          return expense.category === budget.category && isCurrentPeriod;
        });
        
        const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return { ...budget, spent };
      });
      
      // Only update if there's a change to avoid infinite loops
      const hasChanges = updatedBudgets.some((budget, index) => 
        budget.spent !== budgets[index].spent
      );
      
      if (hasChanges) {
        setBudgets(updatedBudgets);
      }
    }
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const monthlyIncomeData = income.filter(inc => {
    const incomeDate = new Date(inc.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });

  const monthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = monthlyIncomeData.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        income,
        budgets,
        paymentMethods,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        updateIncome,
        deleteIncome,
        addBudget,
        totalBalance,
        monthlySpent,
        monthlyIncome,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
