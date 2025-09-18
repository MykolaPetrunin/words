import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

let adminApp: App;
let adminAuth: Auth;

const initializeAdmin = (): void => {
    if (getApps().length === 0) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
            throw new Error('Missing Firebase Admin SDK environment variables');
        }

        adminApp = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            })
        });
    } else {
        adminApp = getApps()[0];
    }

    adminAuth = getAuth(adminApp);
};

export const verifyIdToken = async (
    idToken: string
): Promise<{
    uid: string;
    email?: string;
    emailVerified?: boolean;
}> => {
    if (!adminAuth) {
        initializeAdmin();
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        };
    } catch (error) {
        console.error('Error verifying ID token:', error);
        throw new Error('Invalid token');
    }
};

export const createSessionCookie = async (idToken: string, expiresIn: number): Promise<string> => {
    if (!adminAuth) {
        initializeAdmin();
    }

    return adminAuth.createSessionCookie(idToken, { expiresIn });
};

export const verifySessionCookie = async (
    sessionCookie: string
): Promise<{
    uid: string;
    email?: string;
    emailVerified?: boolean;
}> => {
    if (!adminAuth) {
        initializeAdmin();
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        return {
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            emailVerified: decodedClaims.email_verified
        };
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        throw new Error('Invalid session');
    }
};

export const getUserProfile = async (
    uid: string
): Promise<{
    displayName?: string | null;
    email?: string | null;
}> => {
    if (!adminAuth) {
        initializeAdmin();
    }
    const record = await adminAuth.getUser(uid);
    return { displayName: record.displayName, email: record.email };
};
