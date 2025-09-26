'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useExpense } from '@/contexts/ExpenseContext';
import { Download, Settings as SettingsIcon, Trash2, Database, Bell, Moon, Palette } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

export default function Settings() {
  const { expenses, income, budgets, addBudget, categories } = useExpense(); // Added categories
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  });
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Title', 'Amount', 'Category', 'Subcategory', 'Payment Method', 'Location', 'Tags', 'Description'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        format(new Date(expense.date), 'yyyy-MM-dd'),
        `"${expense.title}"`,
        expense.amount,
        expense.category,
        expense.subcategory || '',
        expense.paymentMethod.name,
        expense.location || '',
        `"${expense.tags.join(', ')}"`,
        `"${expense.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF
  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.text('Expense Report', 20, 30);
    
    // Summary
    pdf.setFontSize(12);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    
    pdf.text(`Report Generated: ${format(new Date(), 'PPP')}`, 20, 50);
    pdf.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 20, 65);
    pdf.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 20, 80);
    pdf.text(`Net Balance: ₹${(totalIncome - totalExpenses).toLocaleString()}`, 20, 95);
    
    // Recent Expenses
    pdf.text('Recent Expenses:', 20, 115);
    
    let yPosition = 130;
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    recentExpenses.forEach((expense, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setFontSize(10);
      pdf.text(`${format(new Date(expense.date), 'MMM dd')} - ${expense.title}`, 20, yPosition);
      pdf.text(`₹${expense.amount.toLocaleString()}`, 150, yPosition);
      pdf.text(expense.category, 20, yPosition + 10);
      yPosition += 20;
    });
    
    pdf.save(`expense-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Get available categories for budget (categories that don't already have a budget)
  const availableCategories = categories.filter(category => 
    !budgets.some(budget => budget.category === category.name)
  );

  // Add budget
  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      addBudget({
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        period: newBudget.period as 'weekly' | 'monthly' | 'yearly',
        startDate: new Date(),
        endDate: new Date(),
        spent: 0
      });
      setNewBudget({ category: '', limit: '', period: 'monthly' });
      setShowBudgetDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV Format</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={exportFormat === 'csv' ? exportToCSV : exportToPDF}
              className="flat-button"
            >
              Export
            </Button>
          </div>
          
          <p className="text-sm text-gray-600">
            {exportFormat === 'csv' 
              ? 'Export all expense data in CSV format for spreadsheet applications.'
              : 'Generate a comprehensive PDF report with summaries and charts.'
            }
          </p>
        </div>
      </Card>

      {/* Budget Management */}
      <Card className="minimal-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Budget Management
          </h3>
          
          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="flat-button"
                disabled={availableCategories.length === 0}
              >
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  {availableCategories.length === 0 ? (
                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                      All categories already have budgets set
                    </div>
                  ) : (
                    <Select 
                      value={newBudget.category} 
                      onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div>
                  <Label>Budget Limit (₹)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Period</Label>
                  <Select 
                    value={newBudget.period} 
                    onValueChange={(value) => setNewBudget(prev => ({ ...prev, period: value }))}
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
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBudgetDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddBudget} 
                    className="flex-1 flat-button"
                    disabled={!newBudget.category || !newBudget.limit}
                  >
                    Add Budget
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No budgets set. Create your first budget!</p>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => {
              const category = categories.find(cat => cat.name === budget.category);
              return (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category?.icon || '💰'}</span>
                    <div>
                      <p className="font-medium">{budget.category}</p>
                      <p className="text-sm text-gray-600">₹{budget.limit.toLocaleString()} / {budget.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{budget.spent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {((budget.spent / budget.limit) * 100).toFixed(0)}% used
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {availableCategories.length === 0 && budgets.length > 0 && (
          <p className="text-xs text-gray-500 text-center mt-3">
            All expense categories have budgets set. You can manage existing budgets above.
          </p>
        )}
      </Card>

      {/* App Preferences */}
      {/* <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600">Get reminded about budgets</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Backup</Label>
              <p className="text-sm text-gray-600">Backup data locally</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card> */}

      {/* Data Management */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Database className="h-4 w-4" />
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{expenses.length}</p>
              <p className="text-sm text-gray-600">Total Expenses</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{income.length}</p>
              <p className="text-sm text-gray-600">Income Records</p>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={clearAllData}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            This will permanently delete all your expense data. This action cannot be undone.
          </p>
        </div>
      </Card>

      {/* App Info */}
      <Card className="minimal-card p-4">
        <div className="text-center space-y-2">
          <h3 className="font-semibold">Expense Manager Pro</h3>
          <p className="text-sm text-gray-600">Version 1.0.0</p>
          <p className="text-xs text-gray-500">
            A complete offline expense tracking solution with native app experience.
          </p>
        </div>
      </Card>
    </div>
  );
}
