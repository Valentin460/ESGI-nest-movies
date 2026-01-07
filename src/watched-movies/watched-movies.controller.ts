import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WatchedMoviesService } from './watched-movies.service';
import { CreateWatchedMovieDto } from './dto/create-watched-movie.dto';
import { UpdateWatchedMovieDto } from './dto/update-watched-movie.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';

@ApiTags('Films Regardés')
@ApiBearerAuth()
@Controller('watched-movies')
@UseGuards(RolesGuard)
export class WatchedMoviesController {
  constructor(private readonly watchedMoviesService: WatchedMoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un film à votre watchlist' })
  @ApiResponse({ status: 201, description: 'Film ajouté avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async create(
    @CurrentUser() user: any,
    @Body() createWatchedMovieDto: CreateWatchedMovieDto,
  ) {
    return this.watchedMoviesService.create(user.id, createWatchedMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir votre liste de films regardés' })
  @ApiResponse({ status: 200, description: 'Films récupérés avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async findAll(@CurrentUser() user: any) {
    return this.watchedMoviesService.findAllForUser(user.id);
  }

  @Get('admin/all')
  @Roles(NestjsTpRole.ADMIN)
  @ApiOperation({ summary: 'Obtenir tous les films regardés de tous les utilisateurs (Admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Tous les films récupérés avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Interdit - Accès admin requis' })
  async findAllForAdmin() {
    return this.watchedMoviesService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un film spécifique de votre watchlist' })
  @ApiResponse({ status: 200, description: 'Film récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Interdit' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.watchedMoviesService.findOne(+id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un film dans votre watchlist' })
  @ApiResponse({ status: 200, description: 'Film modifié avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Interdit' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateWatchedMovieDto: UpdateWatchedMovieDto,
  ) {
    return this.watchedMoviesService.update(+id, user.id, user.role, updateWatchedMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un film de votre watchlist' })
  @ApiResponse({ status: 200, description: 'Film supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 403, description: 'Interdit' })
  @ApiResponse({ status: 404, description: 'Film non trouvé' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.watchedMoviesService.remove(+id, user.id, user.role);
  }
}
