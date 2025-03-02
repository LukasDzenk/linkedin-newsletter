import { env } from '@configs/env-variables.config.js'
import { WebClient } from '@slack/web-api'

const client = new WebClient(env.app.vendors.slack.TOKEN)

const config = {
    workspaces: {
        ld_test_workspace: {
            channelIds: {
                STATIC_HOTEL_DATA_GENERAL_ALERTS_PROD_1: 'C065X4RHRB9',
            },
            userIds: {
                LUKAS: 'U02MWJB4CES',
            },
        },
    },
}

export const slack = {
    config,
    client,
}
