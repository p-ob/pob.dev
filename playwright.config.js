import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:8080",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm start",
        url: "http://localhost:8080",
        reuseExistingServer: !process.env.CI,
        stdout: "ignore",
        stderr: "pipe",
        // e2e specs already tolerate feeds being absent (see tests/e2e/reading.spec.js),
        // so skip the external RSS fetches to avoid gating the whole suite behind them.
        env: { ...process.env, SKIP_FEED_AGGREGATION: "true" },
    },
});
