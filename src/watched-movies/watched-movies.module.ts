import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchedMoviesController } from './watched-movies.controller';
import { WatchedMoviesService } from './watched-movies.service';
import { WatchedMovie } from '../entities/watched-movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WatchedMovie])],
  controllers: [WatchedMoviesController],
  providers: [WatchedMoviesService],
})
export class WatchedMoviesModule {}
