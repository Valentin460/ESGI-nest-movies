import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Watchlist')
    .setDescription('API pour gérer votre liste de films regardés')
    .setVersion('1.0')
    .addTag('Authentification', 'Endpoints pour l\'inscription et l\'authentification des utilisateurs')
    .addTag('Films Regardés', 'Endpoints pour gérer les films regardés')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`URL de l'app : http://localhost:3000`);
  console.log(`Swagger : http://localhost:3000/api`);
}

bootstrap();
