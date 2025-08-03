// Common utility functions for the mobile app

/**
 * Format distance from meters to a readable string
 */
export const formatDistance = (
  meters: number,
  unit: 'km' | 'mi' = 'km',
): string => {
  if (unit === 'mi') {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(2)} mi`;
  }

  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }

  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
};

/**
 * Format duration from seconds to a readable string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
};

/**
 * Calculate pace (min/km or min/mi)
 */
export const calculatePace = (
  distanceMeters: number,
  durationSeconds: number,
  unit: 'km' | 'mi' = 'km',
): string => {
  const distance =
    unit === 'km' ? distanceMeters / 1000 : distanceMeters * 0.000621371;
  const paceSeconds = durationSeconds / distance;

  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.floor(paceSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')} /${unit}`;
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
