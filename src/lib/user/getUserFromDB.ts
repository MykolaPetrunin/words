import { getServerSession } from '@/lib/auth/serverAuth';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';
import { ApiUser } from '@/lib/types/user';

export const getUserFromDB = async (): Promise<ApiUser | null> => {
    const session = await getServerSession();

    let initialUser: ApiUser | null = null;
    if (session?.uid) {
        const dbUser = await getUserByFirebaseId(session.uid);
        if (dbUser) {
            initialUser = {
                id: dbUser.id,
                firebaseId: dbUser.firebaseId,
                email: dbUser.email,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                questionsPerSession: dbUser.questionsPerSession,
                locale: dbUser.locale,
                role: dbUser.role,
                createdAt: dbUser.createdAt.toISOString(),
                updatedAt: dbUser.updatedAt.toISOString()
            };
        }
    }

    return initialUser;
};
