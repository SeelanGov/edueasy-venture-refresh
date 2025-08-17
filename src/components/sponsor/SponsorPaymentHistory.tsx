import React from 'react';
import { type SponsorPayment  } from '@/hooks/useSponsorPayments';



interface SponsorPaymentHistoryProps {
  payments: SponsorPayment[];
}

/**
 * SponsorPaymentHistory
 * @description Function
 */
export const SponsorPaymentHistory: React.FC<SponsorPaymentHistoryProps> = ({ payments }) => (
  <div className="overflow-x-auto border rounded-md bg-white shadow-sm">
    <table className="min-w-full table-auto">
      <thead className="bg-cap-teal/5">
        <tr>
          <th className="px-3 py-2">Amount</th>
          <th className="px-3 py-2">Method</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Payment Date</th>
          <th className="px-3 py-2">Invoice #</th>
          <th className="px-3 py-2">Reference</th>
        </tr>
      </thead>
      <tbody>
        {payments.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-6 text-center text-[#BDBDBD]">
              No payment records found.
            </td>
          </tr>
        ) : (
          payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-3 py-2 font-semibold">R {payment.amount.toLocaleString()}</td>
              <td className="px-3 py-2">{payment.payment_method || '-'}</td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${payment.status === 'paid' ? 'bg-[#F0F9F0] text-green-700' : 'bg-gray-200 text-[#424242]'}`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-3 py-2">
                {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
              </td>
              <td className="px-3 py-2">{payment.invoice_number || '-'}</td>
              <td className="px-3 py-2">{payment.reference_number || '-'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default SponsorPaymentHistory;
