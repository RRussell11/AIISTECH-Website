import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AIITech - AI-Native Automation Platform
        </h1>
        <p className="text-center text-lg mb-4">
          Welcome to AIITech! This platform is integrated with Google Gemini AI for intelligent automation.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link 
            href="/demo"
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600">
              🤖 AI Chat Demo →
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience our Gemini AI-powered chat assistant with streaming responses
            </p>
          </Link>

          <Link 
            href="/roi-calculator"
            className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-green-600">
              📊 ROI Calculator →
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your automation ROI with AI-powered recommendations
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Powered by Next.js 14 + Google Gemini AI + Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
