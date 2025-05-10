
// Playing notification sounds
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let isLoading = false;
let soundEnabled = true;

/**
 * Preload the notification sound to avoid delay when playing
 */
export const preloadNotificationSound = async () => {
  if (audioBuffer || isLoading) return;
  
  try {
    isLoading = true;
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Try to fetch notification sound
    const response = await fetch('/notification.mp3');
    if (!response.ok) throw new Error('Could not load notification sound');
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode audio data and store it
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    console.log('Notification sound preloaded successfully');
  } catch (error) {
    console.error('Error preloading notification sound:', error);
  } finally {
    isLoading = false;
  }
};

/**
 * Enable or disable sound notifications
 */
export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

/**
 * Get current sound enabled status
 */
export const getSoundEnabled = () => {
  return soundEnabled;
};

/**
 * Play the notification sound
 */
export const playNotificationSound = async () => {
  if (!soundEnabled) return;
  
  try {
    // If sound is not preloaded, preload it now
    if (!audioBuffer) {
      await preloadNotificationSound();
    }
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume AudioContext if it's suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Play the sound
    if (audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Preload the sound when this module is imported
preloadNotificationSound();
