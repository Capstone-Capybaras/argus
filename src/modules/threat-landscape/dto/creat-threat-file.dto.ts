import { entitiesTable, threatFilesTable } from "src/database/schema";
import { InferInsert } from "src/utils/modelToDtoTypes";

export class ThreatFilesDto implements InferInsert<typeof threatFilesTable>{
    entity_id: number;
    file_key: string;
    date_uploaded: Date;
}