import { useState } from "react"

export default function UploadPanel({ onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState("")

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setStatus("Ingesting...")

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: form,
      })
      const data = await res.json()
      setStatus(`✓ ${data.chunks} chunks indexed`)
      onUpload(data)
    } catch {
      setStatus("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
        Upload PDF
      </label>
      <label className="flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors">
        <span className="text-sm text-gray-400">
          {uploading ? "Processing..." : "Click or drop PDF"}
        </span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      {status && (
        <p className="text-xs text-gray-400 mt-2">{status}</p>
      )}
    </div>
  )
}