import { callFunctionAtRandomIntervals } from './call-function-at-random-intervals.util.js'
import { callFunctionEveryXSeconds } from './call-function-every-x-seconds.util.js'
import { cleanRegularString } from './clean-regular-string.util.js'
import { convertSymbolsToUnicode } from './convert-symbols-to-unicode.util.js'
import { exitManager } from './exit-manager.util.js'
import { exitProcess } from './exit-process.util.js'
import { generateRandomAlphanumericLowerCaseString } from './generate-random-alphanumeric-lower-case-string.util.js'
import { generateRandomAlphanumericMixedCaseString } from './generate-random-alphanumeric-mixed-case-string.util.js'
import { generateRandomStringByPattern } from './generate-random-string-by-pattern.util.js'
import { generateRandomString } from './generate-random-string.util.js'
import { generateShortUuid } from './generate-short-uuid.util.js'
import { getCurrentDirectoryPath } from './get-current-directory-path.util.js'
import { getHttpAgentTls1Point2 } from './get-http-agent-tls1point2.util.js'
import { getRandomIntFromRange } from './get-random-int-from-range.util.js'
import { getRandomPlatformHeaderOs } from './get-random-platform-header-os.util.js'
import { increaseIndexSensitivity } from './increase-index-sensitivity.util.js'
import { invertIndex } from './invert-index.util.js'
import { isDateOlderThanXDays } from './is-date-older-than-x-days.util.js'
import { keepOnlyWordsAndSpacesFromString } from './keep-only-words-and-spaces-from-string.util.js'
import { logMessageToFile } from './log-message-to-file.util.js'
import { mapToIndex } from './map-to-index.util.js'
import { millisecondsToSeconds } from './milliseconds-to-seconds.util.js'
import { mongodb } from './mongodb/mongodb.js'
import { pickRandomCharacter } from './pick-random-character.util.js'
import { removeUndefinedKeys } from './remove-undefined-keys.util.js'
import { removeWordInstancesFromString } from './remove-word-instances-from-string.util.js'
import { removeWordsFromString } from './remove-words-from-string.util.js'
import { replaceMultipleWhiteSpacesWithSingle } from './replace-multiple-white-spaces-with-single.util.js'
import { roundFloat } from './round-float.util.js'
import { selectRandomIndex } from './select-random-index.util.js'
import { serializeError } from './serialize-error.util.js'
import { sleep } from './sleep.util.js'
import { wrappers } from './wrappers/wrappers.js'
import { zod } from './zod/zod.js'

export const utils = {
    wrappers,
    mongodb,
    zod,

    generateShortUuid,
    exitManager,
    exitProcess,
    serializeError,
    convertSymbolsToUnicode,
    logMessageToFile,
    mapToIndex,
    getHttpAgentTls1Point2,
    callFunctionAtRandomIntervals,
    callFunctionEveryXSeconds,
    cleanRegularString,
    generateRandomAlphanumericLowerCaseString,
    generateRandomAlphanumericMixedCaseString,
    generateRandomString,
    generateRandomStringByPattern,
    getRandomIntFromRange,
    getCurrentDirectoryPath,
    getRandomPlatformHeaderOs,
    increaseIndexSensitivity,
    invertIndex,
    isDateOlderThanXDays,
    keepOnlyWordsAndSpacesFromString,
    millisecondsToSeconds,
    pickRandomCharacter,
    removeUndefinedKeys,
    removeWordInstancesFromString,
    removeWordsFromString,
    replaceMultipleWhiteSpacesWithSingle,
    roundFloat,
    selectRandomIndex,
    sleep,
} as const
