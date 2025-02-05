import { IsNotEmpty, IsOptional } from "class-validator";

export class InboxDto {
    @IsNotEmpty()
    threadTopic: string;
    @IsNotEmpty()
    date: string;
    @IsOptional()
    take: number;
    @IsOptional()
    skip: number;
}