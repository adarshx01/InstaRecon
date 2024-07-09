import { ColumnNumeric } from '@server/core/database'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../../../modules/user/domain'

import { SocialNetwork } from '../../../modules/socialNetwork/domain'

@Entity()
export class UserSocialNetwork {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  profileUrl?: string

  @Column({})
  userId: string

  @ManyToOne(() => User, parent => parent.userSocialNetworks)
  @JoinColumn({ name: 'userId' })
  user?: User

  @Column({})
  socialNetworkId: string

  @ManyToOne(() => SocialNetwork, parent => parent.userSocialNetworks)
  @JoinColumn({ name: 'socialNetworkId' })
  socialNetwork?: SocialNetwork

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
