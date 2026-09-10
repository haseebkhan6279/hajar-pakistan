import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';

/**
 * Vercel serverless entry. Every route is rewritten here by vercel.json, and
 * Nest's own router takes it from there under the /api prefix.
 *
 * Module scope outlives a single invocation on a warm container, so the Nest
 * app — and with it the Mongo connection pool — is built once per container
 * rather than once per request. The promise (not a boolean) is what is cached:
 * two requests arriving during a cold start then await the same bootstrap
 * instead of racing to build two apps and two pools.
 */
const server = express();
let ready: Promise<void> | undefined;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    // Vercel captures stdout per invocation; the boot banner adds noise there.
    logger: ['error', 'warn'],
  });
  configureApp(app);
  // init(), not listen() — the platform owns the socket.
  await app.init();
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    ready ??= bootstrap();
    await ready;
  } catch (err) {
    // A failed bootstrap must not poison every later request on this container.
    ready = undefined;
    throw err;
  }
  server(req as express.Request, res as express.Response);
}
