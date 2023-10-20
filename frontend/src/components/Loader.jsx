import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <motion.div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></motion.div>
    </div>
  );
};

export default Loader;
