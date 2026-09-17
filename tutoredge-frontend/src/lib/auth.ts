// export const getToken = () => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token");
// };

// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.location.href = "/parent/login";
// };

export const getToken = () => {
  if (typeof window === "undefined") return null;

  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) return null;

  try {
    const parsed = JSON.parse(authStorage);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("auth-storage");
  window.location.href = "/login";
};
