import React from 'react';
const PartnerPaymentHistory: React.FC<{ payment,
  s: unknow,
  n[] }> = ({ payments }) => (
  <div>
    <h3 className = "font-semibold mb-2">Payment History</h3>;
    {!payments?.length ? (
      <div className = "text-gray-400 italic py-4">No payments recorded.</div>;
    ) : (
      <table className = "w-full text-left border">;
        <thead>
          <tr>
            <th className = "p-2 border">Date</th>;
            <th className = "p-2 border">Amount</th>;
            <th className = "p-2 border">Status</th>;
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr key={i}>
              <td className="p-2 border">{p.payment_date?.slice(0, 10)}</td>
              <td className="p-2 border">{p.amount}</td>
              <td className="p-2 border">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
export default PartnerPaymentHistory;
