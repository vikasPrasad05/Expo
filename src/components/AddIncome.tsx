'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useExpense } from '@/contexts/ExpenseContext';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface AddIncomeProps {
  open: boolean;
  onClose: () => void;
  income?: any;
}

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

export default function AddIncome({ open, onClose, income }: AddIncomeProps) {
  const { addIncome, updateIncome } = useExpense();
  
  const [formData, setFormData] = useState({
    title: income?.title || '',
    amount: income?.amount || '',
    source: income?.source || '',
    date: income?.date ? new Date(income.date) : new Date(),
    description: income?.description || '',
    isRecurring: income?.recurring ? true : false,
    recurringFrequency: income?.recurring?.frequency || 'monthly'
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const incomeData = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      source: formData.source,
      date: formData.date,
      description: formData.description,
      recurring: formData.isRecurring ? {
        frequency: formData.recurringFrequency as 'weekly' | 'monthly' | 'yearly',
        nextDate: new Date(),
      } : undefined
    };

    if (income) {
      updateIncome(income.id, incomeData);
    } else {
      addIncome(incomeData);
    }
    
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      amount: '',
      source: '',
      date: new Date(),
      description: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
  };

  const selectedSource = incomeSources.find(source => source.id === formData.source);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            {income ? 'Edit Income' : 'Add New Income'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Income Title</Label>
            <Input
              id="title"
              placeholder="e.g., Monthly Salary, Freelance Project"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          {/* Income Source */}
          <div className="space-y-2">
            <Label>Income Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income source" />
              </SelectTrigger>
              <SelectContent>
                {incomeSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    <span className="flex items-center gap-2">
                      <span>{source.icon}</span>
                      {source.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date Received</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    if (date) {
                      setFormData(prev => ({ ...prev, date }));
                      setShowCalendar(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recurring Income */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring Income</Label>
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
              />
            </div>

            {formData.isRecurring && (
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={formData.recurringFrequency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, recurringFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this income..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              {income ? 'Update' : 'Add'} Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
