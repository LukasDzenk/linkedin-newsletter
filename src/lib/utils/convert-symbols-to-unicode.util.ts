export const convertSymbolsToUnicode = ({ input }: { input: string }) => {
    return Array.from(input)
        .map((char) => {
            if (char.match(/[^\w\s]/)) {
                return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
            } else {
                return char
            }
        })
        .join('')
}
