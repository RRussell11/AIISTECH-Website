import GeminiChat from '@/components/ai/GeminiChat';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Gemini AI Chat Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience the power of Google Gemini AI integrated into AIISTECH-Website
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px]">
          <GeminiChat 
            stream={true}
            welcomeMessage="Hello! I'm powered by Google Gemini AI. I can help answer questions, provide recommendations, or assist with analyzing your automation needs. How can I help you today?"
          />
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Try asking:
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• "What are the benefits of AI automation in healthcare?"</li>
            <li>• "How can I calculate ROI for automation projects?"</li>
            <li>• "What compliance considerations are important for HIPAA?"</li>
            <li>• "Explain the difference between RPA and AI automation"</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
