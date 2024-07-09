'use client'

import { useEffect, useState } from 'react'
import { Typography, Row, Col, Card } from 'antd'
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
} from '@ant-design/icons'
const { Title, Text } = Typography
const socialNetworkIcons = {
  Facebook: <FacebookOutlined />,
  Twitter: <TwitterOutlined />,
  LinkedIn: <LinkedinOutlined />,
  Instagram: <InstagramOutlined />,
}
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function HomePage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [userSocialNetworks, setUserSocialNetworks] = useState<
    Model.UserSocialNetwork[]
  >([])

  useEffect(() => {
    if (userId) {
      Api.User.findOne(userId, {
        includes: ['userSocialNetworks', 'userSocialNetworks.socialNetwork'],
      })
        .then(user => {
          setUserSocialNetworks(user.userSocialNetworks || [])
        })
        .catch(error => {
          enqueueSnackbar('Failed to load social networks', {
            variant: 'error',
          })
        })
    }
  }, [userId])

  return (
    <PageLayout layout="narrow">
      <Title level={2}>My Social Networks</Title>
      <Text>Quickly access and share your social networking sites.</Text>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {userSocialNetworks?.map(userSocialNetwork => (
          <Col xs={24} sm={12} md={8} lg={6} key={userSocialNetwork.id}>
            <Card
              title={userSocialNetwork.socialNetwork?.name}
              extra={socialNetworkIcons[userSocialNetwork.socialNetwork?.name]}
              onClick={() =>
                window.open(userSocialNetwork.profileUrl, '_blank')
              }
              style={{ cursor: 'pointer' }}
            >
              <Text>{userSocialNetwork.profileUrl}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </PageLayout>
  )
}
