import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';
import { WatchedMovie } from './watched-movie.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: NestjsTpRole,
    default: NestjsTpRole.USER,
  })
  role: NestjsTpRole;

  @Column({ nullable: true, type: 'datetime' })
  emailValidatedAt: Date;

  @Column({ nullable: true })
  emailToken: string;

  @Column({ nullable: true, type: 'datetime' })
  emailTokenExpiresAt: Date;

  @OneToMany(() => WatchedMovie, (movie) => movie.user)
  watchedMovies: WatchedMovie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
