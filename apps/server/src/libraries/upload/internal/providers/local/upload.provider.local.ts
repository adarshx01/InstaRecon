import { Injectable } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigurationService } from '@server/core/configuration'
import { FileHelper } from '@server/helpers/file'
import {
  FromPrivateToPublicUrlOptions,
  UploadPrivateOptions,
  UploadPrivateReturn,
  UploadProvider,
  UploadPublicOptions,
  UploadPublicReturn,
} from '@server/libraries/upload/upload.provider'
import { join } from 'path'
import { Logger, LoggerService } from '../../../../logger'

@Injectable()
export class UploadProviderLocal extends UploadProvider {
  static path = '/api-static'

  static setup() {
    return ServeStaticModule.forRoot({
      rootPath: join(FileHelper.getRoot(), `.${this.path}`),
      serveRoot: this.path,
    })
  }

  private logger: Logger
  private staticServerUrl: string

  private pathPublic = `.${UploadProviderLocal.path}/public`
  private pathPrivate = `.${UploadProviderLocal.path}/private`

  constructor(
    private loggerService: LoggerService,
    private configurationService: ConfigurationService,
  ) {
    super()

    this.logger = this.loggerService.create({ name: 'UploadProviderLocal' })
  }

  public initialise(): Promise<void> {
    try {
      FileHelper.writeFolder(this.pathPublic)

      this.staticServerUrl = `${this.configurationService.getBaseUrl()}`

      this.logger.success(`Upload Local is active`)
    } catch (error) {
      this.logger.error(`Upload Local failed to start: ${error.message}`)
    }

    return
  }

  async uploadPublic({
    file,
  }: UploadPublicOptions): Promise<UploadPublicReturn> {
    const content = file.buffer

    const filename = this.ensureFilename(file.originalname)

    const path = FileHelper.joinPaths(this.pathPublic, filename)

    FileHelper.writeFile(path, content)

    const url = `${this.staticServerUrl}/${path}`

    return { url }
  }

  async uploadPrivate({
    file,
  }: UploadPrivateOptions): Promise<UploadPrivateReturn> {
    const content = file.buffer

    const filename = this.ensureFilename(file.originalname)

    const path = FileHelper.joinPaths(this.pathPrivate, filename)

    FileHelper.writeFile(path, content)

    const url = `${this.staticServerUrl}/${path}`

    return { url }
  }

  async fromPrivateToPublicUrl({
    url,
  }: FromPrivateToPublicUrlOptions): Promise<UploadPrivateReturn> {
    return { url }
  }
}
