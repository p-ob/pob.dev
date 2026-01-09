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
        // Firefox browser testing disabled - only Chromium is used for E2E tests
        // {
        //     name: "firefox",
        //     use: { ...devices["Desktop Firefox"] },
        // },
        // Webkit browser testing disabled - only Chromium is used for E2E tests
        // {
        //     name: "webkit",
        //     use: { ...devices["Desktop Safari"] },
        // },
    ],
    webServer: {
        command: "npm start",
        url: "http://localhost:8080",
        reuseExistingServer: !process.env.CI,
        stdout: "ignore",
        stderr: "pipe",
    },
});
