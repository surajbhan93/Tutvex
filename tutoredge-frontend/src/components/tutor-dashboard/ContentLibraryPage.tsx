// // src/components/tutor-dashboard/ContentLibraryPage.tsx

// import { FileQuestion, FileText, Pencil } from 'lucide-react';
// import React, { useEffect, useState } from 'react';

// import apiClient from '../../lib/apiClient';
// import Button from '../ui/Button';
// import CreateAssignmentModal from './CreateAssignmentModal';
// import CreateQuizModal from './CreateQuizModal';
// import EditAssignmentModal from './EditAssignmentModal';
// import EditQuizModal from './EditQuizModal';

// // --- 1. Updated Types to match API (snake_case) ---
// // Based on image_784779.png and image_6e3473.png
// type Assignment = {
//   id: string;
//   title: string;
//   subject: string;
//   class_grade: string; // API uses snake_case
//   due_date: string; // API uses snake_case
//   allow_submission_online: boolean; // API uses snake_case
//   status: string;
//   // Note: 'instructions' and 'attachments' are not in the list API
//   // You might need a separate GET details API for the Edit Modal later
// };

// type Quiz = {
//   id: string;
//   title: string;
//   subject: string;
//   class_grade: string;
//   due_date: string | null;
//   total_questions: number;
//   status: string;
// };

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

// const mapQuizForEdit = (q: any) => ({
//   id: q.id,
//   title: q.title,
//   subject: q.subject,
//   classGrade: q.class_grade,
//   instructions: q.description || '',
//   questions: (q.questions || []).map((qq: any) => ({
//     id: qq._id,
//     questionText: qq.question,
//     type: 'Multiple Choice',
//     options: qq.options,
//   })),
// });


// // --- Sub-Component for the data tables ---
// const ContentTable = ({
//   data,
//   onEdit,
//   type: _type,
// }: {
//   data: any[];
//   onEdit: (item: any) => void;
//   type: 'assignment' | 'quiz';
// }) => (
//   <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
//     <table className="w-full text-sm">
//       <thead className="bg-gray-50 text-left">
//         <tr>
//           <th className="p-4 font-medium text-gray-600">Title</th>
//           <th className="p-4 font-medium text-gray-600">Subject</th>
//           <th className="p-4 font-medium text-gray-600">Grade</th>
//           <th className="p-4 font-medium text-gray-600">Due Date</th>
//           <th className="p-4 font-medium text-gray-600">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length === 0 ? (
//           <tr>
//             <td colSpan={5} className="p-8 text-center text-gray-500">
//               No content found.
//             </td>
//           </tr>
//         ) : (
//           data.map((item) => (
//             <tr key={item.id} className="border-t">
//               <td className="p-4 font-medium text-gray-800">{item.title}</td>
//               <td className="p-4 text-gray-600">{item.subject}</td>
//               {/* 2. Render using correct snake_case keys */}
//               <td className="p-4 text-gray-600">{item.class_grade}</td>
//               <td className="p-4 text-gray-600">
//                 {item.due_date
//                   ? new Date(item.due_date).toLocaleDateString()
//                   : '-'}
//               </td>
//               <td className="p-4">
//                 <button
//                   onClick={() => onEdit(item)}
//                   className="text-gray-400 hover:text-blue-600"
//                 >
//                   <Pencil size={18} />
//                 </button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   </div>
// );

// // --- Main Page Component ---
// const ContentLibraryPage = () => {
//   const [activeTab, setActiveTab] = useState('Assignments');

//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
 
//   const [title, setTitle] = useState('');
// const [subject, setSubject] = useState('');
// const [classGrade, setClassGrade] = useState('');
// const [instructions, setInstructions] = useState('');
// const [dueDate, setDueDate] = useState('');
// const [file, setFile] = useState<File | null>(null);

//   // Modal States
//   const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
//   const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
//   const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] =
//     useState(false);
//   const [isEditQuizModalOpen, setIsEditQuizModalOpen] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] =
//     useState<Assignment | null>(null);
//   const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

//   const tabs = ['Assignments', 'Quizzes'];

//   // 3. FETCH FUNCTION: Updated for new API structure
//   const fetchContent = async () => {
//     setIsLoading(true);
//     try {
//       const [assignRes, quizRes] = await Promise.all([
//         apiClient.get('/tutor/assignments'),
//         apiClient.get('/tutor/quizzes'),
//       ]);

