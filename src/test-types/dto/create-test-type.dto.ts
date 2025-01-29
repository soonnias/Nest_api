import { ApiProperty } from '@nestjs/swagger';

export class CreateTestTypeDto {
    @ApiProperty({ description: 'Назва типу тесту' })
    readonly name: string;
}
