export function replaceSymbols(text: string): string {
    let newStr = text.replace(/\*\*/g, '')
    // Replace single asterisks that are adjacent to words
    newStr = newStr.replace(/(\w)\*(\w)?|(\w)?\*(\w)/g, '$1$2$3$4')

    // – to -
    newStr = newStr.replace(/\u2013/g, '-')
    // — to -
    newStr = newStr.replace(/\u2014/g, '-')
    // — to -
    newStr = newStr.replace(/\u2012/g, '-')

    // Replace all types of quotes with standard double quote
    newStr = newStr.replace(
        /[\u201c\u201d\u2018\u2019\u201b\u201f\u275b\u275c\u275d\u275e\u201e\u201a\u201f\u2039\u203a\u00ab\u00bb]/g,
        '"',
    )

    return newStr
}
