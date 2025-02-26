import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { FormData } from '../types';
import { saveUserData } from '../lib/storage';

interface MatchFormProps {
  onSubmit: (data: FormData) => void;
}

export function MatchForm({ onSubmit }: MatchFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    gender: 'female',
    techStack: [],
    interests: [],
    resumeFile: null
  });

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const techOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'AI', 'Machine Learning', 'Robotics'];
  const interestOptions = ['Space Technology', 'Social Media', 'Virtual Reality', 'Education', 'Sustainability', 'Blockchain'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    if (!formData.resumeFile) {
      setError('Please upload your resume');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      saveUserData(formData.name, formData.phone, formData.resumeFile);
      onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="transition-all duration-300 hover:transform hover:translate-y-[-2px]">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-300"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="transition-all duration-300 hover:transform hover:translate-y-[-2px]">
          <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-300"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="transition-all duration-300">
          <label className="block text-lg font-medium text-gray-700 mb-3">Gender *</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative">
              <input
                type="radio"
                className="peer sr-only"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' })}
              />
              <div className="p-4 rounded-xl text-center border-2 border-purple-100 cursor-pointer transition-all duration-300 peer-checked:bg-purple-500 peer-checked:text-white peer-checked:border-purple-500 hover:border-purple-300">
                Female
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                className="peer sr-only"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' })}
              />
              <div className="p-4 rounded-xl text-center border-2 border-purple-100 cursor-pointer transition-all duration-300 peer-checked:bg-purple-500 peer-checked:text-white peer-checked:border-purple-500 hover:border-purple-300">
                Male
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700">Tech Stack</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {techOptions.map((tech) => (
              <label key={tech} className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={formData.techStack.includes(tech)}
                  onChange={(e) => {
                    const newTechStack = e.target.checked
                      ? [...formData.techStack, tech]
                      : formData.techStack.filter((t) => t !== tech);
                    setFormData({ ...formData, techStack: newTechStack });
                  }}
                />
                <div className="p-3 rounded-xl text-center text-sm border-2 border-purple-100 cursor-pointer transition-all duration-300 peer-checked:bg-purple-500 peer-checked:text-white peer-checked:border-purple-500 hover:border-purple-300">
                  {tech}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700">Interests</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <label key={interest} className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={formData.interests.includes(interest)}
                  onChange={(e) => {
                    const newInterests = e.target.checked
                      ? [...formData.interests, interest]
                      : formData.interests.filter((i) => i !== interest);
                    setFormData({ ...formData, interests: newInterests });
                  }}
                />
                <div className="p-3 rounded-xl text-center text-sm border-2 border-purple-100 cursor-pointer transition-all duration-300 peer-checked:bg-purple-500 peer-checked:text-white peer-checked:border-purple-500 hover:border-purple-300">
                  {interest}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="transition-all duration-300">
          <label className="block text-lg font-medium text-gray-700 mb-3">Resume *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-100 border-dashed rounded-xl hover:border-purple-300 transition-all duration-300">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-purple-500 animate-float" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="resume"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    required
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
              {formData.resumeFile && (
                <p className="text-sm text-green-600">
                  Selected: {formData.resumeFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? 'Finding Your Match...' : 'Find My Tech Soulmate'}
      </button>
    </form>
  );
}