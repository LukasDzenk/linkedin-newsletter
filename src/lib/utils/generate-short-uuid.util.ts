export const generateShortUuid = () => {
    return crypto.randomUUID().slice(0, 8)
}
