
/**
 * Fetch with retry functionality to handle transient network issues
 * @param url The URL to fetch
 * @param retries Number of retries
 * @param timeout Timeout in ms
 * @returns Response object
 */
export async function fetchWithRetry(url: string, retries = 3, timeout = 10000): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      console.warn(`Fetch attempt ${attempt + 1} failed:`, error, {
        timestamp: new Date().toISOString()
      });
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch after multiple attempts');
}

/**
 * Process a document from URL to base64 data
 * @param imageUrl The URL of the image to process
 * @returns Base64 encoded image data
 */
export async function processDocument(imageUrl: string): Promise<string> {
  console.log('Fetching document image', { timestamp: new Date().toISOString() });
  
  // Convert signed URL to blob with timeout and retry
  const imageResponse = await fetchWithRetry(imageUrl);
  
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: HTTP ${imageResponse.status} - ${imageResponse.statusText}`);
  }
  
  const imageBlob = await imageResponse.blob();
  console.log('Image fetched successfully', { 
    size: imageBlob.size,
    type: imageBlob.type,
    timestamp: new Date().toISOString()
  });
  
  // Convert to base64 for OCR processing
  const arrayBuffer = await imageBlob.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  
  const imageData = `data:${imageBlob.type};base64,${base64}`;
  console.log('Image converted to base64', { timestamp: new Date().toISOString() });
  
  return imageData;
}
