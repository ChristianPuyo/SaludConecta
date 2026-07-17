export const config = {
  app: {
    name: 'Guardian Salud AI',
    version: '2.0.0',
    slug: 'SaludConecta',
  },
  storage: {
    prefix: '@saludconecta/',
  },
  sync: {
    retryAttempts: 3,
    retryDelayMs: 2000,
  },
  analytics: {
    defaultDays: 7,
    predictiveWindowDays: 30,
  },
  security: {
    pinEnabled: false,
    biometricEnabled: false,
    sessionTimeoutMinutes: 30,
  },
  map: {
    defaultLatitude: -8.379,
    defaultLongitude: -74.537,
    defaultZoom: 10,
  },
} as const;
