import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Head from 'next/head';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import {
  FaFlask, FaPalette, FaCalculator, FaGlobe, FaLanguage,
  FaArrowLeft, FaStar, FaCheckCircle, FaRobot, FaBrain,
  FaLightbulb, FaSpinner, FaChevronRight, FaBookOpen,
} from 'react-icons/fa';

/* ══════════════════════════════════════════════════════
   SEO Structured Data
══════════════════════════════════════════════════════ */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Primary Section – Class 1 to 5 Online Tutoring",
  "description": "Interactive online tuition for Class 1 to 5 covering English, Hindi, Mathematics, Science, Social Studies, and Art & Craft. Expert tutors, AI-powered tools, and personalised lessons for young minds.",
  "provider": { "@type": "Organization", "name": "TutorKids", "sameAs": "https://tutvex.com" },
  "educationalLevel": "Primary School – Grade 1 to 5",
  "audience": { "@type": "EducationalAudience", "educationalRole": "student", "audienceType": "Children aged 6–11" },
  "hasCourseInstance": ["English","Hindi","Mathematics","Science","Social Studies","Art & Craft"].map(name => ({
    "@type": "CourseInstance", "name": name, "courseMode": "online"
  }))
};

/* ══════════════════════════════════════════════════════
   Static Data
══════════════════════════════════════════════════════ */
const subjects = [
  { name:'English',      desc:'Reading comprehension, creative writing, grammar, vocabulary & storytelling skills.', icon:<FaLanguage/>,   color:'#FF6B9D', bg:'#FFF0F6', tag:'Language Arts',    highlights:['Phonics & Reading','Creative Writing','Grammar & Vocab'] },
  { name:'Hindi',        desc:'Vyakaran, shabda bhandar, creative writing, and comprehension exercises.',            icon:<FaLanguage/>,   color:'#FF8C42', bg:'#FFF5EE', tag:'भाषा',             highlights:['व्याकरण','वर्तनी & शब्द','रचनात्मक लेखन'] },
  { name:'Mathematics',  desc:'Numbers, operations, shapes, measurements, data handling & logical reasoning.',       icon:<FaCalculator/>, color:'#6C63FF', bg:'#F3F2FF', tag:'STEM',             highlights:['Arithmetic','Geometry & Shapes','Problem Solving'] },
  { name:'Science',      desc:'Curiosity-led experiments, natural phenomena, living things, and hands-on learning.', icon:<FaFlask/>,      color:'#2ECC71', bg:'#EDFBF3', tag:'Explore & Discover',highlights:['Living World','Matter & Energy','Fun Experiments'] },
  { name:'Social Studies',desc:'Community, geography, history, civic values, and cultural awareness activities.',    icon:<FaGlobe/>,      color:'#1A9ED4', bg:'#EEF8FD', tag:'Our World',         highlights:['Maps & Geography','History & Heritage','Civic Values'] },
  { name:'Art & Craft',  desc:'Drawing, painting, clay modelling, DIY projects & creative self-expression.',        icon:<FaPalette/>,    color:'#F5A623', bg:'#FFFBEF', tag:'Creativity',        highlights:['Sketching & Painting','Craft Projects','Design Thinking'] },
];

const stats = [
  { value:'1100+', label:'Happy Students' },
  { value:'900+',  label:'Expert Tutors' },
  { value:'6',    label:'Core Subjects' },
  { value:'4.9★', label:'Avg Rating' },
];

const benefits = ['Live 1-on-1 Sessions','CBSE & ICSE Aligned','Progress Reports','Doubt Clearing','Flexible Scheduling','AI-Powered Tools'];

const testimonials = [
  { name:'Priya Sharma',  role:'Parent of Class 3 student', text:"My daughter used to dread Maths. Now she looks forward to sessions! The AI quiz tool is brilliant and the tutors are so patient.", rating:5, avatar:'👩' },
  { name:'Rahul Mehta',   role:'Parent of Class 2 student', text:"The AI Explainer is a game changer. My son asks it questions at night and comes to class prepared. Fantastic platform!", rating:5, avatar:'👨' },
  { name:'Anjali Patel',  role:'Parent of Class 5 student', text:"Excellent teaching quality. Very happy with Science and English progress. The AI study planner keeps us organised.", rating:5, avatar:'👩' },
];
type ClaudeMessage = {
  role: 'user' | 'assistant'
  content: string
}
/* ══════════════════════════════════════════════════════
   Shared API helper
══════════════════════════════════════════════════════ */
async function callClaude(
  messages: ClaudeMessage[],
  systemPrompt: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages
    }),
  })

  const data = await res.json()
  return data.content?.map((b: any) => b.text || '').join('') || ''
}


