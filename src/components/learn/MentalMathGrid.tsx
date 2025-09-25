'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Timer, Award, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

type Operation = 'addition' | 'subtraction' | 'multiplication';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  id: number;
  text: string;
  answer: number;
  userAnswer: string;
  isCorrect: boolean | null;
}

const generateProblem = (
  operation: Operation,
  difficulty: Difficulty
): { text: string; answer: number } => {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      a = Math.floor(Math.random() * 9) + 1; // 1-9
      b = Math.floor(Math.random() * 9) + 1; // 1-9
      break;
    case 'medium':
      a = Math.floor(Math.random() * 90) + 10; // 10-99
      b = Math.floor(Math.random() * 90) + 10; // 10-99
      break;
    case 'hard':
      a = Math.floor(Math.random() * 900) + 100; // 100-999
      b = Math.floor(Math.random() * 90) + 10; // 10-99
      break;
  }

  switch (operation) {
    case 'addition':
      return { text: `${a} + ${b}`, answer: a + b };
    case 'subtraction':
      // Ensure result is not negative
      if (a < b) [a, b] = [b, a];
      return { text: `${a} - ${b}`, answer: a - b };
    case 'multiplication':
       switch (difficulty) {
        case 'easy':
          a = Math.floor(Math.random() * 12) + 1;
          b = Math.floor(Math.random() * 12) + 1;
          break;
        case 'medium':
          a = Math.floor(Math.random() * 20) + 5;
          b = Math.floor(Math.random() * 10) + 2;
          break;
        case 'hard':
           a = Math.floor(Math.random() * 50) + 10;
           b = Math.floor(Math.random() * 20) + 5;
           break;
      }
      return { text: `${a} × ${b}`, answer: a * b };
  }
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <Card className={cn('flex flex-col justify-between', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const MentalMathGrid = () => {
  const [gridSize, setGridSize] = useState(9);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [operation, setOperation] = useState<Operation>('multiplication');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>(
    'idle'
  );
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetGame = useCallback(() => {
    setGameState('idle');
    const newProblems: Problem[] = [];
    for (let i = 0; i < gridSize; i++) {
      const { text, answer } = generateProblem(operation, difficulty);
      newProblems.push({
        id: i,
        text,
        answer,
        userAnswer: '',
        isCorrect: null,
      });
    }
    setProblems(newProblems);
    setTimer(0);
    setFinalTime(0);
    setCorrectAnswers(0);
    inputRefs.current = [];
  }, [gridSize, operation, difficulty]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'running') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStart = () => {
    resetGame();
    setGameState('running');
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleInputChange = (id: number, value: string) => {
    const newProblems = [...problems];
    newProblems[id].userAnswer = value;
    setProblems(newProblems);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      const nextId = id + 1;
      if (nextId < problems.length) {
        inputRefs.current[nextId]?.focus();
      } else {
        checkAnswers();
      }
    }
  };

  const checkAnswers = () => {
    setGameState('finished');
    setFinalTime(timer);
    let correctCount = 0;
    const checkedProblems = problems.map((p) => {
      const isCorrect =
        !isNaN(parseInt(p.userAnswer)) && parseInt(p.userAnswer) === p.answer;
      if (isCorrect) {
        correctCount++;
      }
      return { ...p, isCorrect };
    });
    setProblems(checkedProblems);
    setCorrectAnswers(correctCount);
  };
  
  const accuracy = problems.length > 0 ? (correctAnswers / problems.length) * 100 : 0;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">
          Mental Math Training
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sharpen your calculation skills under pressure. A key tool for quant
          interviews.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Settings and Stats */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="operation">Operation</Label>
                <Select
                  value={operation}
                  onValueChange={(v: Operation) => setOperation(v)}
                  disabled={gameState === 'running'}
                >
                  <SelectTrigger id="operation">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">Addition (+)</SelectItem>
                    <SelectItem value="subtraction">Subtraction (-)</SelectItem>
                    <SelectItem value="multiplication">
                      Multiplication (×)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(v: Difficulty) => setDifficulty(v)}
                  disabled={gameState === 'running'}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <Button onClick={handleStart} className="w-full" size="lg">
                {gameState === 'running' ? 'Restart' : 'Start New Session'}
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
             <StatCard icon={Timer} label="Time" value={`${finalTime || timer}s`} />
             <StatCard icon={Target} label="Accuracy" value={`${accuracy.toFixed(0)}%`} />
             <StatCard icon={Award} label="Score" value={correctAnswers} />
          </div>

        </div>

        {/* Math Grid */}
        <div className="md:col-span-2">
          <Card className="p-4">
            <AnimatePresence>
              <motion.div
                key={operation + difficulty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {problems.map((p, index) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        'transition-colors',
                        gameState === 'finished' &&
                          (p.isCorrect
                            ? 'border-green-500/50 bg-green-500/10'
                            : 'border-red-500/50 bg-red-500/10')
                      )}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4">
                        <p className="text-lg font-semibold text-muted-foreground">
                          {p.text}
                        </p>
                        <div className="relative mt-2 w-full">
                          <Input
                            ref={(el) => (inputRefs.current[p.id] = el)}
                            type="number"
                            value={p.userAnswer}
                            onChange={(e) =>
                              handleInputChange(p.id, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, p.id)}
                            disabled={gameState !== 'running'}
                            className="text-center text-xl font-bold pr-7"
                          />
                          <AnimatePresence>
                           {gameState === 'finished' && (
                             <motion.div
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               className="absolute right-2 top-1/2 -translate-y-1/2"
                             >
                               {p.isCorrect ? (
                                 <CheckCircle className="h-5 w-5 text-green-500" />
                               ) : (
                                 <XCircle className="h-5 w-5 text-red-500" />
                               )}
                             </motion.div>
                           )}
                         </AnimatePresence>
                        </div>
                        {gameState === 'finished' && !p.isCorrect && (
                           <p className="mt-1 text-xs font-bold text-green-600">
                             Ans: {p.answer}
                           </p>
                         )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
             {gameState === 'running' && (
              <Button onClick={checkAnswers} className="mt-6 w-full">
                Submit Answers
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentalMathGrid;
