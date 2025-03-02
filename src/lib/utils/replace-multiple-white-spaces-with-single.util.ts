export const replaceMultipleWhiteSpacesWithSingle = (string: string): string => {
    const cleanedString = string.replace(/\s{2,}/g, ' ')

    return cleanedString
}
