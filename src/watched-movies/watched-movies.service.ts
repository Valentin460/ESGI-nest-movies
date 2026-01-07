import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchedMovie } from '../entities/watched-movie.entity';
import { CreateWatchedMovieDto } from './dto/create-watched-movie.dto';
import { UpdateWatchedMovieDto } from './dto/update-watched-movie.dto';
import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';

@Injectable()
export class WatchedMoviesService {
  constructor(
    @InjectRepository(WatchedMovie)
    private watchedMovieRepository: Repository<WatchedMovie>,
  ) {}

  async create(userId: number, createWatchedMovieDto: CreateWatchedMovieDto) {
    const movie = this.watchedMovieRepository.create({
      ...createWatchedMovieDto,
      userId,
    });

    return await this.watchedMovieRepository.save(movie);
  }

  async findAllForUser(userId: number) {
    return await this.watchedMovieRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForAdmin() {
    return await this.watchedMovieRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number, userRole: NestjsTpRole) {
    const movie = await this.watchedMovieRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId && userRole !== NestjsTpRole.ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas la permission de voir ce film');
    }

    return movie;
  }

  async update(id: number, userId: number, userRole: NestjsTpRole, updateWatchedMovieDto: UpdateWatchedMovieDto) {
    const movie = await this.watchedMovieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId && userRole !== NestjsTpRole.ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas la permission de modifier ce film');
    }

    Object.assign(movie, updateWatchedMovieDto);
    return await this.watchedMovieRepository.save(movie);
  }

  async remove(id: number, userId: number, userRole: NestjsTpRole) {
    const movie = await this.watchedMovieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId && userRole !== NestjsTpRole.ADMIN) {
      throw new ForbiddenException('Vous n\'avez pas la permission de supprimer ce film');
    }

    await this.watchedMovieRepository.remove(movie);
    return { message: 'Film supprimé avec succès' };
  }
}
