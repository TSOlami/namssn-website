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
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: "tests/setup.js",
	},
});
