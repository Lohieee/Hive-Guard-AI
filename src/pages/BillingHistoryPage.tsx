import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { UserSubscription, PaymentItem } from '../types';

interface BillingHistoryPageProps {
  onNavigate: (route: string) => void;
}

export const BillingHistoryPage: React.FC<BillingHistoryPageProps> = ({ onNavigate }) => {
  const [sub, setSub] = useState<UserSubscription>(paymentService.getCurrentSubscription());
  const [payments, setPayments] = useState<PaymentItem[]>(paymentService.getBillingHistory());
  const [cancelModal, setCancelModal] = useState(false);

  const handleCancelSub = async () => {
    const updated = await paymentService.cancelSubscription();
    setSub(updated);
    setCancelModal(false);
  };

  const handleDownloadInvoice = (pay: PaymentItem) => {
    const content = `HIVEGUARD AI TAX INVOICE\n-------------------------\nInvoice: ${pay.invoice_number}\nDate: ${pay.paid_at}\nPlan: ${sub.plan?.plan_name}\nAmount: INR ${pay.amount_inr}\nStatus: ${pay.status.toUpperCase()}\nProvider Ref: ${pay.provider_payment_id}\n\n Western Ghats Honey Cooperative\nGSTIN: 29AAAAA0000A1Z5\nThank you for protecting your colonies with HIVEGUARD AI.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${pay.invoice_number}.txt`);
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Billing & Invoices
          </h1>
          <p className="text-xs text-slate-600">
            Review active subscription terms, download tax invoices, and manage renewal preferences.
          </p>
        </div>

        <button
          onClick={() => onNavigate('subscription')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Change Subscription Plan</span>
        </button>
      </div>

      {/* Active Subscription Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E3D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              {sub.status === 'active' ? 'Active Subscription' : 'Cancelled'}
            </span>
            <span className="text-xs font-bold text-slate-500">•</span>
            <span className="text-xs font-bold text-slate-700">
              {sub.plan?.billing_interval === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            {sub.plan?.plan_name || 'Annual Colony Protector'}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
            Includes up to {sub.plan?.entitlements.max_hives || 25} hives, {sub.plan?.entitlements.sms_per_month || 200} SMS alerts/month, and full AI risk analytics.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span>Started: {new Date(sub.start_date).toLocaleDateString()}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">
              Next Renewal: {new Date(sub.renewal_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <button
            onClick={() => onNavigate('subscription')}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
          >
            Upgrade / Manage
          </button>
          {sub.status === 'active' && (
            <button
              onClick={() => setCancelModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-colors"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Payment History Invoices Table */}
      <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Payment & Tax Invoices</h3>
            <p className="text-xs text-slate-500">Official GST compliance records and receipts</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{payments.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.invoice_number}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(p.paid_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">₹{p.amount_inr}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">Razorpay ({p.provider_payment_id})</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      Paid ✓
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(p)}
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Cancel Colony Subscription?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you cancel, your automated SMS alerts and high-frequency telemetry storage will stop at the end of your current billing period ({new Date(sub.renewal_date).toLocaleDateString()}).
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSub}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
