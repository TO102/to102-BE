import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn({ name: 'location_id' })
  locationId: number;

  @Column()
  province: string; // region_1depth_name에 해당

  @Column()
  city: string; // region_2depth_name에 해당

  @Column()
  district: string; // region_3depth_name에 해당
}
