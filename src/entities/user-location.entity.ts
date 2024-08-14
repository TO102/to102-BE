import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';

@Entity()
export class UserLocation {
  @PrimaryGeneratedColumn()
  user_location_id: number;

  @ManyToOne(() => User, (user) => user.userLocations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column()
  is_verified: boolean;

  @Column()
  verified_at: Date;
}
