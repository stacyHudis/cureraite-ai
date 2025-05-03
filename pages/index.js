import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CureraiteUI() {
  const [question, setQuestion] = useState("");
  const [illness, setIllness] = useState("IBS");
  const [debateLines, setDebateLines] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState();
  const [answers, setAnswers] = useState({});
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


  const [expandedCards, setExpandedCards] = useState({
    doctor: false,
    naturopath: false,
    tony: false,
  });


  const [needsReadMore, setNeedsReadMore] = useState({
    doctor: false,
    naturopath: false,
    tony: false,
  });

  const doctorRef = useRef(null);
  const naturopathRef = useRef(null);
  const tonyRef = useRef(null);

  // Check if content overflows for each card
  useEffect(() => {
    const checkOverflow = (ref, key) => {
      setTimeout(() => {
        if (ref.current) {
          const isOverflowing = ref.current.scrollHeight > ref.current.clientHeight;
          setNeedsReadMore((prev) => ({ ...prev, [key]: isOverflowing }));
        }
      }, 100);

    };
    checkOverflow(doctorRef, "doctor");
    checkOverflow(naturopathRef, "naturopath");
    checkOverflow(tonyRef, "tony");
  }, [answers]);

  const toggleExpand = (persona) => {
    setExpandedCards((prev) => ({
      ...prev,
      [persona]: !prev[persona],
    }));
  };


  const doctorQuotes = [
    "If it’s not clinically proven, it’s probably nonsense.",
    "I don't guess. I diagnose.",
    "No herbs — just hard data."
  ];

  const naturopathQuotes = [
    "Let your gut heal itself — it knows what to do.",
    "Nature has the best answers — we just forgot to listen.",
    "You can’t medicate your way out of what you ate your way into."
  ];

  const tonyQuotes = [
    "Get up. Get moving. Get over it.",
    "Your gut doesn’t need advice — you need action!",
    "No excuses. Just enzymes and momentum."
  ];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];





  useEffect(() => {
    const funQuotes = [
      "Gathering wisdom from the AI roundtable...",
      "TonyBot is flexing while the doctor argues...",
      "Sage is brewing herbal tea for your insight...",
      "Hold tight, the AI council is in session..."
    ];

    if (loading) {
      const pick = funQuotes[Math.floor(Math.random() * funQuotes.length)];
      setQuote(pick);
    }
  }, [loading]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/personas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, illness })
      });
      const data = await response.json();

      if (data.debate) {
        const lines = data.debate.trim().split("\n").filter(Boolean);
        const uniquePersonas = new Set();
        const filteredLines = [];

        for (const line of lines) {
          const persona = getPersonaFromLine(line);
          if (!uniquePersonas.has(persona)) {
            uniquePersonas.add(persona);
            filteredLines.push(line);
          }
        }

        setDebateLines(filteredLines);
        setAnswers(data);

      }
      setProducts(data.products || []);
    } catch (err) {
      console.error("❌ Error fetching insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const avatars = {
    doctor: "/avatars/doctor.jpg",
    naturopath: "/avatars/naturopath.png",
    tony: "/avatars/tonyBot.png",
    test: "/avatars/test.png" // <-- Add this (make sure the image exists)
  };

  const names = {
    doctor: "Dr. Gray",
    naturopath: "Sage Willow",
    tony: "TonyBot",
    test: "ClinicalBot" // <-- Display name for test persona
  };

  const titles = {
    doctor: "Board-Certified Dermatologist",
    naturopath: "Certified Holistic Healer",
    tony: "Mindset & Performance Coach",
  };
  
  const refs = {
    doctor: doctorRef,
    naturopath: naturopathRef,
    tony: tonyRef,
  };


  const getPersonaFromLine = (line) => {
    if (line.startsWith("👩‍⚕️ Dr. Gray")) return "doctor";
    if (line.startsWith("🌿 Sage Willow")) return "naturopath";
    if (line.startsWith("🔥 TonyBot")) return "tony";
    if (line.includes("ClinicalBot")) return "test";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-emerald-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">CurAIte</h1>

      </header>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Three Perspectives. One You.</h2>
        <p className="text-gray-600 mt-1">Get lifestyle advice that actually makes sense.</p>
      </div>

      <div className="flex gap-4 justify-center items-center max-w-3xl mx-auto mb-6">
        <input
          placeholder="I'm struggling with bloating."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-grow rounded-lg shadow px-4 py-2 border border-gray-300"
        />
        <select
          value={illness}
          onChange={(e) => setIllness(e.target.value)}
          className="rounded-lg px-4 py-2 border border-gray-300 bg-white"
        >
          <option value="IBS">IBS</option>
          <option value="PCOS">PCOS</option>
          <option value="Psoriasis">Psoriasis</option>
          <option value="Ulcerative Colitis">Ulcerative Colitis</option>
        </select>
        <button onClick={handleAsk} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow">
          Get Insights
        </button>
      </div>

      {!loading && answers.doctor && answers.naturopath && answers.tony && (
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto my-10">
          {/* DoctorBot */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-h-[500px]">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow p-6 text-center flex flex-col items-center relative"
          >
            <Image
              src="/avatars/doctor.jpg"
              alt="Dr. Gray"
              width={96}
              height={100}
              className="rounded-full mb-4 mx-auto h-[100px]"
            />
            <div className="text-xl font-bold text-gray-800">Dr. Gray</div>
            <div className="text-sm text-gray-500 mb-4">Board-Certified Dermatologist</div>

            <div className="relative w-full">
              <p
                ref={doctorRef}
                className={`text-left text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pr-1 transition-all duration-500 ${expandedCards.doctor ? "max-h-full" : "max-h-60 overflow-hidden"
                  }`}
              >
                {answers.doctor}
              </p>

              {needsReadMore.doctor && !expandedCards.doctor && (
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {needsReadMore.doctor && (
              <button
                onClick={() => toggleExpand("doctor")}
                className="text-emerald-600 text-sm font-semibold mt-4 hover:underline focus:outline-none"
              >
                {expandedCards.doctor ? "Read Less" : "Read More"}
              </button>
            )}
          </motion.div>
          </div>

          {/* NaturopathBot */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-h-[500px]">

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow p-6 text-center flex flex-col items-center relative"
            >
              <Image
                src="/avatars/naturopath.png"
                alt="Sage Willow"
                width={96}
                height={100}
                className="rounded-full mb-4  h-[100px]"
              />
              <div className="text-xl font-bold text-gray-800">Sage Willow</div>
              <div className="text-sm text-gray-500 mb-4">Certified Holistic Healer</div>

              <div className="relative w-full">
                <p
                  ref={naturopathRef}
                  className={`text-left text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pr-1 transition-all duration-500 ${expandedCards.naturopath ? "max-h-full" : "max-h-60 overflow-hidden"
                    }`}
                >
                  {answers.naturopath}
                </p>

                {needsReadMore.naturopath && !expandedCards.naturopath && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>

              {needsReadMore.naturopath && (
                <button
                  onClick={() => toggleExpand("naturopath")}
                  className="text-emerald-600 text-sm font-semibold mt-4 hover:underline focus:outline-none"
                >
                  {expandedCards.naturopath ? "Read Less" : "Read More"}
                </button>
              )}
            </motion.div>

          </div>

          {/* TonyBot */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-h-[500px]">

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow p-6 text-center flex flex-col items-center relative"
            >
              <Image
                src="/avatars/tonyBot.png"
                alt="Tony Robbins"
                width={96}
                height={100}
                className="rounded-full mb-4 h-[100px]"
              />
              <div className="text-xl font-bold text-gray-800">Tony Robbins</div>
              <div className="text-sm text-gray-500 mb-4">Mindset & Performance Coach</div>

              <div className="relative w-full">
                <p
                  ref={tonyRef}
                  className={`text-left text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pr-1 transition-all duration-500 ${expandedCards.tony ? "max-h-full" : "max-h-60 overflow-hidden"
                    }`}
                >
                  {answers.tony}
                </p>

                
              </div>

              {needsReadMore.tony && (
                <button
                  onClick={() => toggleExpand("tony")}
                  className="text-emerald-600 text-sm font-semibold mt-4 hover:underline focus:outline-none"
                >
                  {expandedCards.tony ? "Read Less" : "Read More"}
                </button>
              )}
            </motion.div>
          </div>

        </div>
      )}
     

      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center my-10 space-y-4"
        >
          <motion.div
            className="text-4xl"
            animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            🤖💬🧠
          </motion.div>
          <motion.p
            className="text-sm text-gray-600 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {quote}
          </motion.p>
        </motion.div>
      )}

{!loading && debateLines.length === 0 && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center my-20"
        >
          <div className="flex justify-center items-center gap-6 mb-4">
            <div title={randomItem(doctorQuotes)}>
              <Image src="/avatars/doctor.jpg" alt="Dr. Gray" width={80}
                height={80}
                className="rounded-full cursor-help object-cover w-24 h-24" />
            </div>
            <div title={randomItem(naturopathQuotes)}>
              <Image src="/avatars/naturopath.png" alt="Sage Willow" width={80}
                height={80}
                className="rounded-full cursor-help object-cover w-24 h-24" />
            </div>
            <div title={randomItem(tonyQuotes)}>
              <Image src="/avatars/tonyBot.png" alt="TonyBot" width={80}
                height={80}
                className="rounded-full cursor-help object-cover w-24 h-24" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            <p>We&apos;re just standing here waiting to argue.</p>

          </h3>
          <p className="text-gray-500 mt-2">
            Dr. Gray, Sage Willow, and TonyBot are ready to contradict each other — for your benefit.
          </p>
          <p className="text-sm text-gray-400 mt-1 italic">
            Try: “What should I take when I fly if I have IBS?”
          </p>
        </motion.div>
      )}




      <motion.div animate={{ opacity: loading ? 0.4 : 1 }} transition={{ duration: 0.3 }}>
        {products.length > 0 && (
          <div className="max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">What’s Working for People Like You</h3>
                <p className="text-sm text-gray-500">Because your condition deserves more than guesswork.</p>
              </div>
              <div className="text-sm text-gray-500">Selected illness: <span className="font-medium">{illness}</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div key={index} className="p-4 bg-white rounded-xl shadow">
                  <div className="font-semibold text-gray-800 mb-1">{product.name}</div>
                  <p className="text-sm text-gray-600">{product.summary || product.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
