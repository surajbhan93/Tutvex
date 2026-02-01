// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';

// // import { create } from "domain";

// // // 1. Define the User type (you can expand this later)
// // interface User {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: 'tutor' | 'parent' | 'admin';
// // }

// // // 2. Define the state shape (it should hold the user object and token)
// // interface AuthState {
// //   isLoggedIn: boolean;
// //   user: User | null;
// //   token: string | null;
// // }

// // // 3. Define the actions
// // interface AuthActions {
// //   login: (user: User, token: string) => void; // <-- FIX: Expects user AND token
// //   logout: () => void;
// // }

// // // 4. Create the store
// // export const useAuthStore = create<AuthState & AuthActions>()(
// //   persist(
// //     (set) => ({
// //       // --- INITIAL STATE ---
// //       isLoggedIn: false,
// //       user: null,
// //       token: null,

// //       // --- ACTIONS ---
// //       // 5. Update the login function to save both user and token
// //       login: (user, token) =>
// //         set({
// //           isLoggedIn: true,
// //           user,
// //           token,
// //         }),

// //       logout: () =>
// //         set({
// //           isLoggedIn: false,
// //           user: null,
// //           token: null,
// //         }),
// //     }),
// //     {
// //       name: 'auth-storage',
// //       storage: createJSONStorage(() => localStorage),
// //     },
// //   ),
// // );



import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* =====================
   TYPES
===================== */
interface User {
  id: string;
  name: string;
  email: string;
  role: "tutor" | "parent" | "admin";
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
}

/* =====================
   STORE
===================== */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      login: (user, token) =>
        set({
          isLoggedIn: true,
          user,
          token,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
