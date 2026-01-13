// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import { Send, Brain, Sparkles } from 'lucide-react';
import { useToast } from './hooks/useToast';
import { SkeletonCard } from './components/Skeleton';
import LoadingSpinner from './components/LoadingSpinner';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    let accumulatedText = "";

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));
            if (data.chunk) {
              accumulatedText += data.chunk;
              // Simpan sementara ke state agar user melihat "ketikan" AI
              setResult({ result: { summary: accumulatedText + "..." } });
            }
            if (data.done) {
              setResult({ result: data.final }); // Set hasil final yang rapi
            }
          }
        });
      }
    } catch (err) {
      showToast.error('Terjadi kesalahan saat menganalisis. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Ticket Triage
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analisis otomatis feedback pelanggan
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Masukkan Pesan Pelanggan
          </label>
          <textarea
            className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                     transition-colors resize-none"
            rows="6"
            placeholder="Contoh: Saya sangat kecewa dengan layanan yang diberikan. Pesanan saya terlambat 3 hari..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tekan Ctrl + Enter untuk analisis cepat
            </p>
            <button type="button"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600
                       text-white font-medium rounded-lg flex items-center gap-2 
                       transition-all duration-200 transform hover:scale-105 active:scale-95
                       disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Menganalisis...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Analisis Sekarang
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && <SkeletonCard />}

        {/* Results */}
        {!loading && result && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Hasil Analisis AI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                  KATEGORI
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {result.result.category}
                </p>
              </div>

              {/* Sentiment */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                  SENTIMEN
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {result.result.sentiment}
                </p>
              </div>

              {/* Summary */}
              <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-900 border-l-4 border-green-500 rounded-lg">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  RINGKASAN
                </p>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {result.result.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !result && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Brain className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Masukkan pesan pelanggan untuk memulai analisis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;