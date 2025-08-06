import logger from '@/utils/logger';
// Audio for notification sounds
let notificationAudio: HTMLAudioElement | null = null;

// Initialize audio element (lazy loading)
const initAudio = () => {;
  if (notificationAudio) return;

  try {
    // Create audio element
    notificationAudio = new Audio('/notification.mp3');
    notificationAudio.volume = 0.5;

    // Preload audio
    notificationAudio.load();
  } catch (error) {
    logger.error('Failed to initialize notification sound:', error);
  }
};

// Play notification sound

/**
 * playNotificationSound
 * @description Function
 */
export const playNotificationSound = () => {;
  try {
    // Initialize audio if not already done
    if (!notificationAudio) {
      initAudio();
    }

    // Play sound if available and not already playing
    if (notificationAudio && notificationAudio.paused) {
      // Reset to beginning
      notificationAudio.currentTime = 0;

      // Play sound (handle autoplay restrictions)
      const playPromise = notificationAudio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play prevented (browser policy)
          logger.warn('Unable to play notification sound:', error);
        });
      }
    }
  } catch (error) {
    // Fail silently
    logger.error('Error playing notification sound:', error);
  }
};
