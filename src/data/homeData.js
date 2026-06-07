import {
  Landmark,
  Camera,
  Languages,
  Sparkles,
  Box,
  Globe2,
} from 'lucide-react';

import hero1 from '../assets/images/home/hero-1.png';
import hero2 from '../assets/images/home/hero-2.png';
import hero3 from '../assets/images/home/hero-3.png';
import hero4 from '../assets/images/home/hero-4.png';
import hero5 from '../assets/images/home/hero-5.png';

export const heroSlides = [
  { id: 1, image: hero1 },
  { id: 2, image: hero2 },
  { id: 3, image: hero3 },
  { id: 4, image: hero4 },
  { id: 5, image: hero5 },
];

export const navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Collection', path: '/collections' },
  { label: 'Artifacts', path: '/artifact-details' },
  { label: 'Gallery', path: '/media-gallery' },
  { label: 'Scan & AI', path: '/scan' },
  { label: 'Translate AI', path: '/translate' },
];

export const stats = [
  { icon: Landmark, value: '11+', label: 'Artifacts' },
  { icon: Globe2, value: '7', label: 'Languages' },
  { icon: Sparkles, value: 'AI', label: 'Powered' },
  { icon: Box, value: 'chat', label: 'Experience' },
];

export const features = [
  {
    icon: Landmark,
    title: 'Explore the museum freely',
    description:
      'Navigate through the halls of history with interactive routes and smart digital guidance.',
  },
  {
    icon: Camera,
    title: 'Scan and discover artifacts',
    description:
      'Scan artifacts and unlock historical context, stories, and interactive museum details.',
  },
  {
    icon: Languages,
    title: 'Translate ancient hieroglyphs',
    description:
      'Use AI-powered translation to understand ancient symbols in a simple modern way.',
  },
];
