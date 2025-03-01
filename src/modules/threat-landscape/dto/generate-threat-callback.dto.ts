import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { jobsTable } from "src/database/schema";
import { CreateThreatLandscapeDto } from "./create-threat-landscape.dto";

export class GenerateThreatCallbackDto{
    @IsInt()
    @IsNotEmpty()
    job_id: number;

    @IsIn(['pending', 'failed', 'done'])
    job_status: typeof jobsTable.$inferSelect.status;
    
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateThreatLandscapeDto)
    threatLandscape?: CreateThreatLandscapeDto[];
}