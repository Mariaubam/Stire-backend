import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // ─── Swagger ───────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('STIRE API')
    .setDescription('Sistema Tutor Inteligente con Repetición Espaciada — API REST')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // ───────────────────────────────────────────────────────────

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 STIRE Backend corriendo en: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs en:            http://localhost:${port}/docs`);
}
bootstrap();
