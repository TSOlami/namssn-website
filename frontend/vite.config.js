import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	
	server: {
		port: 3000,
		proxy: {
			"/api/v1": {
				target: "https://api-namssn-futminna.onrender.com/",
				changeOrigin: true,
			},
		},
	},

	// Build optimizations
	build: {
		// Generate source maps for debugging (disable in production for smaller bundles)
		sourcemap: false,
		
		// Minification settings
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.log in production
				drop_debugger: true,
			},
		},
		
		// Chunk splitting strategy
		rollupOptions: {
			output: {
				// Manual chunk splitting for optimal caching
				manualChunks: {
					// Vendor chunks - cached separately
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
				
				// Cleaner chunk file names
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
		
		// Chunk size warning limit (in KB)
		chunkSizeWarningLimit: 500,
	},

	// Optimize dependencies
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

	// Test configuration
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: "tests/setup.js",
	},
});
