import fs from 'fs'

/**
 * @remarks
 * File name must include extension, e.g. `log.txt`
 *
 * Note:
 * 1. The log file will be created if it doesn't exist,
 * and appended to if it does exist.
 * 2. Log will be placed in the root directory of the project.
 */
export const logMessageToFile = ({ fileName, message }: { fileName: string; message: string }) => {
    fs.appendFileSync(fileName, message + '\n')
}
