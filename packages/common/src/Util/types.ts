export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

/**
 * Removes last tuple element
 */
export type Head<T extends any[]> = T extends [...infer Head, any] ? Head : any[];

export type DropLastParam<F extends (...args: any) => any> = Head<Parameters<F>>;

export type FilterNotStartsWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set;
export type FilterStartsWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never;
export type StripPrefix<T extends string, prefix extends string> = T extends `${prefix}${infer Prefix}` ? Prefix : never;

export type ExtractIterableType<T extends Iterable<any>> = T extends Iterable<infer U> ? U : T;
