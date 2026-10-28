import { useState, useRef, useEffect } from "react"
import StreamingResponse from "./StreamingResponse"

export default function ChatPanel() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendQuery() {
    if (!input.trim() || streaming) return
 
    const question = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: question }])
    setStreaming(true)

    // Add a placeholder assistant message
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "", sources: [], streaming: true }
    ])

    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split("\n")
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const raw = line.slice(6)
          if (raw === "[DONE]") break

          const event = JSON.parse(raw)

          if (event.type === "sources") {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].sources = event.chunks
              return updated
            })
          } else if (event.type === "token") {
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1].content += event.text
              return updated
            })
          }
        }
      }
    } finally {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].streaming = false
        return updated
      })
      setStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-12">
            Upload a document, then ask anything about it.
          </p>
        )}
        {messages.map((msg, i) => (
          <StreamingResponse key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 p-4 flex gap-3">
        <input
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
          placeholder="Ask a question about your documents..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendQuery()}
        />
        <button
          onClick={sendQuery}
          disabled={streaming || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Ask
        </button>
      </div>
    </div>
  )
}