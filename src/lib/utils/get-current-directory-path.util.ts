import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * Returns directory path OR file path if fileNameWithExtension is given.
 * @example importMetaUrl: import.meta.url
 * @example fileNameWithExtension: 'output_hotelston_hotels.json'
 */
export const getCurrentDirectoryPath = ({
    importMetaUrl,
    fileNameWithExtension,
}: {
    importMetaUrl: string
    fileNameWithExtension?: string
}) => {
    const __filename = fileURLToPath(importMetaUrl)
    const __dirname = dirname(__filename)

    if (fileNameWithExtension) {
        const resolvedFilePath = path.resolve(__dirname, fileNameWithExtension)

        return resolvedFilePath
    }

    return __dirname
}
