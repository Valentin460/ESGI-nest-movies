import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { WatchedMoviesModule } from './watched-movies/watched-movies.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { WatchedMovie } from './entities/watched-movie.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, WatchedMovie],
      synchronize: true,
    }),
    AuthModule,
    WatchedMoviesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
