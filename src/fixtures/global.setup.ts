/**
 * global.setup.ts -- fail-fast environment validation
 *
 * Runs once before any test starts. Throws with a clear, actionable message
 * if required environment variables are missing so the team sees the real
 * problem immediately instead of a 30-second "Invalid email or password" timeout.
 *
 * Add new required vars here whenever a new persona or base URL is introduced.
 */

const REQUIRED_ENV_VARS: Array<{ key: string; description: string }> = [
  { key: 'BASE_URL',         description: 'Application base URL (e.g. https://app.commonground.io)' },
  { key: 'FUNDER_EMAIL',     description: 'Funder persona login email' },
  { key: 'FUNDER_PASSWORD',  description: 'Funder persona login password' },
];

async function globalSetup(): Promise<void> {
  const missing = REQUIRED_ENV_VARS.filter(({ key }) => !process.env[key]);

  if (missing.length === 0) return;

  const lines = missing.map(
    ({ key, description }) => `  ${key.padEnd(22)} -- ${description}`,
  );

  throw new Error(
    `\n\nMissing required environment variables:\n${lines.join('\n')}\n\n` +
    `Add them to the .env file in the project root:\n` +
    missing.map(({ key }) => `  ${key}=<value>`).join('\n') + '\n',
  );
}

export default globalSetup;
