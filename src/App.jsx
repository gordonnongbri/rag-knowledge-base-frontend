import { useState } from "react"
import UploadPanel from "./components/UploadPanel"
import ChatPanel from "./components/ChatPanel"

export default function App() {
  const [uploadedDocs, setUploadedDocs] = useState([])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">
          RAG Knowledge Base
        </h1>
        <p className="text-sm text-gray-400">Upload documents · Ask questions</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-gray-800 p-4 flex flex-col gap-4">
          <UploadPanel onUpload={(doc) => setUploadedDocs(prev => [...prev, doc])} />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              Documents
            </p>
            {uploadedDocs.map((doc, i) => (
              <div key={i} className="text-sm text-gray-300 py-1 truncate">
                📄 {doc.filename}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <ChatPanel />
        </main>
      </div>
    </div>
  )
}