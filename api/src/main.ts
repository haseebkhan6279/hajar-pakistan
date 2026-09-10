import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * The single entrypoint everywhere.
 *
 * Vercel detects NestJS from this file's location and turns the whole app
 * into one Function on Fluid compute — it wants a normal listening server,
 * not a serverless handler, so nothing here is Vercel-specific. Locally it is
 * just the dev server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Same-origin / server-to-server / mobile webviews send no Origin
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      // Vercel preview hosts while custom domains settle
      if (/^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`HAJAR API listening on http://0.0.0.0:${port}/api`);
}
void bootstrap();
