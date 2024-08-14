import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  neighborhood: string;
}
