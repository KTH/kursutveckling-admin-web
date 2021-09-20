/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const {
  getEnv,
  devDefaults,
  unpackKOPPSConfig,
  unpackRedisConfig,
  unpackNodeApiConfig,
} = require('kth-node-configuration')
const { typeConversion } = require('kth-node-configuration/lib/utils')
const { safeGet } = require('safe-utils')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000)
const devSsl = devDefaults(false)
const devUrl = devDefaults('http://localhost:' + devPort)
const devKursutvecklingApi = devDefaults('http://localhost:3001/api/kursutveckling?defaultTimeout=10000') // 'http://localhost:3001/api/kursutveckling?defaultTimeout=10000')
const devKursstatistikApi = devDefaults('http://localhost:3001/api/kursstatistik?defaultTimeout=90000')
const devKursPmDataApi = devDefaults('http://localhost:3002/api/kurs-pm-data?defaultTimeout=10000')
const devKoppsApi = devDefaults('https://api-r.referens.sys.kth.se/api/kopps/v2/')
const devSessionKey = devDefaults('node-web.sid') // TODO ??
const devSessionUseRedis = devDefaults(true)
const devRedis = devDefaults('redis://localhost:6379/')
const devRedisUG = devDefaults(
  'team-studam-ref-redis-193.redis.cache.windows.net:6380,password=12121212ksldjai,ssl=True,abortConnect=False'
)
const devStorageContainerName = devDefaults('kursutveckling-blob-container')
// END DEFAULT SETTINGS

const devOidcIssuerURL = devDefaults('https://login.ref.ug.kth.se/adfs')
const devOidcConfigurationURL = devDefaults(`${devOidcIssuerURL}/.well-known/openid-configuration`)
const devOidcTokenSecret = devDefaults('tokenSecretString')
const prefixPath = devDefaults('/kursinfoadmin/kursutveckling')
const devOidcCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/login/callback`)
const devOidcCallbackSilentURL = devDefaults(`http://localhost:3000${prefixPath}/auth/silent/callback`)
const devOidcLogoutCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/logout/callback`)

module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: safeGet(() => getEnv('SERVER_SSL', devSsl + '').toLowerCase() === 'true'),
  port: getEnv('SERVER_PORT', devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', ''),
  },

  // API keys
  apiKey: {
    kursutvecklingApi: getEnv('API_KEY', devDefaults('9876')),
    kursPmDataApi: getEnv('KURS_PM_DATA_API_KEY', devDefaults('9876')),
    kursstatistikApi: getEnv('KURSSTATISTIK_API_KEY', devDefaults('1234')),
  },

  // Authentication
  auth: {
    superuserGroup: 'app.kursinfo.kursinfo-admins',
  },
  oidc: {
    configurationUrl: getEnv('OIDC_CONFIGURATION_URL', devDefaults(devOidcConfigurationURL)),
    clientId: getEnv('OIDC_APPLICATION_ID', null),
    clientSecret: getEnv('OIDC_CLIENT_SECRET', null),
    tokenSecret: getEnv('OIDC_TOKEN_SECRET', devDefaults(devOidcTokenSecret)),
    callbackLoginUrl: getEnv('OIDC_CALLBACK_URL', devDefaults(devOidcCallbackURL)),
    callbackSilentLoginUrl: getEnv('OIDC_CALLBACK_SILENT_URL', devDefaults(devOidcCallbackSilentURL)),
    callbackLogoutUrl: getEnv('OIDC_CALLBACK_LOGOUT_URL', devDefaults(devOidcLogoutCallbackURL)),
  },

  // Service API's
  nodeApi: {
    kursutvecklingApi: unpackNodeApiConfig('KURSUTVECKLING_API_URI', devKursutvecklingApi),
    kursPmDataApi: unpackNodeApiConfig('KURS_PM_DATA_API_URI', devKursPmDataApi),
    kursstatistikApi: unpackNodeApiConfig('KURSSTATISTIK_API_URI', devKursstatistikApi),
  },

  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://www-r.referens.sys.kth.se/cm/')), // Block API base URL
  },

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug'),
    },
    accessLog: {
      useAccessLog: getEnv('LOGGING_ACCESS_LOG', true),
    },
  },
  clientLogging: {
    level: 'debug',
  },
  cache: {
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
    },
    ugRedis: {
      redis: unpackRedisConfig('UG_REDIS_URI', devRedisUG),
    },
  },

  // Session
  sessionSecret: getEnv('SESSION_SECRET', devDefaults('1234567890')),
  session: {
    key: getEnv('SESSION_KEY', devSessionKey),
    useRedis: safeGet(() => getEnv('SESSION_USE_REDIS', devSessionUseRedis) === 'true'),
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: String(getEnv('SESSION_SECURE_COOKIE', false)).toLowerCase() === 'true',
        path: getEnv('SERVICE_PUBLISH', '/kursinfoadmin/kursutveckling'),
        sameSite: getEnv('SESSION_SAME_SITE_COOKIE', 'Lax'),
      },
      proxy: safeGet(() => getEnv('SESSION_TRUST_PROXY', true) === 'true'),
    },
    redisOptions: unpackRedisConfig('REDIS_URI', devRedis),
  },

  koppsApi: unpackKOPPSConfig('KOPPS_URI', devKoppsApi),

  appInsights: {
    instrumentationKey: getEnv('APPINSIGHTS_INSTRUMENTATIONKEY'),
  },

  fileStorage: {
    kursutvecklingStorage: {
      containerName: getEnv('STORAGE_CONTAINER_NAME', devStorageContainerName),
      blobServiceSasUrl: getEnv('BLOB_SERVICE_SAS_URL', ''),
    },
  },
}
