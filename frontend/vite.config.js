/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getApiTarget(mode) {
	const rootDir = path.resolve(__dirname, "..");
	const env = loadEnv(mode, rootDir, "");
	const raw = env.VITE_REACT_APP_API_URL || process.env.VITE_REACT_APP_API_URL;
	const base = typeof raw === "string" && raw ? (raw.endsWith("/") ? raw.slice(0, -1) : raw) : "";
	if (base) return base;
	return mode === "development" ? "http://localhost:5000" : "https://api-namssn-futminna.onrender.com";
}

export default defineConfig(({ mode }) => {
	const API_TARGET = getApiTarget(mode);
	return {
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api/v1": {
				target: API_TARGET,
				changeOrigin: true,
			},
		},
	},
	build: {
		sourcemap: false,
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom', 'react-router-dom'],
					'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
					'vendor-ui': ['framer-motion', 'react-icons', 'react-toastify'],
					'vendor-forms': ['formik', 'yup'],
					
					// Feature-based chunks
					'pages-public': [
						'./src/pages/Landing',
						'./src/pages/Signin',
						'./src/pages/Signup',
						'./src/pages/AboutUsPage',
						'./src/pages/EventsPage',
						'./src/pages/BlogPage',
					],
					'pages-admin': [
						'./src/pages/AdminDashboard',
						'./src/pages/AdminPayment',
						'./src/pages/AdminEvents',
						'./src/pages/AdminAnnouncement',
						'./src/pages/AdminBlogs',
						'./src/pages/VerifyUsers',
					],
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
		chunkSizeWarningLimit: 500,
	},
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'react-router-dom',
			'@reduxjs/toolkit',
			'react-redux',
			'framer-motion',
		],
	},
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: "tests/setup.js",
	},
	};
});
