import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api/v1": {
				target: "http://51.20.65.64:5000",
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
