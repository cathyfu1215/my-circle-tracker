// Task color palette
export const TASK_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFD166', // Yellow
  '#2EC4B6', // Turquoise
  '#F79824', // Orange
  '#9B5DE5', // Purple
  '#00BBF9', // Blue
];

// Progress level colors (white to saturated)
export const PROGRESS_LEVEL_COLORS = {
  NOTHING: 'white',
  MINIMAL: (baseColor: string) => adjustColorBrightness(baseColor, 60),
  TARGET: (baseColor: string) => adjustColorBrightness(baseColor, 30),
  BEYOND_TARGET: (baseColor: string) => baseColor,
};

// Helper function to adjust brightness of a hex color
function adjustColorBrightness(hex: string, brightnessFactor: number): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const newR = Math.min(255, r + brightnessFactor);
  const newG = Math.min(255, g + brightnessFactor);
  const newB = Math.min(255, b + brightnessFactor);
  
  // Convert back to hex
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${
    Math.round(newG).toString(16).padStart(2, '0')}${
    Math.round(newB).toString(16).padStart(2, '0')}`;
}

// UI theme colors
export const THEME_COLORS = {
  primary: '#5E60CE',
  secondary: '#64DFDF',
  background: '#F5F5F5',
  text: '#333333',
  textLight: '#777777',
  white: '#FFFFFF',
  border: '#DDDDDD',
  success: '#4CAF50',
  error: '#F44336',
}; 