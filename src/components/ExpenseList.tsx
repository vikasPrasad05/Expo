'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useExpense } from '@/contexts/ExpenseContext';
import { Search, Filter, MoreVertical, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import AddExpense from './AddExpense';

export default function ExpenseList() {
  const { expenses, deleteExpense, categories } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const groupExpensesByDate = (expenses: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    expenses.forEach(expense => {
      const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    });

    return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  const groupedExpenses = groupExpensesByDate(filteredExpenses);

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || '💰';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search expenses..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {groupedExpenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          groupedExpenses.map(([date, dayExpenses]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(date), 'MMMM d, yyyy')}
                </h3>
                <div className="text-sm text-gray-500">
                  ₹{dayExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                {dayExpenses.map((expense) => (
                  <Card key={expense.id} className="minimal-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{expense.title}</h4>
                            {expense.isEssential && (
                              <Badge variant="outline" className="text-xs">Essential</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{expense.category}</span>
                            {expense.subcategory && (
                              <>
                                <span>•</span>
                                <span>{expense.subcategory}</span>
                              </>
                            )}
                          </div>
                          
                          {expense.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{expense.location}</span>
                            </div>
                          )}
                          
                          {expense.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {expense.tags.slice(0, 2).map((tag:any) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {expense.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{expense.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-red-600">
                            -₹{expense.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            {expense.paymentMethod.icon} {expense.paymentMethod.name}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingExpense(expense)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <AddExpense
          open={true}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
        />
      )}
    </div>
  );
}
