'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useExpense } from '@/contexts/ExpenseContext';
import { Search, MoreVertical, Edit, Trash2, Calendar, TrendingUp, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import AddIncome from './AddIncome';

const incomeSources = [
  { id: 'salary', name: 'Salary', icon: '💼' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'business', name: 'Business', icon: '🏢' },
  { id: 'investment', name: 'Investment', icon: '📈' },
  { id: 'rental', name: 'Rental', icon: '🏠' },
  { id: 'gift', name: 'Gift', icon: '🎁' },
  { id: 'bonus', name: 'Bonus', icon: '🎯' },
  { id: 'other', name: 'Other', icon: '💰' }
];

export default function IncomeList() {
  const { income, deleteIncome } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIncome, setEditingIncome] = useState(null);

  const filteredIncome = income
    .filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inc.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupIncomeByDate = (incomes: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    incomes.forEach(income => {
      const dateKey = format(new Date(income.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(income);
    });

    return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  const groupedIncome = groupIncomeByDate(filteredIncome);

  const getSourceIcon = (sourceId: string) => {
    const source = incomeSources.find(src => src.id === sourceId);
    return source?.icon || '💰';
  };

  const getSourceName = (sourceId: string) => {
    const source = incomeSources.find(src => src.id === sourceId);
    return source?.name || sourceId;
  };

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="minimal-card p-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-800">Total Income</h2>
            <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search income..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Income List */}
      <div className="space-y-4">
        {groupedIncome.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No income records found</p>
            <p className="text-sm text-gray-400 mt-1">Start adding your income sources</p>
          </div>
        ) : (
          groupedIncome.map(([date, dayIncome]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(date), 'MMMM d, yyyy')}
                </h3>
                <div className="text-sm text-green-600 font-semibold">
                  +₹{dayIncome.reduce((sum, inc) => sum + inc.amount, 0).toLocaleString()}
                </div>
              </div>

              <div className="space-y-2">
                {dayIncome.map((incomeItem) => (
                  <Card key={incomeItem.id} className="minimal-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{getSourceIcon(incomeItem.source)}</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{incomeItem.title}</h4>
                            {incomeItem.recurring && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Repeat className="h-3 w-3" />
                                {incomeItem.recurring.frequency}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <span>{getSourceName(incomeItem.source)}</span>
                          </div>
                          
                          {incomeItem.description && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {incomeItem.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +₹{incomeItem.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(incomeItem.date), 'h:mm a')}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingIncome(incomeItem)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteIncome(incomeItem.id)}
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

      {/* Edit Income Dialog */}
      {editingIncome && (
        <AddIncome
          open={true}
          onClose={() => setEditingIncome(null)}
          income={editingIncome}
        />
      )}
    </div>
  );
}