//       // 4. Access response.data.data based on your screenshots
//       setAssignments(assignRes.data.data || []);
//       setQuizzes(quizRes.data.data || []);
//     } catch (error) {
//       console.error('Failed to fetch content library:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   const handleEditAssignment = (assignment: Assignment) => {
//     setSelectedAssignment(assignment);
//     setIsEditAssignmentModalOpen(true);
//   };

//   const handleEditQuiz = (quiz: Quiz) => {
//     setSelectedQuiz(quiz);
//     setIsEditQuizModalOpen(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-6">
//         <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Content Library
//             </h1>
//             <p className="mt-1 text-gray-500">
//               Create, manage, and send assignments and quizzes.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               onClick={() => setIsAssignmentModalOpen(true)}
//               variant="dark"
//               className="h-10 bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
//             >
//               <FileText className="mr-2 size-4" /> Create Assignment
//             </Button>
//             <Button onClick={() => setIsQuizModalOpen(true)}>
//               <FileQuestion className="mr-2 size-4" /> Create Quiz
//             </Button>
//           </div>
//         </div>

//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-6">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
//                   activeTab === tab
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="mt-4">
//           {isLoading ? (
//             <div className="p-8 text-center">Loading content...</div>
//           ) : (
//             <>
//               {activeTab === 'Assignments' && (
//                 <ContentTable
//                   data={assignments}
//                   onEdit={handleEditAssignment}
//                   type="assignment"
//                 />
//               )}
//               {activeTab === 'Quizzes' && (
//                 <ContentTable
//                   data={quizzes}
//                   onEdit={handleEditQuiz}
//                   type="quiz"
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       <CreateAssignmentModal
//         isOpen={isAssignmentModalOpen}
//         setIsOpen={setIsAssignmentModalOpen}
//       />
//       <CreateQuizModal
//         isOpen={isQuizModalOpen}
//         setIsOpen={setIsQuizModalOpen}
//       />

//       {/* NOTE: Your EditModals might expect 'dueDate' (camelCase). 
//          Since the API returns 'due_date' (snake_case), you might need 
//          to update your EditAssignmentModal to handle the new field names 
//          or map the data here before passing it.
//       */}
//       {/* <EditAssignmentModal
//         isOpen={isEditAssignmentModalOpen}
//         setIsOpen={setIsEditAssignmentModalOpen}
//         // @ts-ignore - Suppressing TS error until Modal is updated to match API types
//         assignment={selectedAssignment}
//         onAssignmentUpdated={fetchContent}
//         onAssignmentDeleted={fetchContent}
//       />
//       <EditQuizModal
//         isOpen={isEditQuizModalOpen}
//         setIsOpen={setIsEditQuizModalOpen}
//         // @ts-ignore
//         quiz={selectedQuiz}
//       /> */}
//       <EditAssignmentModal
//   isOpen={isEditAssignmentModalOpen}
//   setIsOpen={setIsEditAssignmentModalOpen}
//   assignment={
//     selectedAssignment
//       ? mapAssignmentForEdit(selectedAssignment)
//       : null
//   }
// />

// <EditQuizModal
//   isOpen={isEditQuizModalOpen}
//   setIsOpen={setIsEditQuizModalOpen}
//   quiz={selectedQuiz ? mapQuizForEdit(selectedQuiz) : null}
// />

//     </>
//   );
// };

// export default ContentLibraryPage;

