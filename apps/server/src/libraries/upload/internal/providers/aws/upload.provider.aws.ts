import {
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigurationService } from '@server/core/configuration'
import { DateHelper } from '@server/helpers/date'
import { Utility } from '@server/helpers/utility'
import { HttpService } from '@server/libraries/http'
import {
  FromPrivateToPublicUrlOptions,
  UploadPrivateOptions,
  UploadPrivateReturn,
  UploadProvider,
  UploadPublicOptions,
  UploadPublicReturn,
} from '@server/libraries/upload/upload.provider'
import { Logger, LoggerService } from '../../../../logger'

const ONE_HOUR_IN_SECONDS = 60 * 60

type Bucket = {
  dateCreation: Date
  name: string
}

type Credentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
  expiration: Date
}

type CredentialsResponse = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
  expiration: string
  bucketNamePrivate: string
  bucketNamePublic: string
  bucketKey: string
}

@Injectable()
export class UploadProviderAws extends UploadProvider {
  private static isMarblismInitialised: boolean = false

  private logger: Logger
  private client: S3Client
  private bucketNamePublic: string
  private bucketNamePrivate: string
  private region: string
  private credentials: Credentials
  private marblismApiKey: string
  private bucketKey: string

  constructor(
    private loggerService: LoggerService,
    private configurationService: ConfigurationService,
    private httpService: HttpService,
  ) {
    super()

    this.logger = this.loggerService.create({ name: 'UploadProviderAws' })
  }

  public async initialise() {
    this.region = this.configurationService.get(
      `SERVER_UPLOAD_AWS_REGION`,
      'us-west-1',
    )

    try {
      this.marblismApiKey = this.configurationService.get(
        `SERVER_UPLOAD_MARBLISM_API_KEY`,
      )

      if (Utility.isDefined(this.marblismApiKey)) {
        if (UploadProviderAws.isMarblismInitialised) {
          return
        }

        await this.initializeWithMarblism()

        this.logger.success(
          `AWS library (Marblism) active in region ${this.region}`,
        )

        UploadProviderAws.isMarblismInitialised = true

        return
      }
    } catch (error) {
      this.logger.warning(`AWS library (Marblism) failed to start`)
    }

    try {
      const accessKey = this.configurationService.get(
        `SERVER_UPLOAD_AWS_ACCESS_KEY`,
      )
      const secretKey = this.configurationService.get(
        `SERVER_UPLOAD_AWS_SECRET_KEY`,
      )

      if (!accessKey && !secretKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_ACCESS_KEY && SERVER_UPLOAD_AWS_SECRET_KEY in your .env to activate',
        )
      }

      if (!accessKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_ACCESS_KEY in your .env to activate',
        )
      }

      if (!secretKey) {
        throw new Error(
          'Set SERVER_UPLOAD_AWS_SECRET_KEY in your .env to activate',
        )
      }

      this.bucketNamePublic = this.configurationService.get(
        `SERVER_UPLOAD_AWS_BUCKET_PUBLIC_NAME`,
      )

      if (!this.bucketNamePublic) {
        this.logger.warning(
          `Set SERVER_UPLOAD_AWS_BUCKET_PUBLIC_NAME in your .env to activate a public bucket with infinite urls`,
        )
      }

      this.bucketNamePrivate = this.configurationService.get(
        `SERVER_UPLOAD_AWS_BUCKET_PRIVATE_NAME`,
      )

