const RESET = "\x1b[0m";

const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
};

const timestamp = () => new Date().toISOString();

export const logger = {
    info : (msg) => console.log(`${colors.info}[INFO] ${timestamp()} - ${msg}${RESET}`),
    success : (msg) => console.log(`${colors.success}[INFO] ${timestamp()} - ${msg}${RESET}`),
    warn : (msg) => console.log(`${colors.warn}[INFO] ${timestamp()} - ${msg}${RESET}`),
    error : (msg) => console.log(`${colors.error}[INFO] ${timestamp()} - ${msg}${RESET}`),
}