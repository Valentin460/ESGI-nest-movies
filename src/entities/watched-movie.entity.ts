import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('watched_movies')
export class WatchedMovie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  director: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.watchedMovies)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
