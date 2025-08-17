import { Result, toMessage } from '@/lib/errors';

export async function subscribeToPlan(
  userId: string,
  plan: 'basic' | 'premium',
  opts?: { installments?: boolean }
): Promise<Result<{ subscriptionId: string }>> {
  try {
    // TODO: call Edge Function
    return { ok: true, data: { subscriptionId: `sub_${Date.now()}` } };
  } catch (e) {
    return { ok: false, error: toMessage(e) };
  }
}