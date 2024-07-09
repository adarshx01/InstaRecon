'use client'

import { useEffect, useState } from 'react'
import { Typography, Button, Row, Col, Avatar, Spin } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
const { Title, Text, Paragraph } = Typography
import { useAuthentication } from '@web/modules/authentication'
import dayjs from 'dayjs'
import { useSnackbar } from 'notistack'
import { useRouter, useParams } from 'next/navigation'
import { Api, Model } from '@web/domain'
import { PageLayout } from '@web/layouts/Page.layout'

export default function PublicProfilePage() {
  const router = useRouter()
  const params = useParams<any>()
  const authentication = useAuthentication()
  const userId = authentication.user?.id
  const { enqueueSnackbar } = useSnackbar()
  const [profile, setProfile] = useState<Model.Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profiles = await Api.Profile.findManyByUserId(params.userId, {
          includes: ['user'],
        })
        if (profiles.length > 0) {
          setProfile(profiles[0])
        }
      } catch (error) {
        enqueueSnackbar('Failed to load profile', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    if (params.userId) {
      fetchProfile()
    }
  }, [params.userId])

  const handleCopyLink = () => {
    if (profile?.publicUrl) {
      navigator.clipboard.writeText(profile.publicUrl)
      enqueueSnackbar('Profile link copied to clipboard', {
        variant: 'success',
      })
    }
  }

  if (loading) {
    return (
      <PageLayout layout="narrow">
        <Spin size="large" />
      </PageLayout>
    )
  }

  if (!profile) {
    return (
      <PageLayout layout="narrow">
        <Title level={2}>Profile Not Found</Title>
        <Text>We couldn't find the profile you're looking for.</Text>
      </PageLayout>
    )
  }

  return (
    <PageLayout layout="narrow">
      <Row justify="center" align="middle" style={{ textAlign: 'center' }}>
        <Col>
          <Avatar size={128} src={profile.avatarUrl} />
          <Title level={2}>{profile.user?.name}</Title>
          <Paragraph>{profile.bio}</Paragraph>
          <Button icon={<CopyOutlined />} onClick={handleCopyLink}>
            Copy Profile Link
          </Button>
        </Col>
      </Row>
    </PageLayout>
  )
}
