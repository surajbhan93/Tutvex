// import { Dialog } from '@headlessui/react';
// import { Plus, Trash2, X } from 'lucide-react';
// import React, { useState } from 'react';

// import Button from '../ui/Button';

// interface CreateQuizModalProps {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// }

// // Type for a single question
// type Question = {
//   id: number;
//   questionText: string;
//   options: string[];
//   correctAnswerIndex: number;
// };

// const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
//   isOpen,
//   setIsOpen,
// }) => {
//   const [questions, setQuestions] = useState<Question[]>([]);

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         id: Date.now(),
//         questionText: '',
//         options: ['', '', '', ''],
//         correctAnswerIndex: 0,
//       },
//     ]);
//   };

//   const removeQuestion = (id: number) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={() => setIsOpen(false)}
//       className="relative z-50"
//     >
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6">
//           <div className="flex items-center justify-between">
//             <Dialog.Title className="text-xl font-bold text-gray-800">
//               Create New Quiz
//             </Dialog.Title>
//             <button onClick={() => setIsOpen(false)}>
//               <X className="text-gray-400 hover:text-gray-700" />
//             </button>
//           </div>

//           <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
//             {/* Quiz Details Form */}
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Quiz Title
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 w-full rounded-lg border-gray-300"
//               />
//             </div>

//             <hr className="my-4" />

//             {/* Dynamic Question Builder */}
//             <h3 className="font-semibold text-gray-800">Questions</h3>
//             {questions.map((q, qIndex) => (
//               <div key={q.id} className="rounded-lg border bg-gray-50 p-4">
//                 <div className="flex items-center justify-between">
//                   <p className="font-medium">Question {qIndex + 1}</p>
//                   <button onClick={() => removeQuestion(q.id)}>
//                     <Trash2 className="size-4 text-gray-400 hover:text-red-600" />
//                   </button>
//                 </div>
//                 <textarea
//                   placeholder="Enter your question here..."
//                   rows={2}
//                   className="mt-2 w-full rounded-lg border-gray-300"
//                 ></textarea>
//                 <div className="mt-2 grid grid-cols-2 gap-2">
//                   {q.options.map(
//                     (
//                       _opt,
//                       oIndex, // <-- FIX IS HERE
//                     ) => (
//                       <div key={oIndex} className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name={`q${q.id}-correct`}
//                           value={oIndex}
//                         />
//                         <input
//                           type="text"
//                           placeholder={`Option ${oIndex + 1}`}
//                           className="w-full rounded-md border-gray-300 text-sm"
//                         />
//                       </div>
//                     ),
//                   )}
//                 </div>
//               </div>
//             ))}
//             <Button
//               type="button"
//               onClick={addQuestion}
//               variant="dark"
//               className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//             >
//               <Plus className="mr-2 size-4" /> Add Question
//             </Button>
//           </div>

//           <div className="mt-6 flex justify-end gap-2 border-t pt-4">
//             <Button
//               type="button"
//               variant="dark"
//               onClick={() => setIsOpen(false)}
//               className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//             >
//               Cancel
//             </Button>
//             <Button type="submit">Create Quiz</Button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

// export default CreateQuizModal;


import { Dialog } from '@headlessui/react';
import { Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

import apiClient from '../../lib/apiClient';
import Button from '../ui/Button';

interface CreateQuizModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

/* =========================
   TYPES
========================= */

type Question = {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
};

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  /* =========================
     FORM STATE
  ========================= */

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     QUESTION HANDLERS
  ========================= */

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestionText = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, questionText: value } : q,
      ),
    );
  };

  const updateOption = (
    qId: number,
    optIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optIndex ? value : opt,
              ),
            }
          : q,
      ),
    );
  };

  const updateCorrectAnswer = (qId: number, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, correctAnswerIndex: index }
          : q,
      ),
    );
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    if (!title || !subject || !classGrade || questions.length === 0) {
      alert('Please fill all required fields and add at least one question');
      return;
    }

    try {
      setLoading(true);

      await apiClient.post('/tutor/create-quiz', {
  title,
  subject,
  class_grade: classGrade,
  description,
  questions: questions.map((q) => ({
    question: q.questionText,
    options: q.options,
    correct_answer: q.options[q.correctAnswerIndex],
  })),
});


      // reset
      setTitle('');
      setSubject('');
      setClassGrade('');
      setDescription('');
      setQuestions([]);
      setIsOpen(false);
    } catch (err) {
      console.error('Create quiz failed:', err);
      alert('Failed to create quiz');
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
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              Create New Quiz
            </Dialog.Title>
            <button onClick={() => setIsOpen(false)}>
              <X className="text-gray-400 hover:text-gray-700" />
            </button>
          </div>

          <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
            {/* Quiz Info */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

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

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description / Instructions
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-300"
              />
            </div>

            <hr />

            {/* Questions */}
            <h3 className="font-semibold text-gray-800">Questions</h3>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    Question {qIndex + 1}
                  </p>
                  <button onClick={() => removeQuestion(q.id)}>
                    <Trash2 className="size-4 text-gray-400 hover:text-red-600" />
                  </button>
                </div>

                <textarea
                  placeholder="Enter question"
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestionText(q.id, e.target.value)
                  }
                  rows={2}
                  className="mt-2 w-full rounded-lg border-gray-300"
                />

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() =>
                          updateCorrectAnswer(q.id, oIndex)
                        }
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          updateOption(
                            q.id,
                            oIndex,
                            e.target.value,
                          )
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="w-full rounded-md border-gray-300 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addQuestion}
              variant="dark"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <Plus className="mr-2 size-4" /> Add Question
            </Button>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="dark"
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateQuizModal;
