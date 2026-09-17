import { Dialog } from '@headlessui/react';
import { File, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Button from '../ui/Button';

// --- Types ---
// I've created these types based on your UI.
// You might want to move these to a central `types.ts` file.
type Attachment = {
  id: string;
  fileName: string;
  url: string; // Or a unique identifier
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  classGrade: string;
  instructions: string;
  attachments: Attachment[];
  dueDate: string; // Use 'YYYY-MM-DD' format for date input
  allowOnlineSubmissions: boolean;
};

// --- Component Props ---
interface EditAssignmentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // Pass the assignment to be edited
  assignment: Assignment | null;
}

const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  setIsOpen,
  assignment,
}) => {
  // Local state to manage form inputs
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [allowOnline, setAllowOnline] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // When the 'assignment' prop changes, update the local state
  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setSubject(assignment.subject);
      setClassGrade(assignment.classGrade);
      setInstructions(assignment.instructions);
      setDueDate(assignment.dueDate);
      setAllowOnline(assignment.allowOnlineSubmissions);
      setAttachments(assignment.attachments);
    }
  }, [assignment]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to UPDATE the assignment would go here
    console.log('Saving changes...', { title, subject, attachments });
    setIsOpen(false);
  };

  const handleDeleteAssignment = () => {
    // API call to DELETE assignment
    console.warn('Deleting assignment...');
    setIsOpen(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  if (!assignment) return null; // Don't render if no assignment is selected

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-8">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Edit Assignment
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>
          </div>

          {/* Form matches the UI screenshot */}
          <form onSubmit={handleSaveChanges} className="mt-6 space-y-5">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Class/Grade
                </label>
                <input
                  type="text"
                  value={classGrade}
                  onChange={(e) => setClassGrade(e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
                ></textarea>
              </div>
            </div>

            {/* Attached Files Section */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Attached Files
              </label>
              <div className="mt-2 space-y-3">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File className="size-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">
                        {file.fileName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="dark"
                        className="h-8 bg-white px-3 text-xs shadow-sm"
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        variant="dark"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className="h-8 bg-white px-3 text-xs text-red-600 shadow-sm hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {/* You would add a file input here to add *new* files */}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="allowSubmissions"
                type="checkbox"
                checked={allowOnline}
                onChange={(e) => setAllowOnline(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600"
              />
              <label
                htmlFor="allowSubmissions"
                className="text-sm font-medium text-gray-700"
              >
                Allow Submissions Online
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="dark"
                onClick={handleDeleteAssignment}
                className="text-red-600 hover:bg-red-50"
              >
                Delete Assignment
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="dark"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditAssignmentModal;
