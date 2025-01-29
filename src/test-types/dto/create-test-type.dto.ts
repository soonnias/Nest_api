import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestTypeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Назва типу тесту' })
    readonly name: string;
}
