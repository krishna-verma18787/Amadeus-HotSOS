/**
 * Single source of truth for all environment configurations.
 *
 * The active environment is selected at build time via the APP_ENV
 * define injected by angular.json:
 *
 *   ng serve                          → 'development'
 *   ng build --configuration=qa       → 'qa'
 *   ng build --configuration=production → 'production'
 *
 * Usage anywhere in the app:
 *   import { env } from '../environments/environment';
 *   console.log(env.apiBaseUrl);
 */

export type EnvName = 'development' | 'qa' | 'production';

export interface AppEnvironment {
  name: EnvName;
  production: boolean;
  apiBaseUrl: string;
  appName: string;
  mockAuth: boolean;   // true → use local JSON; false → hit real API
}

// Use a plain index type so the build-time APP_ENV string literal
// does not cause TypeScript to narrow away the other env keys.
const environments: { [key: string]: AppEnvironment } = {
  development: {
    name: 'development',
    production: false,
    apiBaseUrl: 'http://localhost:4200',
    appName: 'HotSOS Mobile (Dev)',
    mockAuth: true,
  },
  qa: {
    name: 'qa',
    production: false,
    apiBaseUrl: 'https://qa-api.hotsos.example.com',
    appName: 'HotSOS Mobile (QA)',
    mockAuth: true,
  },
  production: {
    name: 'production',
    production: true,
    apiBaseUrl: 'https://api.hotsos.example.com',
    appName: 'HotSOS Mobile',
    mockAuth: false,
  },
};

/**
 * Reads the APP_ENV global defined by the angular.json `define` option.
 * Falls back to 'development' when running `ng serve` without a flag.
 */
function resolveEnvName(): EnvName {
  const defined =
    typeof (globalThis as Record<string, unknown>)['APP_ENV'] === 'string'
      ? ((globalThis as Record<string, unknown>)['APP_ENV'] as string)
      : 'development';

  return (defined in environments ? defined : 'development') as EnvName;
}

export const env: AppEnvironment = environments[resolveEnvName()];
