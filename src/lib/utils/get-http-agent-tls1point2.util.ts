import https from 'https'

// NodeJS uses TLSv1.3 when Postman uses TLSv1.2. This causes a 403 error by Expedia and perhaps other providers.
export const getHttpAgentTls1Point2 = () => {
    return new https.Agent({
        maxVersion: 'TLSv1.2',
        minVersion: 'TLSv1.2',
    })
}
