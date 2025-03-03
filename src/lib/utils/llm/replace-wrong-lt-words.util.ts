export function replaceWrongLtWords(text: string): string {
    let newStr = text.replace(/Kelionės mėgėjai/g, 'Keliautojai')
    newStr = newStr.replace(/kelionės mėgėjai/g, 'keliautojai')
    newStr = newStr.replace(/Kelionės mėgėjams/g, 'Keliautojams')
    newStr = newStr.replace(/kelionės mėgėjams/g, 'keliautojams')
    newStr = newStr.replace(/Kelionės mėgėjų/g, 'Keliautojų')
    newStr = newStr.replace(/kelionės mėgėjų/g, 'keliautojų')

    return newStr
}
