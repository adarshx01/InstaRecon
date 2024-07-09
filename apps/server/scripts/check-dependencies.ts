import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/modules/app.module'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  await app.close()
}

bootstrap().catch(err => {
  console.error('Error during app bootstrap', err)
})