/* ══════════════════════════════════════════════════════
   Tool 1 – AI Concept Explainer
══════════════════════════════════════════════════════ */
function AIExplainer() {
  const [subject, setSubject]   = useState('Mathematics');
  const [cls, setCls]           = useState('3');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer]     = useState('');
  const [loading, setLoading]   = useState(false);

  const quickQuestions = ['What is photosynthesis?','How do fractions work?','What is the water cycle?','Why is the sky blue?'];

type PrimaryBtnProps = {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  color: string
  full?: boolean
  children: React.ReactNode
}

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true); setAnswer('');
    try {
      const r = await callClaude(
        [{ role:'user', content:`Subject: ${subject}\nClass: ${cls}\nQuestion: ${question}` }],
        `You are a warm, encouraging primary school tutor for Class 1–5 students in India (CBSE/ICSE). 
Explain things simply using fun examples, relatable Indian references (cricket, festivals, food), and emojis.
Keep answers under 150 words. End with one short practice tip or question to check understanding.`
      );
      setAnswer(r);
    } catch { setAnswer('Oops! Something went wrong. Please try again.'); }
    setLoading(false);
  };

  const sel = { padding:'10px 14px', borderRadius:12, border:'1.5px solid #EDE9FF', fontSize:14, fontWeight:700, color:'#6C63FF', outline:'none', fontFamily:"'Nunito',sans-serif", cursor:'pointer', background:'#F8F7FF' };

  return (
    <div style={{ background:'#fff', borderRadius:24, padding:32, boxShadow:'0 8px 40px rgba(108,99,255,0.10)', border:'1.5px solid #EDE9FF' }}>
      <ToolHeader icon={<FaBrain/>} iconBg='linear-gradient(135deg,#6C63FF,#9B59B6)' title='AI Concept Explainer' sub='Ask any doubt — get a simple, clear explanation instantly'/>

      <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ ...sel, flex:1, minWidth:140 }}>
          {subjects.map(s=><option key={s.name}>{s.name}</option>)}
        </select>
        <select value={cls} onChange={e=>setCls(e.target.value)} style={{ ...sel, width:110 }}>
          {[1,2,3,4,5].map(c=><option key={c} value={c}>Class {c}</option>)}
        </select>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()}
          placeholder="e.g. What is photosynthesis? How do fractions work?"
          style={{ flex:1, padding:'12px 16px', borderRadius:12, border:'1.5px solid #EDE9FF', fontSize:14, outline:'none', fontFamily:"'Nunito',sans-serif" }}
          onFocus={e=>e.target.style.border='1.5px solid #6C63FF'} onBlur={e=>e.target.style.border='1.5px solid #EDE9FF'}/>
        <PrimaryBtn onClick={ask} loading={loading} disabled={!question.trim()} color='linear-gradient(135deg,#6C63FF,#9B59B6)'>
          Ask AI <FaChevronRight size={11}/>
        </PrimaryBtn>
      </div>

      {answer && (
        <div style={{ marginTop:20, padding:'20px 22px', background:'linear-gradient(135deg,#F8F7FF,#FFF0F9)', borderRadius:16, border:'1.5px solid #EDE9FF', fontSize:14, lineHeight:1.8, color:'#333', whiteSpace:'pre-wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <FaRobot color="#6C63FF" size={14}/>
            <span style={{ fontWeight:800, fontSize:13, color:'#6C63FF' }}>AI Tutor</span>
          </div>
          {answer}
        </div>
      )}

      <div style={{ marginTop:16, display:'flex', flexWrap:'wrap', gap:8 }}>
        {quickQuestions.map(q=>(
          <button key={q} onClick={()=>setQuestion(q)}
            style={{ padding:'6px 14px', borderRadius:50, border:'1.5px solid #EDE9FF', background:'#F8F7FF', fontSize:12, fontWeight:600, color:'#6C63FF', cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

type QuizItem = {
  q: string
  options: string[]
  answer: string
  explanation?: string
}


/* ══════════════════════════════════════════════════════
   Tool 2 – AI Practice Quiz
══════════════════════════════════════════════════════ */
function AIQuiz() {
  const [subject, setSubject]   = useState('Mathematics');
  const [cls, setCls]           = useState('3');
const [quiz, setQuiz] = useState<QuizItem[] | null>(null);
const [selected, setSelected] = useState<Record<number, string | undefined>>({});
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);



  const generate = async () => {
    setLoading(true); setQuiz(null); setSelected({}); setSubmitted(false);
    try {
      const raw = await callClaude(
        [{ role:'user', content:`4-question MCQ quiz for Class ${cls} ${subject} (Indian CBSE). Return ONLY a raw JSON array:\n[{"q":"...","options":["A","B","C","D"],"answer":"A","explanation":"..."}]` }],
        'Return ONLY a raw JSON array of 4 MCQ objects. No markdown, no explanation, just the JSON.'
      );
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setQuiz(parsed);
    } catch { setQuiz([{ q:'Failed to generate quiz. Please try again.', options:[], answer:'', explanation:'' }]); }
    setLoading(false);
  };

 const score =
  quiz && submitted
    ? quiz.filter((q: QuizItem, i: number) => selected[i] === q.answer).length
    : 0;

  const sel = { padding:'10px 14px', borderRadius:12, border:'1.5px solid #D6F8E6', fontSize:14, fontWeight:700, color:'#27AE60', outline:'none', fontFamily:"'Nunito',sans-serif", background:'#F2FDF6' };
 
  
  return (
    <div style={{ background:'#fff', borderRadius:24, padding:32, boxShadow:'0 8px 40px rgba(46,204,113,0.08)', border:'1.5px solid #D6F8E6' }}>
      <ToolHeader icon={<FaBookOpen/>} iconBg='linear-gradient(135deg,#2ECC71,#27AE60)' title='AI Practice Quiz' sub='AI-generated MCQs tailored to your class & subject'/>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{ ...sel, flex:1, minWidth:140 }}>
          {subjects.map(s=><option key={s.name}>{s.name}</option>)}
        </select>
        <select value={cls} onChange={e=>setCls(e.target.value)} style={{ ...sel, width:110 }}>
          {[1,2,3,4,5].map(c=><option key={c} value={c}>Class {c}</option>)}
        </select>
        <PrimaryBtn onClick={generate} loading={loading} color='linear-gradient(135deg,#2ECC71,#27AE60)'>
          ✨ Generate Quiz
        </PrimaryBtn>
      </div>

      {quiz && !submitted && (
  <div>
    {quiz.map((q: QuizItem, qi: number) => (
      <div
        key={qi}
        style={{
          marginBottom: 20,
          padding: 20,
          borderRadius: 16,
          background: '#F9FFF9',
          border: '1.5px solid #D6F8E6'
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1035', marginBottom: 14 }}>
          {qi + 1}. {q.q}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {q.options.map((opt: string, oi: number) => {
            const letter = ['A', 'B', 'C', 'D'][oi];
            const active = selected[qi] === letter;

            return (
              <button
                key={oi}
                onClick={() =>
                  setSelected(prev => ({ ...prev, [qi]: letter }))
                }
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Nunito',sans-serif",
                  border: active
                    ? '2px solid #6C63FF'
                    : '1.5px solid #D6F8E6',
                  background: active ? '#F3F2FF' : '#fff',
                  color: active ? '#6C63FF' : '#444',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ fontWeight: 800, marginRight: 6 }}>
                  {letter}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    ))}

    <button
      onClick={() => setSubmitted(true)}
      disabled={Object.keys(selected).length < (quiz?.length ?? 0)}
      style={{
        width: '100%',
        padding: 14,
        borderRadius: 14,
        background:
          Object.keys(selected).length < (quiz?.length ?? 0)
            ? '#ccc'
            : 'linear-gradient(135deg,#2ECC71,#27AE60)',
        color: '#fff',
        border: 'none',
        fontWeight: 800,
        fontSize: 16,
        cursor:
          Object.keys(selected).length < (quiz?.length ?? 0)
            ? 'not-allowed'
            : 'pointer',
        fontFamily: "'Nunito',sans-serif"
      }}
    >
      Submit Quiz ({Object.keys(selected).length}/
      {quiz?.length ?? 0} answered)
    </button>
  </div>
)}

      {quiz && submitted && (
        <div>
          {quiz.map((q,qi)=>(
            <div key={qi} style={{ marginBottom:20, padding:20, borderRadius:16, background:'#F9FFF9', border:'1.5px solid #D6F8E6' }}>
              <p style={{ fontWeight:700, fontSize:15, color:'#1A1035', marginBottom:14 }}>{qi+1}. {q.q}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {q.options.map((opt,oi)=>{
                  const letter=['A','B','C','D'][oi];
                  const isCorrect=letter===q.answer;
                  const isWrong=selected[qi]===letter&&!isCorrect;
                  return (
                    <div key={oi} style={{ padding:'10px 14px', borderRadius:12, fontSize:13, fontWeight:600, border:isCorrect?'2px solid #2ECC71':isWrong?'2px solid #FF6B6B':'1.5px solid #D6F8E6', background:isCorrect?'#EDFBF3':isWrong?'#FFF0F0':'#fff', color:isCorrect?'#27AE60':isWrong?'#E74C3C':'#444' }}>
                      <span style={{ fontWeight:800, marginRight:6 }}>{letter}.</span>{opt} {isCorrect&&'✓'}{isWrong&&'✗'}
                    </div>
                  );
                })}
              </div>
              {q.explanation && <div style={{ marginTop:10, padding:'10px 14px', background:'#FFF9E6', borderRadius:10, fontSize:13, color:'#7D5A00', border:'1px solid #FFE8A1' }}>💡 {q.explanation}</div>}
            </div>
          ))}
          <div style={{ textAlign:'center', padding:24, background:'linear-gradient(135deg,#F2FDF6,#FFF0F9)', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>{score===quiz.length?'🏆':score>=quiz.length/2?'🌟':'💪'}</div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#1A1035' }}>{score}/{quiz.length} Correct!</div>
            <div style={{ fontSize:15, color:'#666', marginBottom:16 }}>{score===quiz.length?'Perfect score! Amazing!':score>=quiz.length/2?'Great job! Keep practising!':'Keep trying, you\'ll get there!'}</div>
            <button onClick={generate} style={{ padding:'10px 28px', borderRadius:50, background:'linear-gradient(135deg,#2ECC71,#27AE60)', color:'#fff', border:'none', fontWeight:800, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>Try Another Quiz →</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Tool 3 – AI Study Planner
══════════════════════════════════════════════════════ */
function AIStudyPlanner() {
  const [cls, setCls]                   = useState('3');
 const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [hours, setHours]               = useState('1');
  const [plan, setPlan]                 = useState('');
  const [loading, setLoading]           = useState(false);

  const toggle = (s: string) =>
  setWeakSubjects(p =>
    p.includes(s) ? p.filter(x => x !== s) : [...p, s]
  );

  const generate = async () => {
    if (!weakSubjects.length) return;
    setLoading(true); setPlan('');
    try {
      const r = await callClaude(
        [{ role:'user', content:`Class: ${cls}\nFocus subjects: ${weakSubjects.join(', ')}\nStudy time per day: ${hours} hr(s)\n\nCreate a 7-day personalised study plan.` }],
        `You are a friendly academic planner for Indian primary school students (CBSE/ICSE).
Create a practical 7-day plan. Use day names (Monday–Sunday) as headers. Include specific topics, short breaks, and fun activities.
Be encouraging and achievable. Use emojis. Max 300 words.`
      );
      setPlan(r);
    } catch { setPlan('Could not generate plan. Please try again.'); }
    setLoading(false);
  };

  const sel = { padding:'10px 14px', borderRadius:12, border:'1.5px solid #FFE8A1', fontSize:14, fontWeight:700, color:'#E67E22', outline:'none', fontFamily:"'Nunito',sans-serif", background:'#FFFBEF', width:'100%' };

  return (
    <div style={{ background:'#fff', borderRadius:24, padding:32, boxShadow:'0 8px 40px rgba(245,166,35,0.08)', border:'1.5px solid #FFE8A1' }}>
      <ToolHeader icon={<FaLightbulb/>} iconBg='linear-gradient(135deg,#F5A623,#E67E22)' title='AI Study Planner' sub='Get a personalised 7-day study plan for your child'/>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 140px' }}>
          <label style={{ fontSize:13, fontWeight:700, color:'#666', display:'block', marginBottom:6 }}>Class Level</label>
          <select value={cls} onChange={e=>setCls(e.target.value)} style={sel}>
            {[1,2,3,4,5].map(c=><option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div style={{ flex:'1 1 140px' }}>
          <label style={{ fontSize:13, fontWeight:700, color:'#666', display:'block', marginBottom:6 }}>Study Hours / Day</label>
          <select value={hours} onChange={e=>setHours(e.target.value)} style={sel}>
            {['0.5','1','1.5','2','3'].map(h=><option key={h} value={h}>{h} hr{h==='1'?'':'s'}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <label style={{ fontSize:13, fontWeight:700, color:'#666', display:'block', marginBottom:10 }}>Select subjects to focus on:</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {subjects.map(s=>{
            const on=weakSubjects.includes(s.name);
            return (
              <button key={s.name} onClick={()=>toggle(s.name)}
                style={{ padding:'8px 18px', borderRadius:50, border:`2px solid ${on?s.color:'#EEE'}`, background:on?s.bg:'#fafafa', color:on?s.color:'#888', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'all 0.15s' }}>
                {on&&'✓ '}{s.name}
              </button>
            );
          })}
        </div>
      </div>

      <PrimaryBtn onClick={generate} loading={loading} disabled={!weakSubjects.length} color='linear-gradient(135deg,#F5A623,#E67E22)' full>
        📅 Generate My Study Plan
      </PrimaryBtn>

      {plan && (
        <div style={{ marginTop:20, padding:'22px 24px', background:'linear-gradient(135deg,#FFFBEF,#FFF5EE)', borderRadius:16, border:'1.5px solid #FFE8A1', fontSize:14, lineHeight:1.9, color:'#333', whiteSpace:'pre-wrap' }}>
          {plan}
        </div>
      )}
    </div>
  );
}

type ToolHeaderProps = {
  icon: React.ReactNode
  iconBg: string
  title: string
  sub: string
}
/* ══════════════════════════════════════════════════════
   Shared small components
══════════════════════════════════════════════════════ */
function ToolHeader({ icon, iconBg, title, sub }: ToolHeaderProps) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, flexShrink:0 }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:20, fontWeight:800, color:'#1A1035', margin:0 }}>{title}</h3>
        <p style={{ fontSize:13, color:'#888', margin:0 }}>{sub}</p>
      </div>
    </div>
  );
}

type PrimaryBtnProps = {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  color: string
  full?: boolean
  children: React.ReactNode
}

function PrimaryBtn({
  onClick,
  loading = false,
  disabled = false,
  color,
  full = false,
  children
}: PrimaryBtnProps) {
  return (
    <button onClick={onClick} disabled={loading || disabled}
      style={{ width:full?'100%':undefined, padding:'11px 22px', borderRadius:12, background:loading||disabled?'#ccc':color, color:'#fff', border:'none', fontWeight:800, fontSize:14, cursor:loading||disabled?'not-allowed':'pointer', fontFamily:"'Nunito',sans-serif", display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, transition:'transform 0.2s' }}
      onMouseEnter={e=>{ if(!loading&&!disabled) e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e=>e.currentTarget.style.transform='none'}>
      {loading ? <><FaSpinner style={{ animation:'spin 1s linear infinite' }}/> Please wait...</> : children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const PrimarySection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('explainer');

  const aiTools = [
    { id:'explainer', label:'🧠 AI Explainer',  component:<AIExplainer/> },
    { id:'quiz',      label:'📝 Practice Quiz',  component:<AIQuiz/> },
    { id:'planner',   label:'📅 Study Planner',  component:<AIStudyPlanner/> },
  ];

  return (
    <>
      <Head>
        <title>Primary Section Tuition | Class 1–5 Online Tutoring with AI Tools | English, Maths, Science</title>
        <meta name="description" content="Top-rated online tuition for Class 1 to 5 with AI learning tools. Covers English, Hindi, Maths, Science, Social Studies & Art. Fun interactive lessons by certified tutors. Book a free demo today!" />
        <meta name="keywords" content="primary section tuition, class 1 to 5 tutor, online tuition for kids, grade 1 2 3 4 5 tutoring, english maths science tutor, primary school home tutor, AI learning tools for kids, CBSE ICSE primary tuition" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tutvex.com/courses/primary-section" />
        <meta property="og:title" content="Primary Section Tuition – Class 1 to 5 | AI-Powered Online Learning" />
        <meta property="og:description" content="Fun & effective online tuition for Class 1–5 with AI tools. English, Hindi, Maths, Science, SST & Art. Expert tutors, flexible timings. Enrol today!" />
        <meta property="og:image" content="https://tutvex.com/images/kids-courses/primary-og.png" />
        <meta property="og:url" content="https://tutvex.com/courses/primary-section" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Primary Section Tuition | Class 1–5 Online Tutoring with AI" />
        <meta name="twitter:description" content="Interactive online tuition for Class 1–5 with AI-powered tools. Expert tutors, live sessions, CBSE/ICSE aligned. Book a free demo!" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes spin    { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
          @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .hero-in   { animation: fadeUp 0.6s ease forwards; }
          .hero-img  { animation: fadeUp 0.7s ease 0.15s both; }
          .float-el  { animation: floatY 3s ease-in-out infinite; }
          * { box-sizing:border-box; }
          @media(max-width:640px){
            .stats-item { flex:1 1 45% !important; border-right:none !important; border-bottom:1px solid #F0EEF8; }
            .hero-btns  { flex-direction:column !important; }
            .hero-btns button { width:100% !important; justify-content:center !important; }
          }
        `}</style>
      </Head>

      <div style={{ fontFamily:"'Nunito',sans-serif", background:'#FFFBFE', minHeight:'100vh' }}>
        <NavBar/>

        {/* ════ HERO ════ */}
        <section aria-label="Primary Section Introduction" style={{ background:'linear-gradient(135deg,#FFF0F9 0%,#FFF5EE 40%,#F0F4FF 100%)', padding:'60px 24px 80px', position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:-80, right:-80, width:360, height:360, borderRadius:'50%', background:'rgba(255,107,157,0.09)', zIndex:0 }} aria-hidden/>
          <span style={{ position:'absolute', bottom:-100, left:-100, width:320, height:320, borderRadius:'50%', background:'rgba(108,99,255,0.08)', zIndex:0 }} aria-hidden/>

          <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
            <button onClick={()=>router.push('/#kids-courses')} aria-label="Back to all courses"
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', border:'2px solid #FF6B9D', color:'#FF6B9D', fontWeight:700, fontSize:14, borderRadius:50, padding:'8px 20px', cursor:'pointer', marginBottom:36, boxShadow:'0 2px 8px rgba(255,107,157,0.15)', transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#FF6B9D'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#FF6B9D'; }}>
              <FaArrowLeft size={12}/> Back to All Courses
            </button>

            <div style={{ display:'flex', flexWrap:'wrap', gap:48, alignItems:'center', justifyContent:'space-between' }}>
              {/* Left */}
              <div className="hero-in" style={{ flex:'1 1 380px', maxWidth:580 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#FF6B9D,#FF8C42)', color:'#fff', borderRadius:50, padding:'5px 18px', fontSize:13, fontWeight:800, letterSpacing:1, marginBottom:18, textTransform:'uppercase' }}>
                  📚 Class 1st – 5th · Primary School
                </span>
                <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(32px,5vw,52px)', fontWeight:800, lineHeight:1.15, color:'#1A1035', margin:'0 0 20px' }}>
                  Fun & Effective{' '}<span style={{ color:'#FF6B9D' }}>Primary</span>{' '}Tuition with{' '}<span style={{ color:'#6C63FF' }}>AI Tools</span>
                </h1>
                <p style={{ fontSize:17, color:'#555', lineHeight:1.8, margin:'0 0 28px' }}>
                  Expert 1-on-1 online tutoring for <strong>Class 1 to 5</strong> — now with <strong>AI-powered learning tools</strong>. Ask doubts anytime, take practice quizzes, and get personalised study plans. Building strong foundations has never been this engaging.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:36 }}>
                  {benefits.map(b=>(
                    <span key={b} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff', border:'1.5px solid #F0D6FF', borderRadius:50, padding:'5px 14px', fontSize:13, fontWeight:700, color:'#6C63FF', boxShadow:'0 1px 4px rgba(108,99,255,0.08)' }}>
                      <FaCheckCircle size={11} color="#6C63FF"/> {b}
                    </span>
                  ))}
                </div>
                <div className="hero-btns" style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                  <button onClick={()=>router.push('/find-tutor-flow/create-account')} aria-label="Find a tutor for your child"
                    style={{ background:'linear-gradient(135deg,#FF6B9D,#FF4F87)', color:'#fff', border:'none', borderRadius:50, padding:'14px 32px', fontWeight:800, fontSize:16, cursor:'pointer', boxShadow:'0 6px 20px rgba(255,107,157,0.35)', fontFamily:"'Nunito',sans-serif", transition:'transform 0.2s,box-shadow 0.2s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(255,107,157,0.45)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(255,107,157,0.35)'; }}>
                    🎓 Find a Tutor
                  </button>
                  <button onClick={()=>router.push('/tutors')} aria-label="Book a free demo class"
                    style={{ background:'#fff', color:'#FF6B9D', border:'2px solid #FF6B9D', borderRadius:50, padding:'13px 28px', fontWeight:800, fontSize:16, cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'all 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#FFF0F6'}
                    onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                    ✨ Free Demo Class
                  </button>
                </div>
              </div>

              {/* Right image */}
              <div className="hero-img" style={{ flex:'1 1 260px', display:'flex', justifyContent:'center' }}>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', inset:-12, background:'linear-gradient(135deg,rgba(255,107,157,0.15),rgba(108,99,255,0.12))', borderRadius:32, transform:'rotate(3deg)' }} aria-hidden/>
                  <img src="/images/kids-courses/primary.png" alt="Happy primary school students learning online with a tutor" width={400} height={400} loading="eager"
                    style={{ width:'min(340px,90vw)', height:'auto', borderRadius:28, position:'relative', zIndex:1, boxShadow:'0 20px 50px rgba(0,0,0,0.12)', objectFit:'cover' }}/>
                  <div className="float-el" style={{ position:'absolute', top:-16, right:-16, zIndex:2, background:'#fff', borderRadius:16, padding:'10px 16px', boxShadow:'0 8px 24px rgba(0,0,0,0.10)', display:'flex', alignItems:'center', gap:8 }}>
                    <FaStar color="#F5A623" size={16}/>
                    <span style={{ fontWeight:800, fontSize:14, color:'#1A1035' }}>4.9 / 5 Rating</span>
                  </div>
                  <div style={{ position:'absolute', bottom:-16, left:-16, zIndex:2, background:'linear-gradient(135deg,#6C63FF,#9B59B6)', borderRadius:16, padding:'10px 18px', boxShadow:'0 8px 24px rgba(108,99,255,0.3)', color:'#fff', fontWeight:800, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
                    <FaRobot size={14}/> AI-Powered Learning
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display:'flex', flexWrap:'wrap', background:'#fff', borderRadius:20, boxShadow:'0 8px 32px rgba(0,0,0,0.07)', marginTop:56, overflow:'hidden' }} role="list" aria-label="Key statistics">
              {stats.map((s,i)=>(
                <div key={s.label} className="stats-item" role="listitem" style={{ flex:'1 1 120px', textAlign:'center', padding:'24px 16px', borderRight:i<stats.length-1?'1px solid #F0EEF8':'none' }}>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:28, fontWeight:800, color:'#FF6B9D' }}>{s.value}</div>
                  <div style={{ fontSize:13, color:'#777', fontWeight:600, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ AI TOOLS ════ */}
        <section aria-labelledby="ai-tools-heading" style={{ padding:'80px 24px', background:'linear-gradient(180deg,#F8F7FF,#fff)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#6C63FF,#9B59B6)', color:'#fff', borderRadius:50, padding:'5px 18px', fontSize:13, fontWeight:800, letterSpacing:1, marginBottom:16, textTransform:'uppercase' }}>
                <FaRobot size={12}/> Powered by AI
              </span>
              <h2 id="ai-tools-heading" style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#1A1035', margin:'0 0 12px' }}>Free AI Learning Tools 🤖</h2>
              <p style={{ fontSize:17, color:'#666', maxWidth:540, margin:'0 auto' }}>Three powerful tools to supercharge your child's learning — available free, right here on this page.</p>
            </div>

            <div style={{ display:'flex', gap:12, marginBottom:32, justifyContent:'center', flexWrap:'wrap' }}>
              {aiTools.map(tool=>(
                <button key={tool.id} onClick={()=>setActiveTab(tool.id)}
                  style={{ padding:'12px 28px', borderRadius:50, fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'all 0.2s', border:'2px solid', borderColor:activeTab===tool.id?'#6C63FF':'#EDE9FF', background:activeTab===tool.id?'linear-gradient(135deg,#6C63FF,#9B59B6)':'#fff', color:activeTab===tool.id?'#fff':'#6C63FF', boxShadow:activeTab===tool.id?'0 6px 20px rgba(108,99,255,0.3)':'none' }}>
                  {tool.label}
                </button>
              ))}
            </div>

            <div style={{ maxWidth:800, margin:'0 auto' }}>
              {aiTools.find(t=>t.id===activeTab)?.component}
            </div>
          </div>
        </section>

        {/* ════ SUBJECTS ════ */}
        <section aria-labelledby="subjects-heading" style={{ padding:'80px 24px', background:'#fff' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <h2 id="subjects-heading" style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(26px,4vw,40px)', fontWeight:800, color:'#1A1035', margin:'0 0 12px' }}>What Your Child Will Learn 🎯</h2>
              <p style={{ fontSize:17, color:'#666', maxWidth:520, margin:'0 auto' }}>A comprehensive CBSE &amp; ICSE aligned curriculum designed to make every subject enjoyable for Classes 1–5.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 }} role="list">
              {subjects.map(sub=>(
                <article key={sub.name} role="listitem" aria-label={`${sub.name} - ${sub.tag}`}
                  style={{ background:sub.bg, border:`1.5px solid ${sub.color}22`, borderRadius:24, padding:28, transition:'transform 0.25s,box-shadow 0.25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${sub.color}28`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div style={{ width:54, height:54, borderRadius:16, background:sub.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, boxShadow:`0 6px 16px ${sub.color}44` }} aria-hidden>{sub.icon}</div>
                    <span style={{ background:sub.color+'18', color:sub.color, fontSize:11, fontWeight:800, letterSpacing:1, padding:'4px 12px', borderRadius:50, textTransform:'uppercase' }}>{sub.tag}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:'#1A1035', margin:'0 0 8px' }}>{sub.name}</h3>
                  <p style={{ fontSize:14, color:'#666', lineHeight:1.7, margin:'0 0 20px' }}>{sub.desc}</p>
                  <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8 }}>
                    {sub.highlights.map(h=>(
                      <li key={h} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#444', fontWeight:600 }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:sub.color, flexShrink:0 }} aria-hidden/> {h}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════ WHY US ════ */}
        <section aria-labelledby="why-heading" style={{ padding:'80px 24px', background:'linear-gradient(135deg,#FFF0F9,#F3F2FF)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
            <h2 id="why-heading" style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1A1035', marginBottom:12 }}>Why Parents Choose Us 💛</h2>
            <p style={{ color:'#666', fontSize:16, maxWidth:480, margin:'0 auto 52px' }}>Trusted by 500+ families across India for quality, personalised primary education.</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:24, justifyContent:'center' }}>
              {[
                { emoji:'🧑‍🏫', title:'Verified Expert Tutors', desc:'All tutors are background-checked with proven teaching experience for young learners.' },
                { emoji:'🤖', title:'AI-Powered Tools', desc:'Free AI explainer, quiz generator, and study planner available 24/7 for every student.' },
                { emoji:'📊', title:'Progress Tracking',  desc:'Regular assessments and detailed reports so parents stay informed every step of the way.' },
                { emoji:'📅', title:'Flexible Scheduling', desc:'Book sessions at times that suit your child — weekdays, evenings, or weekends.' },
              ].map(item=>(
                <div key={item.title} style={{ background:'#fff', borderRadius:20, padding:'32px 28px', flex:'1 1 220px', maxWidth:260, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize:40, marginBottom:14 }} aria-hidden>{item.emoji}</div>
                  <h3 style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:'#1A1035', marginBottom:8 }}>{item.title}</h3>
                  <p style={{ fontSize:14, color:'#666', lineHeight:1.7, margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ TESTIMONIALS ════ */}
        <section aria-labelledby="reviews-heading" style={{ padding:'80px 24px', background:'#fff' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <h2 id="reviews-heading" style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(24px,4vw,38px)', fontWeight:800, color:'#1A1035', marginBottom:12 }}>What Parents Are Saying ❤️</h2>
              <p style={{ color:'#666', fontSize:16 }}>Real reviews from real families across India</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
              {testimonials.map((t,i)=>(
                <div key={i} style={{ background:'linear-gradient(135deg,#FFF0F9,#F8F7FF)', border:'1.5px solid #F0D6FF', borderRadius:24, padding:28 }}>
                  <div style={{ display:'flex', gap:4, marginBottom:14 }}>
                    {Array.from({length:t.rating}).map((_,j)=><FaStar key={j} color="#F5A623" size={14}/>)}
                  </div>
                  <p style={{ fontSize:15, color:'#444', lineHeight:1.8, margin:'0 0 20px', fontStyle:'italic' }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#FF6B9D,#FF8C42)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14, color:'#1A1035' }}>{t.name}</div>
                      <div style={{ fontSize:12, color:'#888' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ CTA ════ */}
        <section aria-label="Enrol your child" style={{ padding:'80px 24px', background:'linear-gradient(135deg,#FF6B9D 0%,#FF8C42 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <span style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} aria-hidden/>
          <span style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} aria-hidden/>
          <div style={{ maxWidth:640, margin:'0 auto', position:'relative', zIndex:1 }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🌟</div>
            <h2 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#fff', margin:'0 0 16px' }}>
              Ready to Supercharge Your Child's Learning?
            </h2>
            <p style={{ color:'rgba(255,255,255,0.9)', fontSize:17, lineHeight:1.7, marginBottom:40 }}>
              Join 500+ happy students. Get expert tutors + <strong>free AI tools</strong>. Book a free demo — no commitment required.
            </p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={()=>router.push('/find-tutor-flow/create-account')} aria-label="Find a primary section tutor now"
                style={{ background:'#fff', color:'#FF6B9D', border:'none', borderRadius:50, padding:'16px 36px', fontWeight:800, fontSize:17, cursor:'pointer', fontFamily:"'Nunito',sans-serif", boxShadow:'0 8px 24px rgba(0,0,0,0.15)', transition:'transform 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                🎓 Find a Tutor Now
              </button>
              <button onClick={()=>router.push('/tutors')} aria-label="Book a free demo class"
                style={{ background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.7)', borderRadius:50, padding:'15px 32px', fontWeight:800, fontSize:17, cursor:'pointer', fontFamily:"'Nunito',sans-serif", transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                ✨ Book Free Demo
              </button>
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
};

export default PrimarySection;