      if (!this.bucketNamePrivate) {
        this.logger.warning(
          `Set SERVER_UPLOAD_AWS_BUCKET_PRIVATE_NAME in your .env to activate a private bucket with signed urls`,
        )
      }

      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      })

      await this.check()

      this.logger.success(`AWS library active in region ${this.region}`)
    } catch (error) {
      this.logger.warning(`AWS library failed to start`)

      throw new Error(error)
    }
  }

  private async initializeWithMarblism() {
    const dashboardBaseUrl = this.configurationService.getDashboardBaseUrl()

    const url = `${dashboardBaseUrl}/v1/addons/upload/create-credentials`

    this.httpService.setApiKey(this.marblismApiKey)

    const response = await this.httpService.post<CredentialsResponse>(url, {})

    this.bucketNamePrivate = response.bucketNamePrivate
    this.bucketNamePublic = `${response.bucketNamePublic}`

    this.credentials = {
      accessKeyId: response.accessKeyId,
      secretAccessKey: response.secretAccessKey,
      sessionToken: response.sessionToken,
      expiration: new Date(response.expiration),
    }

    this.bucketKey = response.bucketKey

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.credentials.accessKeyId,
        secretAccessKey: this.credentials.secretAccessKey,
        sessionToken: this.credentials.sessionToken,
      },
    })

    await this.check()
  }

  private async ensureCredentials() {
    if (!UploadProviderAws.isMarblismInitialised) {
      return
    }

    if (this.areCredentialsValid()) {
      return
    }

    const dashboardBaseUrl = this.configurationService.getDashboardBaseUrl()

    const url = `${dashboardBaseUrl}/v1/addons/upload/refresh-credentials`

    this.httpService.setApiKey(this.marblismApiKey)

    const response = await this.httpService.post<CredentialsResponse>(url, {})

    this.credentials = {
      accessKeyId: response.accessKeyId,
      secretAccessKey: response.secretAccessKey,
      sessionToken: response.sessionToken,
      expiration: new Date(response.expiration),
    }

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.credentials.accessKeyId,
        secretAccessKey: this.credentials.secretAccessKey,
        sessionToken: this.credentials.sessionToken,
      },
    })

    await this.check()
  }

  private areCredentialsValid(): boolean {
    const isTokenDefined = Utility.isDefined(this.credentials)

    const isTokenValid =
      isTokenDefined &&
      DateHelper.isBefore(DateHelper.getNow(), this.credentials.expiration)

    return isTokenValid
  }

  private async check(): Promise<void> {
    const buckets = await this.listBuckets()

    if (this.bucketNamePrivate) {
      this.logger.log(`Checking bucket "${this.bucketNamePrivate}"...`)

      const bucket = buckets.find(
        bucket => bucket.name === this.bucketNamePrivate,
      )

      if (bucket) {
        this.logger.success(`Bucket "${this.bucketNamePrivate}" is active`)
      } else {
        throw new Error(`Bucket "${this.bucketNamePrivate}" was not found`)
      }
    }

    if (this.bucketNamePublic) {
      this.logger.log(`Checking bucket "${this.bucketNamePublic}"...`)

      const bucket = buckets.find(
        bucket => bucket.name === this.bucketNamePublic,
      )

      if (bucket) {
        this.logger.success(`Bucket "${this.bucketNamePublic}" is active`)
      } else {
        throw new Error(`Bucket "${this.bucketNamePublic}" was not found`)
      }
    }
  }

  public async uploadPublic(
    options: UploadPublicOptions,
  ): Promise<UploadPublicReturn> {
    await this.ensureCredentials()

    const { file } = options

    let key = this.ensureFilename(file.originalname)

    key = this.ensureKey(key)

    const command = new PutObjectCommand({
      Bucket: `${this.bucketNamePublic}`,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    try {
      await this.client.send(command)

      this.logger.success(`File ${file.originalname} saved (public)`)

      const url = `${this.getBaseUrlPublic()}/${key}`

      return { url }
    } catch (error) {
      this.logger.error(`${error}`)
      throw new Error(`Could not upload public file with key "${key}"`)
    }
  }

  public async uploadPrivate(
    options: UploadPrivateOptions,
  ): Promise<UploadPrivateReturn> {
    await this.ensureCredentials()

    const { file } = options

    const key = this.ensureFilename(file.originalname)

    const command = new PutObjectCommand({
      Bucket: `${this.bucketNamePrivate}`,
      Key: this.ensureKey(key),
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    try {
      await this.client.send(command)

      this.logger.success(`File ${file.originalname} saved (private)`)

      const url = `${this.getBaseUrlPrivate()}/${key}`

      return { url }
    } catch (error) {
      this.logger.error(`${error}`)
      throw new Error(`Could not upload private file with key "${key}"`)
    }
  }

  async fromPrivateToPublicUrl({
    url,
    expiresInSeconds = ONE_HOUR_IN_SECONDS,
  }: FromPrivateToPublicUrlOptions): Promise<UploadPrivateReturn> {
    if (!this.isUrlPrivate(url)) {
      throw new Error(`${url} must be a private url`)
    }

    await this.ensureCredentials()

    const key = this.extractKeyFromUrlPrivate(url)

    const params = {
      Bucket: `${this.bucketNamePrivate}`,
      Key: this.ensureKey(key),
    }

    const command = new GetObjectCommand(params)

    const urlPublic = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    })

    return { url: urlPublic }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   PRIVATE                                  */
  /* -------------------------------------------------------------------------- */

  private async listBuckets(): Promise<Bucket[]> {
    const result = await this.client.send(new ListBucketsCommand({}))

    const buckets = result.Buckets.map(item => ({
      name: item.Name,
      dateCreation: item.CreationDate,
    }))

    return buckets
  }

  private getBaseUrlPrivate(): string {
    return `https://${this.bucketNamePrivate}.s3.${this.region}.amazonaws.com`
  }

  private getBaseUrlPublic(): string {
    return `https://${this.bucketNamePublic}.s3.${this.region}.amazonaws.com`
  }

  private ensureKey(key: string): string {
    let keyClean = key

    const isPrefixedSlash = keyClean.startsWith('/')

    if (isPrefixedSlash) {
      keyClean = keyClean.slice(1)
    }

    const isPrefixedBucketKey = keyClean.startsWith(this.bucketKey)

    if (!isPrefixedBucketKey) {
      keyClean = `${this.bucketKey}/${keyClean}`
    }

    return keyClean
  }

  private isUrlPrivate(url: string): boolean {
    const baseUrlPrivate = this.getBaseUrlPrivate()

    const isPrivate = url.startsWith(baseUrlPrivate)

    return isPrivate
  }

  private extractKeyFromUrlPrivate(url: string): string {
    const baseUrlPrivate = this.getBaseUrlPrivate()

    return url.replace(baseUrlPrivate, '')
  }
}
