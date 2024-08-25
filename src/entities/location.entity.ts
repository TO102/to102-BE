import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Location {
  @ApiProperty({ description: '위치 고유 식별자' })
  @PrimaryGeneratedColumn({ name: 'location_id' })
  locationId: number;

  @ApiProperty({ description: '도/시' })
  @Column()
  province: string; // region_1depth_name에 해당

  @ApiProperty({ description: '시/군/구' })
  @Column()
  city: string; // region_2depth_name에 해당

  @ApiProperty({ description: '동/읍/면' })
  @Column()
  district: string; // region_3depth_name에 해당
}
