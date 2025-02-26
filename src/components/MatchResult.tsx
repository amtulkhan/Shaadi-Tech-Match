import React, { useState } from 'react';
import { RefreshCw, Heart, Trophy, GraduationCap, MapPin, Coins, ImageOff } from 'lucide-react';
import { celebrities } from '../data/celebrities';

interface MatchResultProps {
  celebrityId: string;
  onReset: () => void;
}

export function MatchResult({ celebrityId, onReset }: MatchResultProps) {
  const celebrity = celebrities.find(c => c.id === celebrityId);
  const [imageError, setImageError] = useState(false);

  if (!celebrity) return null;

  return (
    <div className="text-center slide-up">
      <div className="mb-8">
        <Heart className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
        <h2 className="text-3xl font-bold text-purple-900 mt-4">
          We Found Your Tech Soulmate!
        </h2>
      </div>

      <div className="relative mb-8">
        {imageError ? (
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-purple-400" />
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse group-hover:scale-105 transition-transform duration-300"></div>
            <img
              src={celebrity.image}
              alt={celebrity.name}
              className="relative w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-xl transform transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        )}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm shadow-lg">
          {celebrity.role}
        </div>
      </div>

      <div className="space-y-8 mb-10">
        <div className="transform transition-all duration-300 hover:scale-105">
          <h3 className="text-3xl font-bold text-gray-800">{celebrity.name}</h3>
          <p className="text-xl text-purple-600 font-medium mt-2">{celebrity.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto text-sm">
          <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-purple-50 transform transition-all duration-300 hover:-translate-y-1">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <span className="font-medium">{celebrity.education}</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-pink-50 transform transition-all duration-300 hover:-translate-y-1">
            <MapPin className="h-5 w-5 text-pink-600" />
            <span className="font-medium">{celebrity.location}</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-xl bg-yellow-50 col-span-2 transform transition-all duration-300 hover:-translate-y-1">
            <Coins className="h-5 w-5 text-yellow-600" />
            <span className="font-medium">Net Worth: {celebrity.netWorth}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg text-gray-700 font-medium">Tech Expertise</p>
          <div className="flex flex-wrap justify-center gap-3">
            {celebrity.techStack.map(tech => (
              <span
                key={tech}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-700 font-medium">Interests & Passions</p>
          <div className="flex flex-wrap justify-center gap-3">
            {celebrity.interests.map(interest => (
              <span
                key={interest}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <p className="text-lg text-gray-700 font-medium">Key Achievements</p>
          </div>
          <ul className="text-sm text-gray-700 space-y-3">
            {celebrity.achievements.map((achievement, index) => (
              <li
                key={index}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl transform transition-all duration-300 hover:-translate-y-1"
              >
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
      >
        <RefreshCw className="h-5 w-5" />
        Find Another Match
      </button>
    </div>
  );
}