export type FindRecordTypeWithProperty<T, K extends PropertyKey> = T extends unknown
    ? K extends keyof T
        ? T
        : never
    : never
