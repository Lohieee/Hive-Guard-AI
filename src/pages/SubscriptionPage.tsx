import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Check,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { SubscriptionPlan, UserSubscription } from '../types';

interface SubscriptionPageProps {
  onNavigate: (route: string) => void;
  onPlanChanged?: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  onNavigate,
  onPlanChanged,
}) => {
  const [currentSub, setCurrentSub] = useState<UserSubscription>(paymentService.getCurrentSubscription());
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutModal, setCheckoutModal] = useState<{ plan: SubscriptionPlan } | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const plans = paymentService.getPlans();
  const monthlyPlan = plans.find((p) => p.billing_interval === 'monthly')!;
  const yearlyPlan = plans.find((p) => p.billing_interval === 'yearly')!;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setCheckoutModal({ plan });
  };

  const handleConfirmPayment = async () => {
    if (!checkoutModal) return;
    setLoadingPlan(checkoutModal.plan.plan_code);

    try {
      const res = await paymentService.processCheckout(checkoutModal.plan.plan_code);
      if (res.success && res.subscription) {
        setCurrentSub(res.subscription);
        setCheckoutSuccess(true);
        if (onPlanChanged) onPlanChanged();
        setTimeout(() => {
          setCheckoutSuccess(false);
          setCheckoutModal(null);
        }, 1500);
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentYearly = currentSub.plan_id === 'plan_yearly';
  const isCurrentMonthly = currentSub.plan_id === 'plan_monthly';

  return (
    <div className="space-y-8 pb-16 font-sans animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Apiculture Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simple, Affordable Plans for Healthier Hives
        </h1>
        <p className="text-sm text-slate-600">
          Start monitoring your colonies and choose a plan that fits your apiary.
        </p>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* PLAN 1: MONTHLY PLAN */}
        <div
          className={`p-7 sm:p-8 rounded-3xl bg-white border flex flex-col justify-between transition-all shadow-xs hover:shadow-md ${
            isCurrentMonthly ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-[#E8E3D9]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Flexible Monthly Plan
              </span>
              {isCurrentMonthly && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-3 mb-1">
              <span className="text-4xl font-black text-slate-900">₹99</span>
              <span className="text-xs font-bold text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Billed monthly at ₹99. Cancel or upgrade anytime without penalties.
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to <strong>10 registered hives</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>50 automated SMS alerts</strong> per month</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real-time environmental telemetry (60s cycle)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI-assisted colony risk analysis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full Varroa mite inspection tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>90-day sensor telemetry history & CSV export</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled={isCurrentMonthly}
              onClick={() => handleSelectPlan(monthlyPlan)}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isCurrentMonthly
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              {isCurrentMonthly ? 'Current Active Plan' : 'Choose Monthly Plan (₹99/mo)'}
            </button>
          </div>
        </div>

        {/* PLAN 2: YEARLY PLAN — BEST VALUE */}
        <div
          className={`relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white border-2 flex flex-col justify-between transition-all shadow-md hover:shadow-lg ${
            isCurrentYearly ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-amber-500'
          }`}
        >
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BEST VALUE — SAVE ₹189</span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Annual Colony Protector
              </span>
              {isCurrentYearly && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-3 mb-0.5">
              <span className="text-4xl font-black text-slate-900">₹999</span>
              <span className="text-xs font-bold text-slate-500">/ year</span>
            </div>
            <p className="text-xs text-slate-400 line-through">
              Regular price: ₹1,188 / year
            </p>

            {/* Transparent Calculation Breakdown Card */}
            <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
              <div className="flex items-center justify-between font-bold">
                <span>You save ₹189 per year</span>
                <span className="text-emerald-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Save approx. 15.9%
                </span>
              </div>
              <p className="text-[11px] text-amber-900">
                Equivalent to <strong>₹83.25/month</strong> (Monthly-equivalent saving of ₹15.75 compared with ₹99/month billing).
              </p>
              <p className="text-[10px] text-amber-800/80">
                * Comparison assumes 12 consecutive months at standard ₹99 monthly rate. Paid annually as ₹999.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Up to 25 registered hives</strong> (Commercial scale)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>200 automated SMS alerts</strong> per month</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High-cadence environmental telemetry (30s cycle)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>AI-assisted colony risk analysis with priority processing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full Varroa mite tracking with computer vision candidate scans</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>365-day full sensor data retention</strong> & CSV exports</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Priority beekeeper technical support</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled={isCurrentYearly}
              onClick={() => handleSelectPlan(yearlyPlan)}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                isCurrentYearly
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isCurrentYearly ? 'Current Active Plan' : 'Choose Yearly Plan (Best Value)'}
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Status & Billing History Shortcut */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8E3D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Active Subscription: {currentSub.plan?.plan_name || 'Annual Plan'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Next scheduled renewal date: {new Date(currentSub.renewal_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('billing')}
          className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
        >
          <span>View Invoices & Billing History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FAQ on Pricing & Indian Billing */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E8E3D9] space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Subscription Questions & Billing Notes</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">How is the ₹189 annual discount calculated?</h4>
            <p>
              Standard monthly billing costs ₹99 every month. Over 12 uninterrupted months, the cumulative cost is ₹1,188. The annual plan is billed as a single upfront payment of ₹999, providing a direct saving of ₹189 (equivalent to ₹83.25/month).
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">What payment methods are supported?</h4>
            <p>
              We integrate with Razorpay supporting UPI (GPay, PhonePe, Paytm), Indian debit/credit cards, and Net Banking with server-side transaction validation.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">What happens if my SMS quota is exceeded?</h4>
            <p>
              In-app web alerts always remain completely free and unlimited. Additional SMS alerts can be topped up at ₹0.25 per message or priority notifications can be routed to your email.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Applicable Taxes & GST</h4>
            <p>
              Prices are inclusive of all statutory agricultural IoT platform service charges and standard Indian GST where applicable. Invoices with GSTIN are generated automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Test Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-300 shadow-2xl p-6 space-y-5">
            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto ring-4 ring-emerald-50">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-600">
                  Your plan has been upgraded to <strong>{checkoutModal.plan.plan_name}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      RZP
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Razorpay Secure Checkout</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Test Gateway</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-bold text-slate-900">{checkoutModal.plan.plan_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing Interval:</span>
                    <span className="capitalize font-semibold">{checkoutModal.plan.billing_interval}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold">
                    <span>Total Payable:</span>
                    <span className="text-emerald-800">₹{checkoutModal.plan.price_inr}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                  <strong>Verification Note:</strong> Payments are verified server-side via Razorpay webhook signatures before activating entitlements in your database profile.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCheckoutModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loadingPlan !== null}
                    onClick={handleConfirmPayment}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {loadingPlan ? (
                      <span>Verifying Gateway...</span>
                    ) : (
                      <>
                        <span>Pay ₹{checkoutModal.plan.price_inr} Securely</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
