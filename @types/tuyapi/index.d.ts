declare module 'tuyapi' {
  export default class {
    connect(): void
    constructor({ id, key, persistentConnection, version }: { id: string, key: string, persistentConnection: boolean, version: string })
    find: { (): Promise<void> }
    on(event: "connected", callback: { (): void }): void
    on(event: "disconnected", callback: { (): void }): void
    on(event: "error", callback: { (error: string): void }): void
    on(event: "data", callback: { (data: { dps?: { 1?: boolean } }): void }): void
  }
}