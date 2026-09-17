export default function TypingIndicator() {
  return (
    <div className="mr-auto max-w-[70%] rounded-2xl bg-white/70 backdrop-blur-md px-4 py-3 shadow-md border border-white/40">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-gray-600 animate-bounce [animation-delay:300ms]" />
        <span className="ml-1 text-xs text-gray-500">typing…</span>
      </div>
    </div>
  );
}
