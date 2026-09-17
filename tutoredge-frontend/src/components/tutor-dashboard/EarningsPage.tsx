import { Banknote, Hourglass, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

import Button from '../ui/Button';

// --- Mock Data ---
const statsCards = [
  { title: 'Earnings (This Month)', value: '₹12,500', icon: TrendingUp },
  { title: 'Pending Payout', value: '₹3,200', icon: Hourglass },
  { title: 'Lifetime Earnings', value: '₹1,45,700', icon: Banknote },
];

const mockPayouts = [
  { id: 1, date: 'Sep 5, 2025', amount: '₹10,000', status: 'Paid' },
  { id: 2, date: 'Aug 5, 2025', amount: '₹8,500', status: 'Paid' },
  { id: 3, date: 'Jul 5, 2025', amount: '₹11,200', status: 'Paid' },
];

const mockEarningDetails = [
  {
    id: 1,
    date: 'Sep 27, 2025',
    student: 'Ethan Carter',
    class: 'Calculus I (1hr)',
    amount: '₹500',
  },
  {
    id: 2,
    date: 'Sep 26, 2025',
    student: 'Olivia Bennett',
    class: 'Chemistry (1hr)',
    amount: '₹450',
  },
  {
    id: 3,
    date: 'Sep 26, 2025',
    student: 'Noah Thompson',
    class: 'Physics II (1hr)',
    amount: '₹500',
  },
];

const StatusPill = ({ status }: { status: string }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      status === 'Paid'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800'
    }`}
  >
    {status}
  </span>
);

const EarningsPage = () => {
  const [activeTab, setActiveTab] = useState('Payout History');
  const tabs = ['Payout History', 'Earning Breakdown'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
          <p className="mt-1 text-gray-500">
            View your earnings, payout history, and manage payments.
          </p>
        </div>
        <Button>Request Payout</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500">{card.title}</h3>
                <Icon className="size-6 text-gray-400" />
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {activeTab === 'Payout History' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600">Date</th>
                <th className="p-4 font-medium text-gray-600">Amount</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPayouts.map((payout) => (
                <tr key={payout.id} className="border-t">
                  <td className="p-4 text-gray-600">{payout.date}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {payout.amount}
                  </td>
                  <td className="p-4">
                    <StatusPill status={payout.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'Earning Breakdown' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600">Date</th>
                <th className="p-4 font-medium text-gray-600">Student</th>
                <th className="p-4 font-medium text-gray-600">Class Details</th>
                <th className="p-4 font-medium text-gray-600">Amount Earned</th>
              </tr>
            </thead>
            <tbody>
              {mockEarningDetails.map((earning) => (
                <tr key={earning.id} className="border-t">
                  <td className="p-4 text-gray-600">{earning.date}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {earning.student}
                  </td>
                  <td className="p-4 text-gray-600">{earning.class}</td>
                  <td className="p-4 font-medium text-green-600">
                    {earning.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
