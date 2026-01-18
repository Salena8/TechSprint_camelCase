import React, { useState } from "react";
import { Card, Button } from "@/components/ui";
import useStudentSocket from "@/lib/sockets/useStudentSocket";

export default function StudentClassroom({ classCode, studentName }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(85);
  const [currentSlideData, setCurrentSlideData] = useState(null);
  const { currentSlide } = useStudentSocket({ classCode, studentName });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch slide data when currentSlide changes
  React.useEffect(() => {
    const fetchSlideData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/slides/${classCode}/${currentSlide + 1}`);
        if (response.ok) {
          const slideData = await response.json();
          setCurrentSlideData(slideData);
        } else {
          setCurrentSlideData(null); // No slide uploaded for this number
        }
      } catch (error) {
        console.error('Failed to fetch slide data:', error);
        setCurrentSlideData(null);
      }
    };

    if (classCode) {
      fetchSlideData();
    }
  }, [currentSlide, classCode]);

  // Sample lesson materials (would come from backend)
  const lessonMaterials = [
    { type: "PDF", name: "Introduction_to_Physics.pdf", icon: "📄" },
    { type: "Video", name: "Motion_Lecture.mp4", icon: "🎥" },
    { type: "Notes", name: "Chapter_Notes.txt", icon: "📝" },
  ];

  return (
    <div className="space-y-6">
      {/* Slide Broadcasting Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Live Lesson</h3>
          <Button variant="secondary" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>

        <div className={`bg-blue-50 rounded-lg p-6 text-center transition-all ${
          isFullscreen ? 'min-h-screen' : ''
        }`}>
          <p className="text-sm text-gray-500 mb-3">Current Slide</p>
          {currentSlideData ? (
            <p className="text-lg font-semibold text-blue-600 mb-2 truncate px-2">
              {currentSlideData.filename}
            </p>
          ) : (
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Slide {currentSlide + 1}
            </p>
          )}
          <p className="text-xs text-gray-400 mb-4">Live broadcast from teacher</p>

          {/* Slide Content Display */}
          <div className={`bg-white rounded-lg shadow-inner overflow-hidden ${
            isFullscreen ? 'h-full' : 'h-80'
          }`}>
            {currentSlideData ? (
              <div className="relative h-full">
                {currentSlideData.mimeType?.startsWith('image/') ? (
                  <img
                    src={`http://localhost:8000${currentSlideData.url}`}
                    alt={currentSlideData.title}
                    className="w-full h-full object-contain"
                  />
                ) : currentSlideData.mimeType === 'application/pdf' ? (
                  <iframe
                    src={`http://localhost:8000${currentSlideData.url}`}
                    className="w-full h-full border-0"
                    title={currentSlideData.title}
                  />
                ) : (
                  <div className="h-full">
                    {/* Embedded PPTX viewer using Microsoft Office Online */}
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`http://localhost:8000${currentSlideData.url}`)}`}
                      className="w-full h-full border-0"
                      title={currentSlideData.title}
                      allowFullScreen
                    />
                    {/* Fallback display if iframe fails */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm font-medium text-center px-2 truncate">
                        {currentSlideData.filename}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Loading presentation...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm">Waiting for teacher to share slides</p>
                  {!isFullscreen && (
                    <p className="text-xs mt-1">Content will appear here when teacher uploads</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Live Quiz Section */}
      <Card>
        <h3 className="font-semibold mb-4">Live Quiz</h3>

        <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-yellow-800">Question 2 of 5</h4>
            <span className="text-sm text-yellow-600">Time: 45s</span>
          </div>

          <p className="text-yellow-800 mb-4">
            What is Newton's Second Law of Motion?
          </p>

          <div className="space-y-2">
            <Button variant="outline" className="w-full text-left justify-start">
              F = ma (Force equals mass times acceleration)
            </Button>
            <Button variant="outline" className="w-full text-left justify-start">
              E = mc² (Energy equals mass times speed of light squared)
            </Button>
            <Button variant="outline" className="w-full text-left justify-start">
              P = mv (Momentum equals mass times velocity)
            </Button>
            <Button variant="outline" className="w-full text-left justify-start">
              W = Fd (Work equals force times distance)
            </Button>
          </div>
        </div>
      </Card>

      {/* Lesson Pack Section */}
      <Card>
        <h3 className="font-semibold mb-4">Lesson Materials</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {lessonMaterials.map((material, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{material.icon}</span>
                <div>
                  <p className="font-medium text-sm">{material.name}</p>
                  <p className="text-xs text-gray-500">{material.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Points Section */}
      <Card>
        <h3 className="font-semibold mb-4">Your Progress</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Points</p>
            <p className="text-3xl font-bold text-green-600">{currentPoints}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Questions Answered</p>
            <p className="text-xl font-semibold">12/15</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(currentPoints / 100) * 100}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Keep answering questions to earn more points!
        </p>
      </Card>
    </div>
  );
}