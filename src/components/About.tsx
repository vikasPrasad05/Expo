'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Heart, Coffee, Users, Star, Code, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [showUPI, setShowUPI] = useState(false);

  const contributors = [
    {
      id: 1,
      name: "Alok Mahapatra", 
      role: "Lead Developer",
      avatar: "", 
      github: "https://github.com/AlokMahapatra26", 
      contributions: ["Frontend Development", "UI/UX Design", "PWA Implementation"]
    },
    {
      id: 2,
      name: "Vikas Prasad", 
      role: "Lead Developer",
      avatar: "", 
      github: "https://github.com/VikasPrasad11", 
      contributions: ["Data Management", "Analytics", "Performance Optimization"]
    }
  ];

  const copyUPI = () => {
    navigator.clipboard.writeText("yourname@paytm"); // Replace with your actual UPI ID
    alert("UPI ID copied to clipboard!");
  };

  const projectStats = {
    version: "1.0.0",
    lastUpdated: "September 2025",
    features: 15,
    downloads: "1K+"
  };

  return (
    <div className="space-y-6 pb-6">
      {/* App Info Header */}
      {/* <Card className="minimal-card p-6 text-center ">
        <div className="text-4xl mb-3">💰</div>
        <h1 className="text-2xl font-bold mb-2">Expense Manager Pro</h1>
        <p className="text-gray-600 mb-4">Complete offline expense tracking solution with native app experience</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">v{projectStats.version}</Badge>
          <Badge variant="outline">Open Source</Badge>
          <Badge variant="outline">PWA Ready</Badge>
        </div>
      </Card> */}

      {/* Project Stats */}
      {/* <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Star className="h-4 w-4" />
          Project Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{projectStats.features}</p>
            <p className="text-sm text-gray-600">Features</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{projectStats.downloads}</p>
            <p className="text-sm text-gray-600">Users</p>
          </div>
        </div>
      </Card> */}

      {/* Contributors Section */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Contributors
        </h3>
        
        <div className="space-y-4">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-3xl">{contributor.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{contributor.name}</h4>
                  <Badge variant="outline" className="text-xs">{contributor.role}</Badge>
                </div>
                {/* <div className="flex flex-wrap gap-1 mb-2">
                  {contributor.contributions.map((contribution, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {contribution}
                    </Badge>
                  ))}
                </div> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(contributor.github, '_blank')}
                  className="h-8 px-2 text-xs"
                >
                  <Github className="h-3 w-3 mr-1" />
                  GitHub Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Support Section */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          Support Our Work
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          If you find this app helpful, consider supporting our development efforts. Your contribution helps us maintain and improve the app.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => setShowUPI(!showUPI)}
            className="w-full cursor-pointer text-white"
          >
            <Coffee className="h-4 w-4 mr-2" />
            Support with UPI
          </Button>
          
          {showUPI && (
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium mb-2">UPI Payment Details:</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <code className="text-sm">alokmahapatra2604@oksbi</code>
                <Button size="sm" variant="outline" onClick={copyUPI}>
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ₹10, ₹50, ₹100 - Every contribution matters! 🙏
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* GitHub Repository */}
      <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Code className="h-4 w-4" />
          Open Source
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          This project is open source! Check out the code, report issues, or contribute to make it better.
        </p>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('https://github.com/AlokMahapatra26/expo', '_blank')} 
          >
            <Github className="h-4 w-4 mr-2" />
            View on GitHub
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          
          {/* <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://github.com/yourusername/expense-manager-pro/issues', '_blank')}
            >
              Report Bug
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://github.com/yourusername/expense-manager-pro/pulls', '_blank')}
            >
              Contribute
            </Button>
          </div> */}
        </div>
      </Card>

      {/* Technology Stack */}
      {/* <Card className="minimal-card p-4">
        <h3 className="font-semibold mb-4">Built With</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>Next.js 14</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎨</span>
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span>PWA Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>shadcn/ui</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💾</span>
            <span>Local Storage</span>
          </div>
        </div>
      </Card> */}

      {/* Contact & Social */}
      {/* <Card className="minimal-card p-4 text-center">
        <h3 className="font-semibold mb-2">Get in Touch</h3>
        <p className="text-sm text-gray-600 mb-3">
          Have suggestions or feedback? We'd love to hear from you!
        </p>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('mailto:your.email@example.com', '_blank')} // Replace with your email
          >
            Email Us
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://twitter.com/yourusername', '_blank')} // Replace with your Twitter
          >
            Follow
          </Button>
        </div>
      </Card> */}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 py-4">
        <p className="mt-1">© 2025 Expense Manager Pro. All rights reserved.</p>
      </div>
    </div>
  );
}
