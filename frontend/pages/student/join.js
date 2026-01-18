// pages/student/join.js
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import Button from "@/components/Button";

export default function StudentJoin() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  function go() {
    if (!name.trim() || !code.trim()) return alert("Enter name and class code");
    // pass name via query param or local state
    router.push(`/student/class/${code}?name=${encodeURIComponent(name.trim())}`);
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl-2 p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Join Class</h2>
          <div className="mt-4 grid gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="p-2 border rounded"/>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Class code" className="p-2 border rounded"/>
            <Button onClick={go} className="bg-pastel-green">Join</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
