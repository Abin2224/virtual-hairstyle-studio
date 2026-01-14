
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum HairLength {
  SHORT = 'Short',
  MEDIUM = 'Medium',
  LONG = 'Long'
}

export interface Hairstyle {
  id: string;
  name: string;
  category: HairLength;
}

export interface GenerationResult {
  imageUrl: string;
  styleName: string;
}

export const MALE_STYLES: Hairstyle[] = [
  { id: 'textured-fade', name: 'Textured Fade', category: HairLength.SHORT },
  { id: 'low-taper-fade', name: 'Low Taper Fade', category: HairLength.SHORT },
  { id: 'high-skin-fade', name: 'High Skin Fade', category: HairLength.SHORT },
  { id: 'burst-fade', name: 'Burst Fade', category: HairLength.SHORT },
  { id: 'buzz-cut', name: 'Classic Buzz Cut', category: HairLength.SHORT },
  { id: 'quiff', name: 'Textured Quiff', category: HairLength.SHORT },
  { id: 'side-part', name: 'Elegant Side Part', category: HairLength.SHORT },
  { id: 'afro-taper', name: 'Afro Taper Fade', category: HairLength.SHORT },
  { id: 'caesar-cut', name: 'Caesar Cut', category: HairLength.SHORT },
  { id: 'french-crop', name: 'French Crop', category: HairLength.SHORT },
  { id: 'faux-hawk', name: 'Faux Hawk', category: HairLength.SHORT },
  { id: 'spiky-hair', name: 'Messy Spiky', category: HairLength.SHORT },
  { id: 'comb-over', name: 'Professional Comb Over', category: HairLength.SHORT },
  { id: 'undercut', name: 'Modern Undercut', category: HairLength.MEDIUM },
  { id: 'slick-back', name: 'Slick Back', category: HairLength.MEDIUM },
  { id: 'curly-top', name: 'Curly Top', category: HairLength.MEDIUM },
  { id: 'mullet', name: 'Modern Mullet', category: HairLength.MEDIUM },
  { id: 'top-knot', name: 'Top Knot', category: HairLength.MEDIUM },
  { id: 'curtain-hair', name: '90s Curtain Hair', category: HairLength.MEDIUM },
  { id: 'bro-flow', name: 'Natural Bro Flow', category: HairLength.MEDIUM },
  { id: 'cornrows-male', name: 'Cornrows', category: HairLength.MEDIUM },
  { id: 'pompadour', name: 'Modern Pompadour', category: HairLength.MEDIUM },
  { id: 'man-bun', name: 'Man Bun', category: HairLength.LONG },
  { id: 'wolf-cut-male', name: 'Wolf Cut', category: HairLength.LONG },
  { id: 'dreadlocks', name: 'Dreadlocks', category: HairLength.LONG },
  { id: 'box-braids-male', name: 'Box Braids', category: HairLength.LONG },
  { id: 'surfer-hair', name: 'Long Surfer Hair', category: HairLength.LONG }
];

export const FEMALE_STYLES: Hairstyle[] = [
  { id: 'bob', name: 'Sleek Bob', category: HairLength.SHORT },
  { id: 'pixie', name: 'Pixie Cut', category: HairLength.SHORT },
  { id: 'female-buzz-cut', name: 'Bold Buzz Cut', category: HairLength.SHORT },
  { id: 'lob', name: 'Long Bob (Lob)', category: HairLength.MEDIUM },
  { id: 'curtain-bangs', name: 'Curtain Bangs', category: HairLength.MEDIUM },
  { id: 'wispy-bangs', name: 'Wispy Bangs', category: HairLength.MEDIUM },
  { id: 'bottleneck-bangs', name: 'Bottleneck Bangs', category: HairLength.MEDIUM },
  { id: 'shag', name: 'Modern Shag', category: HairLength.MEDIUM },
  { id: 'french-twist', name: 'French Twist', category: HairLength.MEDIUM },
  { id: 'blunt-bangs', name: 'Blunt Bangs', category: HairLength.MEDIUM },
  { id: 'side-swept-bangs', name: 'Side-Swept Bangs', category: HairLength.MEDIUM },
  { id: 'messy-bun', name: 'Effortless Messy Bun', category: HairLength.MEDIUM },
  { id: 'chignon', name: 'Classic Chignon', category: HairLength.MEDIUM },
  { id: 'layered', name: 'Long Layered', category: HairLength.LONG },
  { id: 'beach-waves', name: 'Beach Waves', category: HairLength.LONG },
  { id: 'hollywood-waves', name: 'Hollywood Waves', category: HairLength.LONG },
  { id: 'butterfly-cut', name: 'Butterfly Cut', category: HairLength.LONG },
  { id: 'hime-cut', name: 'Hime Cut', category: HairLength.LONG },
  { id: 'wolf-cut-female', name: 'Wolf Cut', category: HairLength.LONG },
  { id: 'box-braids', name: 'Box Braids', category: HairLength.LONG },
  { id: 'senegalese-twists', name: 'Senegalese Twists', category: HairLength.LONG },
  { id: 'french-braids', name: 'French Braids', category: HairLength.LONG },
  { id: 'high-ponytail', name: 'High Ponytail', category: HairLength.LONG },
  { id: 'space-buns', name: 'Space Buns', category: HairLength.LONG },
  { id: 'balayage', name: 'Balayage Waves', category: HairLength.LONG }
];

export interface AppState {
  gender: Gender | null;
  uploadedImage: string | null;
  results: GenerationResult[];
  selectedStyle: string | 'multiple';
  multiSelectedStyles: string[];
  selectedLength: HairLength;
  isGenerating: boolean;
  error: string | null;
  previewResult: GenerationResult | null;
}
