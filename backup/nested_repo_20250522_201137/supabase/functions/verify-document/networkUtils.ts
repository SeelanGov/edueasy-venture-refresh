
/**
 * Utility to retry fetch requests a specified number of times with exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = 300
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If response is successful but not OK, throw an error
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Fetch attempt failed: ${error.message}. Retries left: ${retries-1}`);
    
    if (retries <= 1) throw error;
    
    // Wait with exponential backoff
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Try again with one less retry and increased backoff
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

/**
 * Safely handle async operations with proper timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError = 'Operation timed out'
): Promise<T> {
  let timeoutId: number;
  
  // Create a promise that rejects after specified timeout
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutError));
    }, ms) as unknown as number;
  });
  
  try {
    // Race the original promise against the timeout
    return await Promise.race([
      promise,
      timeoutPromise
    ]);
  } finally {
    // Always clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
}

/**
 * Check if a URL exists and is accessible
 */
export async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': '*/*',
      },
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get file size from URL without downloading the entire content
 */
export async function getFileSizeFromUrl(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const contentLength = response.headers.get('Content-Length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    return null;
  }
}
