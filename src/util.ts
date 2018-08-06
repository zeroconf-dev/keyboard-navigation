// tslint:disable-next-line:variable-name
export function assertNever(_obj: never, msg: string): never {
    throw new Error(msg);
}
