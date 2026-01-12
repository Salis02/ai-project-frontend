import React, { useState } from 'react';
import axios from 'axios';
import { Send, Brain, ShieldAlert, CheckCircle } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.BACKEND_URL}/api/analyze`, { text });
      setResult(res.data);
    } catch (err) {
      alert("Gagal koneksi ke Backend/AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Brain className="text-blue-400" /> AI Ticket Triage
        </h1>

        <textarea
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows="4"
          placeholder="Masukkan pesan atau feedback pelanggan di sini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !text}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition"
        >
          {loading ? "AI Sedang Berpikir..." : <><Send size={18} /> Analisis Sekarang</>}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-xl animate-in fade-in duration-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-400" /> Hasil Analisis AI
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm">Kategori</p>
                <p className="font-bold">{result.result.category}</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm">Sentimen</p>
                <p className="font-bold">{result.result.sentiment}</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg col-span-2 border-l-4 border-red-500">
                <p className="text-gray-400 text-sm">Ringkasan</p>
                <p className="">{result.result.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;