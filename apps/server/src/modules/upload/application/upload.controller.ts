import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadFileType, UploadService } from '@server/libraries/upload'
import { UploadFromPrivateToPublicDto } from './upload.dto'

@Controller('/v1/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/public')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublic(@UploadedFile() file: UploadFileType) {
    const responses = await this.uploadService.uploadPublic(file)

    const url = responses[0].url

    return { url }
  }

  @Post('/private')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrivate(@UploadedFile() file: UploadFileType) {
    const responses = await this.uploadService.uploadPrivate(file)

    const url = responses[0].url

    return { url }
  }

  @Post('/private-to-public')
  @UseInterceptors(FileInterceptor('file'))
  async fromPrivateToPubic(@Body() body: UploadFromPrivateToPublicDto) {
    const responses = await this.uploadService.fromPrivateToPublicUrl(body)

    const url = responses[0].url

    return { url }
  }
}
