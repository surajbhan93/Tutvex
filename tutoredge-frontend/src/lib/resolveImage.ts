const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const resolveImage = (path?: string): string => {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return "/images/default-avatar.png";
  }

  const trimmed = path.trim();

  // 🔥 1. Base64 data URI (data:image/...) or blob URL -> return directly
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // 🔥 2. Already absolute URL (http:// or https://) -> return directly
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // 🔥 3. Relative server path (e.g. /uploads/image.jpg) -> prepend BACKEND_URL
  const cleanPath = trimmed.replace(/^\/api\/v1/, "");
  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${BACKEND_URL}${formattedPath}`;
};
