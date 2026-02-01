import Link from 'next/link';

import ParentDashboardLayout from '@/layouts/ParentDashboardLayout';

export default function AddCardPage() {
  return (
    <ParentDashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Add New Card</h1>
        <p className="text-gray-600">
          Enter your card details to save a payment method.
        </p>
      </div>

      <form className="space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Cardholder Name
          </label>
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Name on card"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Card Number</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="4242 4242 4242 4242"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Expiry</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">CVC</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="CVC"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ZIP</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="ZIP"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Save Card
          </button>
          <Link
            href="/parent/payment-methods"
            className="text-sm font-semibold text-gray-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </ParentDashboardLayout>
  );
}
