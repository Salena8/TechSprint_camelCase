// pages/teacher/create-class.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Button, Card, IconBox } from '../../components/ui'; // or your equivalent
import { previewCode, createClassLocal } from '../../lib/classroom';

export default function CreateClassPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    classroomName: '',
    subject: '',
    grade: '6',
    teacherName: '',
    duration: '45'
  });
  const [preview, setPreview] = useState('');
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Backend base URL. If your frontend proxies /api to backend, keep null (use relative /.)
  // Or set this to 'http://<teacher-ip>:8000' at runtime (e.g., in _app.js)
  const SERVER_ROOT = typeof window !== 'undefined' ? window.__SERVER_URL__ || null : null;

  useEffect(() => {
    setPreview(previewCode());
  }, []);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e && e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      classroomName: form.classroomName || `Class ${form.grade}`,
      subject: form.subject || 'General',
      grade: form.grade,
      teacherName: form.teacherName || 'Teacher',
      duration: form.duration
    };

    // Try backend first (POST /api/classrooms). Use SERVER_ROOT if set, else use relative path.
    const apiUrl = SERVER_ROOT ? `${SERVER_ROOT.replace(/\/$/, '')}/api/classrooms` : `/api/classrooms`;

    try {
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        const data = await resp.json();
        setCreated(data);
        // persist active class locally
        localStorage.setItem('activeClass', JSON.stringify(data));
        setLoading(false);
        return;
      } else {
        // fallback to local if server returns non-ok
        console.warn('Backend returned non-OK', resp.status);
      }
    } catch (err) {
      // server not reachable → fallback
      console.warn('Backend not reachable, using local fallback', err);
    }

    // fallback local
    const local = createClassLocal(payload);
    setCreated(local);
    setLoading(false);
  }

  function handleEnterClassroom() {
    if (!created) return;
    localStorage.setItem('activeClass', JSON.stringify(created));
    // navigate to teacher dashboard — teacher page should read activeClass or query param
    router.push(`/teacher/class/${created.code}`);
  }

  function handleCopy() {
    if (!created) return;
    navigator.clipboard?.writeText(created.code);
    alert(`Copied: ${created.code}`);
  }

  function handleRegeneratePreview() {
    setPreview(previewCode());
  }

  return (
    <div>
      <Header title="Create Classroom" />
      <main className="max-w-3xl mx-auto p-6">
        {!created ? (
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Create a Classroom</h2>
              <p className="text-sm text-gray-600">Fill in details and create the classroom. Students will join using the code below.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="e.g., Science, Mathematics"
                  className="mt-2 w-full p-3 rounded-xl-2 border border-gray-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class / Grade</label>
                  <select name="grade" value={form.grade} onChange={onChange}
                          className="mt-2 w-full p-3 rounded-xl-2 border border-gray-200 bg-white">
                    {Array.from({length:7}, (_,i)=>6+i).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <select name="duration" value={form.duration} onChange={onChange}
                          className="mt-2 w-full p-3 rounded-xl-2 border border-gray-200 bg-white">
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                <input name="teacherName" value={form.teacherName} onChange={onChange}
                       placeholder="Your name" className="mt-2 w-full p-3 rounded-xl-2 border border-gray-200 bg-white" />
              </div>

              <div className="mt-2">
                <label className="block text-sm text-gray-500">Your classroom code (preview)</label>
                <div className="mt-2 inline-flex items-center gap-3 bg-pastel-purple px-4 py-2 rounded-xl-2">
                  <div className="font-mono text-lg text-primaryText">{preview}</div>
                  <div className="text-sm text-gray-600">Students will use this code</div>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Button variant="primarySoft" type="submit" className="px-8 py-3" disabled={loading}>
                  {loading ? 'Creating…' : 'Create Classroom'}
                </Button>
                <Button variant="ghost" type="button" onClick={handleRegeneratePreview} className="px-6">Regenerate Code</Button>
                <Button variant="secondarySoft" type="button" onClick={() => { setForm({ classroomName:'', subject:'', grade:'6', teacherName:'', duration:'45' }); }} className="px-6">
                  Cancel
                </Button>
              </div>
            </form>

            {error && <div className="text-sm text-red-500">{error}</div>}
          </Card>
        ) : (
          <Card className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Classroom Created!</h2>
            <p className="text-sm text-gray-600">Share this code with students to join (they must be on the same Wi-Fi).</p>

            <div className="mx-auto mt-3 p-6 rounded-xl-2 bg-pastel-purple inline-block shadow-soft">
              <div className="text-xs text-gray-500">Classroom Code</div>
              <div className="text-3xl font-bold mt-2">{created.code}</div>
              <div className="mt-3">
                <button onClick={handleCopy} className="bg-primaryText text-white px-4 py-2 rounded-lg">Copy Code</button>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-4">
              <Button variant="primarySoft" onClick={handleEnterClassroom}>Enter Class</Button>
              <Button variant="ghost" onClick={() => setCreated(null)}>Back</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
