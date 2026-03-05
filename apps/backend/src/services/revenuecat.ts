import { SubscriptionStatus } from '../types/index.js';

// TODO: Implement RevenueCat API validation
export async function validateSubscription(_userId: string): Promise<SubscriptionStatus> {
  return { isActive: true, freeAnalysesRemaining: 2 };
}
