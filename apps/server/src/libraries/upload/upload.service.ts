import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigurationService } from '@server/core/configuration'
import { HttpService } from '../http'
import { Logger, LoggerService } from '../logger'
import { UploadProviderAws } from './internal/providers/aws/upload.provider.aws'
import { UploadProviderLocal } from './internal/providers/local/upload.provider.local'
import { UploadProvider } from './upload.provider'
import { UploadFileType } from './upload.type'

@Injectable()
export class UploadService implements OnModuleInit {
  private logger: Logger
  private instance: UploadProvider

  constructor(
    private configurationService: ConfigurationService,
    private loggerService: LoggerService,
    private httpService: HttpService,
  ) {
    this.logger = loggerService.create({ name: 'UploadService' })
  }

  async onModuleInit() {
    this.instance = await this.createInstance()
  }

  private async createInstance(): Promise<UploadProvider> {
    try {
      this.logger.log(`Trying using AWS...`)

      const instance = new UploadProviderAws(
        this.loggerService,
        this.configurationService,
        this.httpService,
      )

      await instance.initialise()

      return instance
    } catch (error) {
      this.logger.warning(`Could not use AWS: ${error.message}`)
    }

    this.logger.log(
      `Falling back on local provider (not recommended for production)`,
    )

    try {
      const instance = new UploadProviderLocal(
        this.loggerService,
        this.configurationService,
      )

      await instance.initialise()

      return instance
    } catch (error) {
      this.logger.warning(`Could not use local provider: ${error.message}`)
    }
  }

  async uploadPublic(...files: UploadFileType[]): Promise<{ url: string }[]> {
    const responses = []

    for (const file of files) {
      const response = await this.instance.uploadPublic({ file })

      responses.push(response)
    }

    return responses
  }

  async uploadPrivate(...files: UploadFileType[]): Promise<{ url: string }[]> {
    const responses = []

    for (const file of files) {
      const response = await this.instance.uploadPrivate({ file })

      responses.push(response)
    }

    return responses
  }

  async fromPrivateToPublicUrl(
    ...items: { url: string; expiresInSeconds?: number }[]
  ): Promise<{ url: string }[]> {
    const responses = []

    for (const item of items) {
      const response = await this.instance.fromPrivateToPublicUrl(item)

      responses.push(response)
    }

    return responses
  }
}
