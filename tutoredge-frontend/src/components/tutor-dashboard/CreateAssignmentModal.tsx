// import { Dialog } from '@headlessui/react';
// import { X } from 'lucide-react';
// import React from 'react';

// import Button from '../ui/Button';

// interface CreateAssignmentModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// const mapAssignmentForEdit = (a: any) => ({
//   id: a.id,
//   title: a.title,
//   subject: a.subject,
//   classGrade: a.class_grade,
//   instructions: a.instructions || '',
//   attachments: (a.attachments || []).map((f: any, i: number) => ({
//     id: `${i}`,
//     fileName: f.filename,
//     url: f.url,
//   })),
//   dueDate: a.due_date,
//   allowOnlineSubmissions: a.allow_submission_online,
// });

// const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
//   isOpen,
//   setIsOpen,
// }) => {
//   // State for form inputs would go here

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // API call to create assignment would go here
//     // console.log('Creating assignment...');
//     setIsOpen(false);
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={() => setIsOpen(false)}
//       className="relative z-50"
//     >
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6">
//           <div className="flex items-center justify-between">
//             <Dialog.Title className="text-xl font-bold text-gray-800">
//               Create New Assignment
//             </Dialog.Title>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-400 hover:text-gray-700"
//             >
//               <X />
//             </button>
//           </div>
//           <Dialog.Description className="mt-1 text-sm text-gray-500">
//             Fill out the details below and attach any necessary files.
//           </Dialog.Description>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Assignment Title
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-gray-300"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Instructions
//               </label>
//               <textarea
//                 rows={4}
//                 className="mt-1 w-full rounded-lg border-gray-300"
//               ></textarea>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Attach File (PDF, DOCX)
//               </label>
//               <input
//                 type="file"
//                 className="mt-1 w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 className="mt-1 w-full rounded-lg border-gray-300"
//               />
//             </div>
//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 type="button"
//                 variant="dark"
//                 onClick={() => setIsOpen(false)}
//                 className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">Create Assignment</Button>
//             </div>
//           </form>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

// export default CreateAssignmentModal;


import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import React, { useState } from 'react';

import apiClient from '../../lib/apiClient';
import Button from '../ui/Button';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  /* =========================
     FORM STATE
  ========================= */

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     SUBMIT HANDLER
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !subject || !classGrade || !dueDate) {
    alert('Please fill all required fields');
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('class_grade', classGrade);
    formData.append('instructions', instructions);

    const formattedDueDate = new Date(dueDate)
      .toISOString()
      .slice(0, 10);

    formData.append('due_date', formattedDueDate);
    formData.append('allow_submission_online', 'true');

    if (file) {
      formData.append('file', file);
    }

    await apiClient.post('/tutor/create-assignment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setIsOpen(false);
  } catch (err) {
    console.error('Create assignment failed:', err);
    alert('Failed to create assignment');
  } finally {
    setLoading(false);
  }
};

  /* =========================
     UI
  ========================= */

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Create New Assignment
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>
          </div>

          <Dialog.Description className="mt-1 text-sm text-gray-500">
            Fill out the details below and attach any necessary files.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Assignment Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            {/* Class / Grade */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Class / Grade *
              </label>
              <input
                type="text"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Instructions
              </label>
              <textarea
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            {/* File */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Attach File (PDF, DOCX)
              </label>
              <input
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0] || null)
  }
                className="mt-1 w-full text-sm
                  file:mr-4 file:rounded-full file:border-0
                  file:bg-blue-50 file:px-4 file:py-2
                  file:text-sm file:font-semibold file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="dark"
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateAssignmentModal;
