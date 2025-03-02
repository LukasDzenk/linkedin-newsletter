import { configs } from '@configs/configs.js'
import { logger } from '@logger/pino.logger.js'

export const sendMessage = async ({
    channel = configs.vendors.slack.config.workspaces.ld_test_workspace.channelIds
        .STATIC_HOTEL_DATA_GENERAL_ALERTS_PROD_1,
    message,
    mentionUserIds = [configs.vendors.slack.config.workspaces.ld_test_workspace.userIds.LUKAS],
}: {
    channel?: string
    message: string
    mentionUserIds?: string[]
}) => {
    try {
        // Create mentions string
        const mentions = mentionUserIds
            .map((userId) => {
                return `<@${userId}>`
            })
            .join(' ')

        // Use the chat.postMessage method to send a message
        const result = await configs.vendors.slack.client.chat.postMessage({
            channel: channel,
            text: mentionUserIds.length > 0 ? `${mentions}\n${message}` : message,
        })

        logger.debug(`Slack message result: ${result.ok}`)
    } catch (error) {
        logger.error(error)
    }
}
