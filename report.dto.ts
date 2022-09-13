import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator"

//how we validate is by first defining this class, and then exporting it
export class CreateReportDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsString()
    @IsNotEmpty()
    source: string; 
}