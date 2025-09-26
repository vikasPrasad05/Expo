export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: Date;
  description?: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  receipt?: string;
  recurring?: RecurringExpense;
  location?: string;
  isEssential: boolean;
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  source: string;
  date: Date;
  description?: string;
  recurring?: RecurringIncome;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'digital' | 'bank';
  icon: string;
}

export interface RecurringExpense {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: Date;
  endDate?: Date;
}

export interface RecurringIncome {
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextDate: Date;
  endDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}
