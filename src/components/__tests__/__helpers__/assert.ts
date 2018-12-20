type ConstructorType<T> = new (...args: any[]) => T;
export function expectInstanceOf<T>(val: any, Constructor: ConstructorType<T>): T {
    expect(val).toBeInstanceOf(Constructor);
    return val as T;
}
