
// Playing notification sounds
let audioContext: AudioContext | null = null;
let notificationSound: AudioBuffer | null = null;
let documentApprovedSound: AudioBuffer | null = null;
let documentRejectedSound: AudioBuffer | null = null;
let isLoading = false;
let soundEnabled = true;

type NotificationSoundType = 'default' | 'approval' | 'rejection';

/**
 * Preload the notification sounds to avoid delay when playing
 */
export const preloadNotificationSounds = async () => {
  if ((notificationSound && documentApprovedSound && documentRejectedSound) || isLoading) return;
  
  try {
    isLoading = true;
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Load default notification sound
    try {
      const defaultResponse = await fetch('/notification.mp3');
      if (defaultResponse.ok) {
        const arrayBuffer = await defaultResponse.arrayBuffer();
        notificationSound = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Default notification sound preloaded successfully');
      }
    } catch (error) {
      console.error('Error preloading default notification sound:', error);
    }
    
    // Load approval notification sound
    try {
      const approvalResponse = await fetch('/approval-notification.mp3');
      if (approvalResponse.ok) {
        const arrayBuffer = await approvalResponse.arrayBuffer();
        documentApprovedSound = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Approval notification sound preloaded successfully');
      } else {
        // Fallback to default sound if approval sound doesn't exist
        documentApprovedSound = notificationSound;
      }
    } catch (error) {
      console.error('Error preloading approval notification sound, using default:', error);
      documentApprovedSound = notificationSound;
    }
    
    // Load rejection notification sound
    try {
      const rejectionResponse = await fetch('/rejection-notification.mp3');
      if (rejectionResponse.ok) {
        const arrayBuffer = await rejectionResponse.arrayBuffer();
        documentRejectedSound = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Rejection notification sound preloaded successfully');
      } else {
        // Fallback to default sound if rejection sound doesn't exist
        documentRejectedSound = notificationSound;
      }
    } catch (error) {
      console.error('Error preloading rejection notification sound, using default:', error);
      documentRejectedSound = notificationSound;
    }
  } catch (error) {
    console.error('Error preloading notification sounds:', error);
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
export const playNotificationSound = async (type: NotificationSoundType = 'default') => {
  if (!soundEnabled) return;
  
  try {
    // If sounds are not preloaded, preload them now
    if (!notificationSound) {
      await preloadNotificationSounds();
    }
    
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume AudioContext if it's suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Determine which sound to play based on type
    let soundToPlay: AudioBuffer | null;
    switch (type) {
      case 'approval':
        soundToPlay = documentApprovedSound || notificationSound;
        break;
      case 'rejection':
        soundToPlay = documentRejectedSound || notificationSound;
        break;
      default:
        soundToPlay = notificationSound;
    }
    
    // Play the sound if available
    if (soundToPlay) {
      const source = audioContext.createBufferSource();
      source.buffer = soundToPlay;
      source.connect(audioContext.destination);
      source.start(0);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Export the old preloadNotificationSound for backward compatibility
export const preloadNotificationSound = preloadNotificationSounds;

// Preload the sounds when this module is imported
preloadNotificationSounds();
