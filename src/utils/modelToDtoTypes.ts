export type InferInsert<T> = T extends { $inferInsert: infer U } ? U : never;
export type InferUpdate<T> = Partial<InferInsert<T>>;
