import { Module } from '@nestjs/common'
import { HttpModule } from '../http'
import { UploadProviderLocal } from './internal/providers/local/upload.provider.local'
import { UploadService } from './upload.service'

@Module({
  imports: [UploadProviderLocal.setup(), HttpModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
