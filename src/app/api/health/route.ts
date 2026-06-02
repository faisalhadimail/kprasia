import { NextResponse } from 'next/server'
import { getFirebaseApp, getFirebaseDb } from '@/lib/firebase'

export async function GET() {
  try {
    // Check Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const missingVars = Object.entries(firebaseConfig)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Firebase environment variables missing',
        missingVars,
        config: {
          hasApiKey: !!firebaseConfig.apiKey,
          hasProjectId: !!firebaseConfig.projectId,
          hasAppId: !!firebaseConfig.appId,
        }
      }, { status: 400 })
    }

    // Try to initialize Firebase
    try {
      const app = getFirebaseApp()
      const db = getFirebaseDb()

      return NextResponse.json({
        status: 'success',
        message: 'Firebase is configured and connected',
        config: {
          projectId: firebaseConfig.projectId,
          hasApiKey: !!firebaseConfig.apiKey,
          hasAppId: !!firebaseConfig.appId,
        },
        firebase: {
          initialized: !!app,
          database: !!db,
        }
      })
    } catch (firebaseError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Firebase initialization failed',
        error: firebaseError.message,
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
    }, { status: 500 })
  }
}