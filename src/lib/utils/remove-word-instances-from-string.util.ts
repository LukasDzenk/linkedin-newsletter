import { utils } from './utils.js'

export const removeWordInstancesFromString = (mainString: string, removeString: string): string => {
    if (!removeString) {
        return mainString
    }

    // Note that regex string is built from client string
    const regex = new RegExp(`\\b${removeString}\\b`, 'g')
    mainString = mainString.replace(regex, '')
    mainString = utils.replaceMultipleWhiteSpacesWithSingle(mainString)
    mainString = mainString.trim()

    return mainString
}
