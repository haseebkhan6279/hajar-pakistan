import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Everything that shapes the app apart from the transport it listens on.
 * Shared by the standalone server (main.ts) and the Vercel serverless handler
 * (api/index.ts) so the two can never drift on prefix, validation or CORS.
 */
export function configureApp(app: INestApplication): INestApplication {
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

  return app;
}
