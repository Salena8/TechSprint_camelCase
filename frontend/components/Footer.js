import { BookOpen } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 bg-[#FAFAF8]">
      <div className="max-w-xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between ">
        

        <div className="flex items-center gap-1 text-gray-600">
          <p className="text-s text-gray-400">© {year}</p>
          <BookOpen size={18} className="text-purple-500" />
          <span className="font-medium">ShikshaNode</span>
          <p className="text-sm text-gray-500 text-center">
            Offline-first classroom learning for rural schools
          </p>
        </div>

      
      </div>
    </footer>
  );
}
