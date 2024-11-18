// We need to use these utility types so that DTO concrete classes can implement these interfaces
export type InferInsert<T> = T extends { $inferInsert: infer U } ? U : never;
export type InferUpdate<T> = Partial<InferInsert<T>>;
export type InferSelect<T> = T extends { $inferSelect: infer U } ? U : never;
