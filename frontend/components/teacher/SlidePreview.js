// components/teacher/SlidePreview.js
import { useEffect, useRef, useState } from "react";
import { getSocketInstance } from "@/lib/sockets/socket";
import { absoluteLessonUrl, listLessons, uploadLesson } from "@/lib/classroom";
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
      console.log('Teacher PDF.js worker loaded from:', sources[index]);
    };
    img.onerror = () => tryLoadWorker(sources, index + 1);
    img.src = sources[index];
  };

  tryLoadWorker(workerSources);
}

export default function SlidePreview({
  classCode,
  lessons = [],
  currentSlideIndex = 0,
  currentPdfPage = 1,
  onSlideChange,
  onPdfPageChange,
  onLessonUpload
}) {
  const [numPages, setNumPages] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const wrapperRef = useRef(null);

 
  function goFullscreen() {
    const el = wrapperRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  async function handleQuickUpload(e) {
    e.preventDefault();
    if (!uploadFile) return alert("Please select a file to upload");

    setUploading(true);
    try {
      const fileName = uploadFile.name.replace(/\.[^/.]+$/, ""); // Remove extension for title
      await uploadLesson(uploadFile, classCode, fileName);
      setUploadFile(null);
      alert("Slide uploaded successfully!");
      // Notify parent component to refresh lessons
      if (onLessonUpload) {
        onLessonUpload();
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  function renderPreview(slide) {
    if (!slide) {
      // Show upload area when no slides are available
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Slides Available</h3>
            <p className="text-gray-600 mb-6">Upload a PDF or PPT to start presenting</p>
          </div>

          {/* Quick Upload Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-dashed border-gray-300 w-full max-w-md">
            <form onSubmit={handleQuickUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF or PPT file
                </label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {uploadFile && (
                <div className="text-sm text-gray-600">
                  Selected: <strong>{uploadFile.name}</strong>
                </div>
              )}

              <button
                type="submit"
                disabled={!uploadFile || uploading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "Uploading..." : "Upload & Present"}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Supported formats: PDF, PPT, PPTX</p>
            <p>PPT files will be automatically converted to PDF</p>
          </div>
        </div>
      );
    }

    const url = absoluteLessonUrl(slide.url);
    console.log('Teacher rendering slide:', slide, 'URL:', url);

    // show video if mp4
    if (slide.url && slide.url.toLowerCase().endsWith(".mp4")) {
      return <video src={url} controls className="max-h-full max-w-full" />;
    }

    // if PDF - show using react-pdf for better control
    if (slide.url && slide.url.toLowerCase().endsWith(".pdf")) {
      console.log('Teacher loading PDF:', { slide, url, currentPdfPage });

      // Test if URL is accessible
      fetch(url, { method: 'HEAD' })
        .then(response => console.log('PDF URL accessible:', response.ok, response.status))
        .catch(error => console.error('PDF URL not accessible:', error));

      return (
        <Document
          file={encodeURI(url)}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('Teacher PDF load error:', error);
            console.error('Failed URL:', url);
          }}
          onSourceError={(error) => {
            console.error('Teacher PDF source error:', error);
            console.error('Failed URL:', url);
          }}
          className="flex justify-center h-full"
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-500">
                <div className="text-4xl mb-2">⚠️</div>
                <p>Failed to load PDF</p>
                <p className="text-xs mt-1">Check console for details</p>
              </div>
            </div>
          }
          noData={
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📄</div>
                <p>No PDF data</p>
              </div>
            </div>
          }
        >
                        <Page
                          pageNumber={currentPdfPage}
                          scale={1.0}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading="Loading page..."
                          error="Failed to load page"
                        />
        </Document>
      );
    }

    
    return <img src={url} alt={slide.title || "slide"} className="max-h-full max-w-full object-contain" />;
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Live Slide</div>
          <div className="text-xs text-gray-500">Class: {classCode || "—"}</div>
          {lessons[currentSlideIndex] && lessons[currentSlideIndex].url && lessons[currentSlideIndex].url.toLowerCase().endsWith(".pdf") && numPages && numPages > 1 && (
            <div className="text-xs text-blue-600 mt-1">PDF Page {currentPdfPage} of {numPages}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUploadFile(file);
                  setTimeout(() => {
                    const fakeEvent = {
                      preventDefault: () => {},
                      target: { files: [file] }
                    };
                    handleQuickUpload(fakeEvent);
                  }, 100);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="quick-upload"
            />
            <button
              disabled={uploading}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-1"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>+</span>
              )}
              <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload PDF"}</span>
            </button>
          </div>

          {/* Slide Info */}
          <div className="text-right">
            <div className="text-sm font-semibold text-blue-600">
              Slide {lessons.length ? currentSlideIndex + 1 : 0} / {lessons.length || 0}
            </div>
            {lessons[currentSlideIndex] && (
              <div className="text-xs text-gray-500 truncate max-w-32" title={lessons[currentSlideIndex].title}>
                {lessons[currentSlideIndex].title}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={wrapperRef} className="w-full h-80 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
        {renderPreview(lessons[currentSlideIndex])}
      </div>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {/* Slide Navigation */}
        <button
          onClick={() => {
            const i = Math.max(0, currentSlideIndex - 1);
            console.log('Teacher changing to slide:', i + 1);
            onSlideChange && onSlideChange(i);
          }}
          disabled={currentSlideIndex === 0}
          className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Slide
        </button>

        <button
          onClick={() => {
            const i = Math.min(lessons.length - 1, currentSlideIndex + 1);
            console.log('Teacher changing to slide:', i + 1);
            onSlideChange && onSlideChange(i);
          }}
          disabled={currentSlideIndex === lessons.length - 1}
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Slide
        </button>

        {/* PDF Page Navigation */}
        {lessons[currentSlideIndex] && lessons[currentSlideIndex].url && lessons[currentSlideIndex].url.toLowerCase().endsWith(".pdf") && numPages && numPages > 1 && (
          <>
            <button
              onClick={() => {
                const newPage = Math.max(1, currentPdfPage - 1);
                console.log('Teacher changing to PDF page:', newPage);
                onPdfPageChange && onPdfPageChange(newPage);
              }}
              disabled={currentPdfPage === 1}
              className="px-3 py-2 rounded bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous Page
            </button>

            <span className="px-2 py-2 text-sm text-gray-600">
              Page {currentPdfPage} / {numPages}
            </span>

            <button
              onClick={() => {
                const newPage = Math.min(numPages, currentPdfPage + 1);
                console.log('Teacher changing to PDF page:', newPage);
                onPdfPageChange && onPdfPageChange(newPage);
              }}
              disabled={currentPdfPage === numPages}
              className="px-3 py-2 rounded bg-yellow-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page
            </button>
          </>
        )}

        <button onClick={goFullscreen} className="ml-auto px-3 py-2 rounded bg-pastel-green">
          Fullscreen
        </button>

        <a
          className="ml-3 text-sm text-blue-600"
          href={lessons[currentSlideIndex] ? absoluteLessonUrl(lessons[currentSlideIndex].url) : "#"}
          target="_blank"
          rel="noreferrer"
        >
          Open PDF
        </a>
      </div>
    </div>
  );
}
