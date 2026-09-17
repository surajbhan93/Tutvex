import { motion } from "framer-motion";

const LoginHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl
                 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600
                 px-6 py-10 md:px-12 md:py-14 text-white shadow-xl"
    >
      {/* Decorative Blurs */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-3xl" />

      {/* CENTERED CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1
          className="text-2xl md:text-4xl font-extrabold mb-3
                     bg-gradient-to-r from-yellow-200 via-white to-cyan-200
                     bg-clip-text text-transparent"
        >
          Welcome Back 👋
        </h1>

        <p className="text-sm md:text-base text-indigo-100 max-w-2xl">
          Login to your Tutvex account and continue your personalized learning
          journey with trusted tutors.
        </p>
      </div>
    </motion.div>



  );
};

export default LoginHeader;
