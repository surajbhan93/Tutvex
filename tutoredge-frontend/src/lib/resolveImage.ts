const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const resolveImage = (path?: string) => {
  if (!path) return "/images/default-avatar.png";

  // already absolute
  if (path.startsWith("http")) return path;

  // 🔥 HOTFIX: strip /api/v1 if backend sends wrong path
  const cleanPath = path.replace(/^\/api\/v1/, "");

  return `${BACKEND_URL}${cleanPath}`;
};
