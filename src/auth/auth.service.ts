import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { EmailService } from '../services/email.service';
import { NestjsTpRole } from '../enums/nestjs-tp-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const emailToken = this.generateToken();

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: NestjsTpRole.USER,
      emailToken,
      emailTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.userRepository.save(user);
    await this.emailService.sendEmailValidation(user.email, emailToken);

    return {
      message: 'Utilisateur inscrit avec succès. Veuillez vérifier votre email pour valider votre compte.',
      email: user.email,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userRepository.findOne({
      where: { emailToken: verifyEmailDto.emailToken },
    });

    if (!user) {
      throw new BadRequestException('Token de vérification invalide');
    }

    if (user.emailTokenExpiresAt < new Date()) {
      throw new BadRequestException('Le token de vérification a expiré');
    }

    user.emailValidatedAt = new Date();
    user.emailToken = null;
    user.emailTokenExpiresAt = null;
    await this.userRepository.save(user);

    return {
      message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.emailValidatedAt) {
      throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter');
    }

    const emailToken = this.generate2FACode();
    user.emailToken = emailToken;
    user.emailTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepository.save(user);

    await this.emailService.send2FACode(user.email, emailToken);

    return {
      message: 'Un code de vérification a été envoyé à votre email. Veuillez le vérifier pour terminer la connexion.',
      email: user.email,
    };
  }

  async verify2FA(verify2faDto: Verify2faDto) {
    const user = await this.userRepository.findOne({
      where: { 
        email: verify2faDto.email,
        emailToken: verify2faDto.emailToken,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Code de vérification invalide');
    }

    if (user.emailTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Le code de vérification a expiré');
    }

    user.emailToken = null;
    user.emailTokenExpiresAt = null;
    await this.userRepository.save(user);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generate2FACode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
