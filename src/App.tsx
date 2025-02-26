import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { MatchForm } from './components/MatchForm';
import { MatchResult } from './components/MatchResult';
import { celebrities } from './data/celebrities';
import type { FormData } from './types';

function App() {
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const findMatch = (data: FormData) => {
    const oppositeGender = data.gender === 'male' ? 'female' : 'male';
    const eligibleCelebrities = celebrities.filter(c => c.gender === oppositeGender);

    const matches = eligibleCelebrities.map(celebrity => {
      const techStackMatch = celebrity.techStack.filter(tech => 
        data.techStack.includes(tech)).length;
      const interestsMatch = celebrity.interests.filter(interest => 
        data.interests.includes(interest)).length;
      
      return {
        celebrity,
        score: techStackMatch + interestsMatch
      };
    });

    const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
    setMatchResult(bestMatch.celebrity.id);
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12 slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-white animate-float" />
            <h1 className="text-5xl font-bold text-white">TechShaadi.com</h1>
          </div>
          <p className="text-xl text-white/90 mt-4">Find Your Perfect Tech Soulmate</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 slide-up" style={{ backdropFilter: 'blur(10px)' }}>
            {!matchResult ? (
              <>
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                  Start Your Tech Love Story
                </h2>
                <MatchForm onSubmit={findMatch} />
              </>
            ) : (
              <MatchResult 
                celebrityId={matchResult} 
                onReset={() => setMatchResult(null)} 
              />
            )}
          </div>
        </div>
      </div>

      <footer className="w-full py-6 backdrop-blur-lg bg-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-white/90 font-medium">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" fill="currentColor" />
            <span>by</span>
            <a 
              href="mailto:amtul@shaadi.com" 
              className="text-white hover:text-purple-200 transition-colors duration-300"
            >
              Amtul@Shaadi.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;