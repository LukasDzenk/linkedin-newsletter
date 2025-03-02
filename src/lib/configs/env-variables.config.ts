import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'

let envFileName

if (process.env.NODE_ENV === 'production') {
    envFileName = '.env.production'
} else if (process.env.NODE_ENV === 'staging') {
    envFileName = '.env.staging'
} else if (process.env.NODE_ENV === 'test') {
    envFileName = '.env.test'
} else if (process.env.NODE_ENV === 'development') {
    envFileName = '.env.development'
} else if (process.env.NODE_ENV === 'build') {
    envFileName = '.env.development'
} else {
    throw new Error(
        `Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: production, staging, test, development`,
    )
}

const fullEnvFilePath = path.resolve(process.cwd(), envFileName)

// Check if envFileName exists in the root directory
if (fs.existsSync(fullEnvFilePath)) {
    dotenv.config({ path: fullEnvFilePath })
} else {
    // If not, use the default .env file
    dotenv.config()
}

const envVariablesSchema = z.object({
    // Note: specify NODE_ENV in start script in package.json, it determines which .env file to use
    NODE_ENV: z.enum(['production', 'development']),
    APP_ENV: z.enum(['production', 'staging', 'test', 'development', 'build']),
    SHUTDOWN_GRACE_PERIOD_IN_SECONDS: z.coerce.number().int().positive().min(1).max(3600), // max 1 hour

    PORT: z.coerce.number().int().positive().min(1).max(65535),
    SERVER_INSTANCE_ID: z.string().min(1),

    CORS_ORIGIN_WHITELIST: z.string().default(''), // comma separated list of allowed origins
    API_KEYS: z.string(), // comma separated list of API keys

    // LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),
    // REQ_AND_RES_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']),

    // MONGO_DB_1_URL: z.string().url().min(1),

    SLACK_TOKEN: z.string().min(1),
    RAPID_API_KEY: z.string().min(1),

    // RESEND_API_KEY: z.string().min(1),

    // REDIS_URL: z.string().url(),

    // VENDOR_GRAFANA_HOST: z.string().min(1),
    // VENDOR_GRAFANA_USER: z.string().min(1),
    // VENDOR_GRAFANA_API_TOKEN: z.string().min(1),

    // ARE_CRON_JOBS_ENABLED: z.enum(['true', 'false']).transform((value) => {
    //     if (value === 'true') {
    //         return true
    //     }
    //     return false
    // }),

    // DIRECTUS_URL: z.string().min(1),
    // DIRECTUS_TOKEN: z.string().min(1),

    // POCKETBASE_URL: z.string().min(1),
})

const parseCommaSeparatedList = (value: string | undefined): string[] => {
    if (!value) {
        return []
    }
    return value.split(',').filter((item) => {
        return item.trim() !== ''
    })
}

type EnvVariables = z.infer<typeof envVariablesSchema>
// In case of build environment, skip validation, because the server-side env variables are not available
// NOTE: error will be not be thrown on server start.
const validatedEnvVariables =
    process.env.NODE_ENV === 'build' ? ({} as EnvVariables) : envVariablesSchema.parse(process.env)

export const env = {
    system: {
        NODE_ENV: validatedEnvVariables.NODE_ENV,
        APP_ENV: validatedEnvVariables.APP_ENV,
        SHUTDOWN_GRACE_PERIOD_IN_SECONDS: 30,
    },
    server: {
        PORT: validatedEnvVariables.PORT,
        INSTANCE_ID: validatedEnvVariables.SERVER_INSTANCE_ID,
        CORS_ORIGIN_WHITELIST: parseCommaSeparatedList(validatedEnvVariables.CORS_ORIGIN_WHITELIST),
        API_KEYS: parseCommaSeparatedList(validatedEnvVariables.API_KEYS),
    },
    // logs: {
    //     LOG_LEVEL: validatedEnvVariables.LOG_LEVEL,
    //     REQ_AND_RES_LOG_LEVEL: validatedEnvVariables.REQ_AND_RES_LOG_LEVEL,
    // },
    // databases: {
    //     mongoDb1: {
    //         URL: validatedEnvVariables.MONGO_DB_1_URL,
    //     },
    //     // redis: {
    //     //     REDIS_URL: parsedEnvVariables.REDIS_URL,
    //     // },
    // },
    app: {
        // 	PUBLIC_DOMAIN_NAME: validatedEnvVariables.PUBLIC_APP_DOMAIN_NAME
        // },
        vendors: {
            // 	plausible: {
            // 		URL: validatedEnvVariables.PUBLIC_PLAUSIBLE_URL
            // 	},
            // directus: {
            //     URL: validatedEnvVariables.DIRECTUS_URL,
            //     TOKEN: validatedEnvVariables.DIRECTUS_TOKEN,
            // },
            slack: {
                TOKEN: validatedEnvVariables.SLACK_TOKEN,
            },
            rapidApi: {
                API_KEY: validatedEnvVariables.RAPID_API_KEY,
            },
            // resend: {
            //   API_KEY: validatedEnvVariables.RESEND_API_KEY,
            // },
            // pocketbase: {
            //   URL: validatedEnvVariables.POCKETBASE_URL,
            // },
            // grafana: {
            //     HOST: envVariables.VENDOR_GRAFANA_HOST,
            //     USER: envVariables.VENDOR_GRAFANA_USER,
            //     API_TOKEN: envVariables.VENDOR_GRAFANA_API_TOKEN,
        },
    },
    // // cronJobs: {
    // //     ARE_CRON_JOBS_ENABLED: parsedEnvVariables.ARE_CRON_JOBS_ENABLED,
    // // },
}
