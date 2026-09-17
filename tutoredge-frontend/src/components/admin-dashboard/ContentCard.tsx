import Link from 'next/link';
import React from 'react';

interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  author: string;
  createdAt: string;
  students: number;
}

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            content.status === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {content.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="font-medium">{content.type}</span>
        </div>
        <div className="flex justify-between">
          <span>Author:</span>
          <span className="font-medium">{content.author}</span>
        </div>
        <div className="flex justify-between">
          <span>Created:</span>
          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Students:</span>
          <span className="font-medium">{content.students}</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Link
          href={`/admin/content/${content.id}`}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-sm text-white transition-colors hover:bg-blue-700"
        >
          View Details
        </Link>
        <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50">
          Edit
        </button>
      </div>
    </div>
  );
};

export default ContentCard;
