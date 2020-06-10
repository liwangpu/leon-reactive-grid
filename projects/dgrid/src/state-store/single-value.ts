export class SingleValue<T = any> {
    public constructor(public readonly value: T) { }
    public static from(value: any): SingleValue {
        return new SingleValue(value);
    }
}
