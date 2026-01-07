import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { PublicEndpoint } from '../decorators/public-endpoint.decorator';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicEndpoint()
  @Post('register')
  @ApiOperation({ summary: 'Inscrire un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur inscrit avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @PublicEndpoint()
  @Post('verify-email')
  @ApiOperation({ summary: 'Vérifier l\'email avec le token' })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expiré' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @PublicEndpoint()
  @Post('login')
  @ApiOperation({ summary: 'Se connecter avec email et mot de passe (envoie un code 2FA)' })
  @ApiResponse({ status: 200, description: 'Code 2FA envoyé par email' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @PublicEndpoint()
  @Post('verify-2fa')
  @ApiOperation({ summary: 'Vérifier le code 2FA et obtenir le token JWT' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 401, description: 'Code invalide ou expiré' })
  async verify2FA(@Body() verify2faDto: Verify2faDto) {
    return this.authService.verify2FA(verify2faDto);
  }
}
