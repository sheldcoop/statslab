'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dices, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const question = {
  title: 'What is the probability of rolling a 7 with two standard six-sided dice?',
  options: [
    { value: '1/6', isCorrect: true, icon: <Dices /> },
    { value: '1/12', isCorrect: false, icon: <Dices /> },
    { value: '2/7', isCorrect: false, icon: <Dices /> },
  ],
  feedback: {
    correct:
      'Correct! There are 6 ways to roll a 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) out of 36 possible combinations (6*6), which simplifies to 1/6.',
    incorrect:
      'Not quite. There are 6 ways to roll a 7 out of 36 possible outcomes. The probability is 6/36, which simplifies to 1/6.',
  },
};

export default function TestYourIntuition() {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (value: string) => {
    if (answered) return;
    setSelected(value);
    setAnswered(true);
  };

  const getButtonClass = (option: typeof question.options[0]) => {
    if (!answered) {
      return 'bg-card hover:bg-border';
    }
    if (option.isCorrect) {
      return 'bg-green-500/20 border-green-500 text-green-300';
    }
    if (selected === option.value && !option.isCorrect) {
      return 'bg-red-500/20 border-red-500 text-red-300';
    }
    return 'bg-card opacity-50';
  };
  
  const getIcon = (option: typeof question.options[0]) => {
    if (!answered) return option.icon;
    if (option.isCorrect) return <Check className="h-6 w-6" />;
    if (selected === option.value && !option.isCorrect) return <X className="h-6 w-6" />;
    return option.icon;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full text-center"
    >
      <h2 className="font-headline text-4xl font-bold md:text-5xl">
        Test Your Intuition
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
        Engage with interactive concepts and see if you can get it right.
      </p>
      <div className="mx-auto mt-12 max-w-2xl rounded-lg border-2 border-border bg-card/50 p-8">
        <h3 className="font-headline text-2xl font-semibold">
          {question.title}
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={answered}
              className={cn(
                'group flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 text-2xl font-bold transition-all duration-200',
                getButtonClass(option)
              )}
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {getIcon(option)}
              </div>
              <span>{option.value}</span>
            </button>
          ))}
        </div>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="mt-6 text-left text-base text-muted-foreground"
          >
            {selected &&
            question.options.find((o) => o.value === selected)?.isCorrect
              ? question.feedback.correct
              : question.feedback.incorrect}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
