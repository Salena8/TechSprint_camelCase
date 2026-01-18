// pages/student/[code].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Leaderboard from "@/components/Leaderboard";

import useStudentSocket from "@/lib/sockets/useStudentSocket";
import { listLessons, absoluteLessonUrl } from "@/lib/classroom";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  
  const workerSources = [
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  ];

 
  const tryLoadWorker = (sources, index = 0) => {
    if (index >= sources.length) {
      console.error('Failed to load PDF.js worker from any source');
      return;
    }

    const img = new Image();
    img.onload = () => {
      pdfjs.GlobalWorkerOptions.workerSrc = sources[index];
      console.log('PDF.js worker loaded from:', sources[index]);
    };
    img.onerror = () => tryLoadWorker(sources, index + 1);
    img.src = sources[index];
  };

  tryLoadWorker(workerSources);
}

export default function StudentClass() {
  const router = useRouter();
  const { code, name: queryName } = router.query;

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [slides, setSlides] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [scores, setScores] = useState({});
  const [view, setView] = useState("info"); // info | leaderboard

  //  Initialize student identity
  useEffect(() => {
    if (!router.isReady) return;

    const n = queryName || "Student";
    setName(n);
    setStudentId(`${n}-${Math.random().toString(36).slice(2, 6)}`);
  }, [router.isReady]);

  
  useEffect(() => {
    if (!code) return;

    async function load() {
      const ls = await listLessons(code);
      setSlides(ls || []);
      setSlideIndex(0);
    }

    load();
  }, [code]);

  // Student socket connection
  useStudentSocket({
    classId: code,
    studentId,
    name,

    onSlideChange: (payload) => {
      console.log('Student received slide change:', payload);
      if (payload.index !== undefined) {
        setSlideIndex(payload.index);
        setPdfPage(1); // Reset to first page when changing slides
        console.log('Student switched to slide:', payload.index + 1);
      }
      if (payload.page !== undefined) {
        setPdfPage(payload.page);
        console.log('Student switched to PDF page:', payload.page);
      }
    },

    onQuizStart: (payload) => {
      setQuiz(payload);
    },

    onScoreUpdate: ({ studentId, score }) => {
      setScores(prev => ({
        ...prev,
        [studentId]: (prev[studentId] || 0) + score
      }));
    },

    onLessonUpdate: (payload) => {
      // Refresh lessons when new ones are uploaded by teacher
      if (payload && payload.files) {
        console.log('New lessons uploaded:', payload.files);
        async function refreshLessons() {
          const ls = await listLessons(code);
          setSlides(ls || []);
        }
        refreshLessons();
      }
    }
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function submitAnswer(choiceIndex) {
    import("@/lib/sockets/socket").then(mod => {
      const socket = mod.getSocketInstance();
      socket.emit("submitAnswer", {
        classId: code,
        studentId,
        quizId: quiz.quizId,
        score: choiceIndex === quiz.correctIndex ? 10 : 0
      });
    });

    setQuiz(null);
  }

  const slide = slides[slideIndex];

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {name} </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setView("info")}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                view === "info"
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              📚 Class Info
            </button>
            <button
              onClick={() => setView("leaderboard")}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                view === "leaderboard"
                  ? "bg-yellow-500 text-white shadow-lg transform scale-105"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN CONTENT - Live Slide */}
          <div className="lg:col-span-3 space-y-6">
            {/* Live Slide - Much Larger */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">📖 Live Presentation</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {slides.length > 0 ? `Slide ${slideIndex + 1} of ${slides.length}` : "Waiting for teacher to start..."}
                    {slide && slide.url.endsWith(".pdf") && numPages && numPages > 1 && (
                      <span className="ml-2 text-blue-600">• Page {pdfPage} of {numPages}</span>
                    )}
                  </p>
                  {slide && (
                    <p className="text-xs text-gray-500 truncate max-w-64" title={slide.title}>
                      Currently viewing: {slide.title}
                    </p>
                  )}
                </div>
                {slides.length > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-500">{slideIndex + 1}</div>
                    <div className="text-sm text-gray-500">of {slides.length}</div>
                    {slide && slide.url.endsWith(".pdf") && numPages && numPages > 1 && (
                      <div className="text-sm text-blue-600 mt-1">
                        Page {pdfPage}/{numPages}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 shadow-inner">
                <div className="h-[500px] lg:h-[600px] flex items-center justify-center bg-white rounded-lg shadow-md">
                  {slide ? (
                    slide.url.endsWith(".mp4") ? (
                      <video
                        src={absoluteLessonUrl(slide.url)}
                        controls
                        className="max-h-full max-w-full rounded-lg"
                      />
                    ) : slide.url.endsWith(".pdf") ? (
                      (() => {
                        const pdfUrl = absoluteLessonUrl(slide.url);
                        console.log('Student loading PDF:', { slide, pdfUrl, pdfPage });

                        // Test if URL is accessible
                        fetch(pdfUrl, { method: 'HEAD' })
                          .then(response => console.log('Student PDF URL accessible:', response.ok, response.status))
                          .catch(error => console.error('Student PDF URL not accessible:', error));

                        return (
                          <Document
                            file={encodeURI(pdfUrl)}
                            onLoadSuccess={(pdf) => {
                              console.log('Student PDF loaded successfully:', pdf);
                              onDocumentLoadSuccess(pdf);
                            }}
                            onLoadError={(error) => {
                              console.error('Student PDF load error:', error);
                              console.error('Failed URL:', pdfUrl);
                            }}
                            onSourceError={(error) => {
                              console.error('Student PDF source error:', error);
                              console.error('Failed URL:', pdfUrl);
                            }}

                        className="flex justify-center h-full"
                        loading={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading presentation...</p>
                            </div>
                          </div>
                        }
                        error={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-red-500">
                              <div className="text-4xl mb-2">⚠️</div>
                              <p>Failed to load presentation</p>
                            </div>
                          </div>
                        }
                        noData={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📄</div>
                              <p>No presentation data</p>
                            </div>
                          </div>
                        }
                      >
                            <Page
                              pageNumber={pdfPage}
                              scale={1.2}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="shadow-lg rounded"
                            />
                          </Document>
                        );
                      })()
                    ) : (
                      <img
                        src={absoluteLessonUrl(slide.url)}
                        alt={slide.title}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <div className="text-6xl mb-4">📺</div>
                        <h3 className="text-xl font-semibold mb-2">Waiting for Presentation</h3>
                        <p>The teacher will start the presentation soon.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Section - Enhanced */}
            {quiz && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-600 text-white p-2 rounded-lg mr-3">
                    <span className="text-lg">❓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Quick Quiz</h4>
                    <p className="text-sm text-gray-600">Choose your answer below</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-800">{quiz.question}</p>
                </div>

                <div className="grid gap-3">
                  {quiz.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => submitAnswer(i)}
                      className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-left font-medium text-gray-700 hover:text-purple-700 group"
                    >
                      <div className="flex items-center">
                        <span className="bg-gray-100 group-hover:bg-purple-200 text-gray-600 group-hover:text-purple-700 px-3 py-1 rounded-lg text-sm font-bold mr-3">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{choice}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {view === "info" && (
              <>
                {/* Student Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white p-3 rounded-xl mr-4">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Student Profile</h4>
                      <p className="text-sm text-gray-600">Your session details</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Name</div>
                      <div className="font-semibold text-gray-800">{name}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Class Code</div>
                      <div className="font-semibold text-gray-800 font-mono">{code}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 uppercase tracking-wide">Status</div>
                      <div className="font-semibold text-green-800">🟢 Connected</div>
                    </div>
                  </div>
                </div>

                {/* Lessons Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-600 text-white p-3 rounded-xl mr-4">
                      <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Available Lessons</h4>
                      <p className="text-sm text-gray-600">{slides.length} lesson{slides.length !== 1 ? 's' : ''} available</p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {slides.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-3xl mb-2">📭</div>
                        <p>No lessons available yet</p>
                        <p className="text-xs">The teacher will upload lessons soon</p>
                      </div>
                    ) : (
                      slides.map((slide, index) => (
                        <div key={slide.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mr-2">
                                  {index + 1}
                                </span>
                                <div className="truncate">
                                  <div className="font-medium text-gray-800 text-sm">{slide.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(slide.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <a
                              href={absoluteLessonUrl(slide.url)}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors ml-2"
                            >
                              📖 View
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {view === "leaderboard" && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-100">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-500 text-white p-3 rounded-xl mr-4">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Live Leaderboard</h4>
                    <p className="text-sm text-gray-600">See how you're doing!</p>
                  </div>
                </div>

                <Leaderboard scores={scores} />
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