import { FileQuestion, FileText, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import apiClient from '../../lib/apiClient';
import Button from '../ui/Button';
import CreateAssignmentModal from './CreateAssignmentModal';
import CreateQuizModal from './CreateQuizModal';
import EditAssignmentModal from './EditAssignmentModal';
import EditQuizModal from './EditQuizModal';

/* =========================
   TYPES (API RESPONSE)
========================= */

type Assignment = {
  id: string;
  title: string;
  subject: string;
  class_grade: string;
  due_date: string;
  allow_submission_online: boolean;
  status: string;
};

type Quiz = {
  id: string;
  title: string;
  subject: string;
  class_grade: string;
  due_date: string | null;
  total_questions: number;
  status: string;
};

/* =========================
   MAPPERS (API → MODAL)
========================= */

const mapAssignmentForEdit = (a: Assignment) => ({
  id: a.id,
  title: a.title,
  subject: a.subject,
  classGrade: a.class_grade,
  instructions: '',
  attachments: [],
  dueDate: a.due_date,
  allowOnlineSubmissions: a.allow_submission_online,
});

const mapQuizForEdit = (q: Quiz) => ({
  id: q.id,
  title: q.title,
  subject: q.subject,
  classGrade: q.class_grade,
  instructions: '',
  questions: [],
});

/* =========================
   TABLE COMPONENT
========================= */

const ContentTable = ({
  data,
  onEdit,
}: {
  data: any[];
  onEdit: (item: any) => void;
}) => (
  <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
    
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-left">
        <tr>
          <th className="p-4 font-medium text-gray-600">Title</th>
          <th className="p-4 font-medium text-gray-600">Subject</th>
          <th className="p-4 font-medium text-gray-600">Grade</th>
          <th className="p-4 font-medium text-gray-600">Due Date</th>
          <th className="p-4 font-medium text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-8 text-center text-gray-500">
              No content found.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4 font-medium text-gray-800">{item.title}</td>
              <td className="p-4 text-gray-600">{item.subject}</td>
              <td className="p-4 text-gray-600">{item.class_grade}</td>
              <td className="p-4 text-gray-600">
                {item.due_date
                  ? new Date(item.due_date).toLocaleDateString()
                  : '-'}
              </td>
              <td className="p-4">
                <button
                  onClick={() => onEdit(item)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* =========================
   MAIN PAGE
========================= */

const ContentLibraryPage = () => {
  const [activeTab, setActiveTab] = useState<'Assignments' | 'Quizzes'>(
    'Assignments'
  );

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] =
    useState(false);
  const [isEditQuizModalOpen, setIsEditQuizModalOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  /* =========================
     FETCH DATA
  ========================= */

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const [assignRes, quizRes] = await Promise.all([
        apiClient.get('/tutor/assignments'),
        apiClient.get('/tutor/quizzes'),
      ]);

      setAssignments(assignRes.data?.data ?? []);
      setQuizzes(quizRes.data?.data ?? []);
    } catch (error) {
      console.error('Failed to fetch content library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  /* =========================
     HANDLERS
  ========================= */

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditAssignmentModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsEditQuizModalOpen(true);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* ================= CONTENT LIBRARY HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow">
  <h1 className="text-xl font-bold">
    Content Library
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Manage, organize, and share your teaching materials with
    students easily.
  </p>
</div>

{/* ================= INFO / GUIDELINES ================= */}
<div className="mb-6 rounded-xl bg-white p-4 shadow-sm text-sm text-gray-700">
  <p className="mb-1 font-semibold text-gray-800">
    Library Guidelines
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>
      Upload study materials such as notes, PDFs, videos, and
      practice worksheets.
    </li>
    <li>
      Organize content by subject, class, or topic for quick
      access.
    </li>
    <li>
      Shared materials are visible only to your assigned
      students.
    </li>
    <li>
      Please upload original or licensed content to maintain
      quality and copyright compliance.
    </li>
  </ul>
</div>

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Content Library
            </h1>
            <p className="mt-1 text-gray-500">
              Create, manage, and send assignments and quizzes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAssignmentModalOpen(true)}
              variant="dark"
              className="h-10 bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
            >
              <FileText className="mr-2 size-4" /> Create Assignment
            </Button>
            <Button onClick={() => setIsQuizModalOpen(true)}>
              <FileQuestion className="mr-2 size-4" /> Create Quiz
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            {['Assignments', 'Quizzes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`border-b-2 px-1 py-4 text-sm font-medium ${
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

        <div className="mt-4">
          {isLoading ? (
            <div className="p-8 text-center">Loading content...</div>
          ) : activeTab === 'Assignments' ? (
            <ContentTable
              data={assignments}
              onEdit={handleEditAssignment}
            />
          ) : (
            <ContentTable data={quizzes} onEdit={handleEditQuiz} />
          )}
        </div>
      </div>

      {/* CREATE MODALS */}
      <CreateAssignmentModal
        isOpen={isAssignmentModalOpen}
        setIsOpen={setIsAssignmentModalOpen}
      />
      <CreateQuizModal
        isOpen={isQuizModalOpen}
        setIsOpen={setIsQuizModalOpen}
      />

      {/* EDIT MODALS */}
      <EditAssignmentModal
        isOpen={isEditAssignmentModalOpen}
        setIsOpen={setIsEditAssignmentModalOpen}
        assignment={
          selectedAssignment
            ? mapAssignmentForEdit(selectedAssignment)
            : null
        }
      />

      <EditQuizModal
        isOpen={isEditQuizModalOpen}
        setIsOpen={setIsEditQuizModalOpen}
        quiz={selectedQuiz ? mapQuizForEdit(selectedQuiz) : null}
      />
    </>
  );
};

export default ContentLibraryPage;
