
// Playing notification sounds
let audioContext: AudioContext | null = null;

export const playNotificationSound = async () => {
  try {
    // Create AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Try to fetch notification sound
    const response = await fetch('/notification.mp3');
    if (!response.ok) throw new Error('Could not load notification sound');
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Resume AudioContext if it's suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Decode audio data and play it
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};
