export interface FormData {
  name: string;
  phone: string;
  gender: 'male' | 'female';
  techStack: string[];
  interests: string[];
  resumeFile: File | null;
}

export interface Celebrity {
  id: string;
  name: string;
  image: string;
  gender: 'male' | 'female';
  techStack: string[];
  interests: string[];
  company: string;
  role: string;
  achievements: string[];
  netWorth: string;
  education: string;
  location: string;
}

export interface UserData {
  name: string;
  phone: string;
  resumeUrl: string;
  createdAt: string;
}