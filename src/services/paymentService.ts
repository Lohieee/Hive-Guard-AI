// HIVEGUARD AI - Subscription & Indian Payment Gateway Service (Razorpay Integration)
// Implements transparent ₹99/mo and ₹999/yr billing with honest calculations.

import { db, DEFAULT_PLANS } from './mockDb';
import { SubscriptionPlan, UserSubscription, PaymentItem } from '../types';

export interface CheckoutResult {
  success: boolean;
  payment?: PaymentItem;
  subscription?: UserSubscription;
  error?: string;
}

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public getPlans(): SubscriptionPlan[] {
    return DEFAULT_PLANS;
  }

  public getCurrentSubscription(): UserSubscription {
    return db.getSubscription();
  }

  public getBillingHistory(): PaymentItem[] {
    return db.getPayments();
  }

  // Process Plan Checkout (Razorpay Test or Direct Demo)
  public async processCheckout(planCode: 'monthly_standard' | 'yearly_best_value'): Promise<CheckoutResult> {
    const plan = DEFAULT_PLANS.find((p) => p.plan_code === planCode);
    if (!plan) return { success: false, error: 'Invalid plan selected' };

    const user = db.getUser();
    const isYearly = plan.billing_interval === 'yearly';

    // Simulate realistic gateway authorization delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const invoiceNum = `INV-HG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newPayment: PaymentItem = {
      id: `pay_${Date.now()}`,
      owner_id: user.id,
      provider_payment_id: paymentId,
      amount_inr: plan.price_inr,
      currency: 'INR',
      status: 'success',
      invoice_number: invoiceNum,
      paid_at: new Date().toISOString()
    };
    db.addPayment(newPayment);

    const startDate = new Date();
    const renewalDate = new Date();
    if (isYearly) {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    } else {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    const updatedSub: UserSubscription = {
      id: `sub_${Date.now()}`,
      owner_id: user.id,
      plan_id: plan.id,
      plan: plan,
      provider_subscription_id: `sub_rzp_${Date.now()}`,
      status: 'active',
      start_date: startDate.toISOString(),
      renewal_date: renewalDate.toISOString(),
      created_at: startDate.toISOString()
    };
    db.setSubscription(updatedSub);

    return {
      success: true,
      payment: newPayment,
      subscription: updatedSub
    };
  }

  public async cancelSubscription(): Promise<UserSubscription> {
    const current = db.getSubscription();
    const updated: UserSubscription = {
      ...current,
      status: 'cancelled'
    };
    db.setSubscription(updated);
    return updated;
  }
}

export const paymentService = PaymentService.getInstance();
