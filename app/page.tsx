export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AIITech - AI-Native Automation Platform
        </h1>
        <p className="text-center text-lg mb-4">
          Welcome to AIITech! This platform is being built with Google Gemini AI integration.
        </p>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by Next.js 14 + Google Gemini AI + Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}
