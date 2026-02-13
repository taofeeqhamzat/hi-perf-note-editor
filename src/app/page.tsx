import { Editor } from "@/components/Editor/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Treatment Note Editor
          </h1>
          <p className="text-gray-500">
            High-performance, offline-capable clinical documentation
          </p>
        </header>
        <Editor />
      </div>
    </main>
  );
}
