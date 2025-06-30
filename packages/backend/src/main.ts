import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'
import { ApiInterceptor, ApiPipe } from './lib/api'

dotenv.config()

async function bootstrap() {
  const appPrefix = process.env.APP_PREFIX!
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(appPrefix)

  console.log(
    'Cors: ',
    process.env.APP_CORS?.split(',').map((i) => i.trim()),
  )
  app.enableCors({
    origin: process.env.APP_CORS!.split(',').map((i) => i.trim()),
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.useGlobalInterceptors(new ApiInterceptor())
  app.useGlobalPipes(
    ApiPipe.create(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Langfarm ticket')
    .setDescription('Langfarm ticket API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  console.log('PORT: ', process.env.APP_PORT)
  await app.listen(process.env.APP_PORT ?? 8000)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
