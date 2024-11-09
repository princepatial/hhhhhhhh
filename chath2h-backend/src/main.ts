import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './socketAdapter';
import { sharedSessionMiddleware } from './sharedSessionMiddleware'; // Import the shared middleware
import { AllExceptionsFilter } from './exceptions/AllExceptionFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');

  app.use(sharedSessionMiddleware);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Chat H2H API')
    .setDescription('Api endpoints for Chat H2H backend')
    .setVersion('1.0')
    .addTag('ChatH2H')
    .addCookieAuth('H2H_auth_cookie')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(3001);
  
}
bootstrap();