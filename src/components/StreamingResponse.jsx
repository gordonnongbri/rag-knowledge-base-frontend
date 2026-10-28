export default function StreamingResponse({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-indigo-900/40 border border-indigo-800 rounded-lg px-4 py-2 max-w-xl text-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 max-w-2xl">
      <div className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
        {message.content}
        {message.streaming && (
          <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
        )}
      </div>

      {message.sources?.length > 0 && (
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-300">
            {message.sources.length} source chunks retrieved
          </summary>
          <div className="mt-2 space-y-2">
            {message.sources.map((src, i) => (
              <div key={i} className="border border-gray-800 rounded p-2">
                <span className="text-gray-600">
                  Similarity: {(src.similarity * 100).toFixed(1)}%
                </span>
                <p className="mt-1 text-gray-400 line-clamp-3">{src.content}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}