import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';

@Entity('user_location')
export class UserLocation {
  @PrimaryGeneratedColumn({ name: 'user_location_id' })
  userLocationId: number;

  @ManyToOne(() => User, (user) => user.userLocations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ name: 'is_verified' })
  isVerified: boolean;

  @Column({ name: 'verified_at' })
  verifiedAt: Date;
}
