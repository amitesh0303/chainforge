'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SAMPLE_QUIZ = {
  id: 'evm-basics',
  title: 'EVM Fundamentals',
  questions: [
    {
      id: '1',
      question: 'What is the maximum size of a smart contract on Ethereum?',
      options: ['12 KB', '24 KB', '48 KB', '64 KB'],
      correctIndex: 1,
      explanation: 'EIP-170 sets the max contract size at 24,576 bytes (~24 KB).',
    },
    {
      id: '2',
      question: 'Which opcode is used for a re-entrant call?',
      options: ['STATICCALL', 'DELEGATECALL', 'CALL', 'CREATE2'],
      correctIndex: 2,
      explanation: 'CALL forwards value and allows the callee to modify state, enabling reentrancy.',
    },
    {
      id: '3',
      question: 'What pattern prevents reentrancy attacks?',
      options: [
        'Factory Pattern',
        'Checks-Effects-Interactions',
        'Pull Payment',
        'Proxy Pattern',
      ],
      correctIndex: 1,
      explanation: 'The Checks-Effects-Interactions pattern updates state before making external calls.',
    },
  ],
};

export function QuizPage({ id: _id }: { id: string }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = SAMPLE_QUIZ.questions[currentQ];
  const progress = ((currentQ) / SAMPLE_QUIZ.questions.length) * 100;

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
      toast.success('Correct! 🎉');
    } else {
      toast.error('Incorrect!');
    }
  }

  function handleNext() {
    if (currentQ + 1 >= SAMPLE_QUIZ.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="bg-slate-900 border-slate-700 max-w-md mx-auto text-center p-8">
            <div className="text-6xl mb-4">
              {score === SAMPLE_QUIZ.questions.length ? '🏆' : score > 0 ? '⭐' : '📚'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-slate-400 mb-4">
              Score: {score}/{SAMPLE_QUIZ.questions.length}
            </p>
            <Progress value={(score / SAMPLE_QUIZ.questions.length) * 100} className="mb-4" />
            <p className="text-yellow-400 font-bold">+{score * 50} XP earned</p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span>⚒️</span>
            <span>ChainForge</span>
          </div>
          <span className="text-slate-400">{SAMPLE_QUIZ.title}</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentQ + 1} of {SAMPLE_QUIZ.questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-900 border-slate-700 mb-4">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{question.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        answered
                          ? i === question.correctIndex
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : i === selected && i !== question.correctIndex
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'border-slate-700 text-slate-400'
                          : selected === i
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-slate-800/50 border-slate-700 mb-4">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-slate-300 text-sm">
                        <span className="text-blue-400 font-semibold">Explanation: </span>
                        {question.explanation}
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
                  >
                    {currentQ + 1 >= SAMPLE_QUIZ.questions.length ? 'Finish Quiz' : 'Next Question →'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
