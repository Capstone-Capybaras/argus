/**
 * Use this to map a DTO to a drizzle inferInsert model.
 * This safely constructs an insert object from the DTO.
 * DTO's are expected to be supersets of inferInsert model,
 * because a REST DTO can contain more fields than an insertion model
 */
export const dtoToInsertModel = <
  InsertModel extends Record<string, any>,
  DTO extends InsertModel,
>(
  dto: DTO,
): InsertModel => {
  const result = {} as InsertModel;
  (Object.keys({} as InsertModel) as (keyof InsertModel)[]).forEach((key) => {
    if (key in dto) {
      result[key] = dto[key];
    }
  });
  return result;
};

export const dtoToUpdateModel = <
  InsertModel extends Record<string, any>,
  DTO extends Partial<InsertModel>,
>(
  dto: DTO,
): Partial<InsertModel> => {
  const result = {} as Partial<InsertModel>;
  (Object.keys({} as InsertModel) as (keyof InsertModel)[]).forEach((key) => {
    if (key in dto) {
      result[key] = dto[key];
    }
  });
  return result;
};
