'use client';

import {
  Calculator,
  Code,
  Cpu,
  LineChart,
  Orbit,
  Search,
  Sigma,
  TrendingUp,
} from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const commands = [
  {
    name: 'Run linear algebra simulation',
    icon: Orbit,
  },
  {
    name: 'Analyze probability distribution',
    icon: Sigma,
  },
  {
    name: 'Execute Python script',
    icon: Code,
  },
  {
    name: 'Forecast time series data',
    icon: TrendingUp,
  },
  {
    name: 'Train a new ML model',
    icon: Cpu,
  },
  {
    name: 'Backtest trading strategy',
    icon: Calculator,
  },
  {
    name: 'Plot market data',
    icon: LineChart,
  },
];

export function CommandPalette() {
  return (
    <DialogContent className="max-w-2xl p-0">
      <DialogHeader className="p-4 pb-0">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
      </DialogHeader>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Type a command or search..."
          className="h-12 pl-12 text-lg border-x-0 border-t-0 rounded-none focus-visible:ring-0"
        />
      </div>
      <div className="p-4 max-h-[300px] overflow-y-auto">
        <p className="text-sm text-muted-foreground mb-2">Suggestions</p>
        <ul>
          {commands.map((command, index) => {
            const Icon = command.icon;
            return (
              <li
                key={index}
                className="flex items-center p-2 rounded-md cursor-pointer hover:bg-accent"
              >
                <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>{command.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </DialogContent>
  );
}
