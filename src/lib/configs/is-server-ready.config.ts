let serverReady = false

export function isServerReady(): boolean {
    return serverReady
}

export function setServerReady(ready: boolean): void {
    serverReady = ready
}
