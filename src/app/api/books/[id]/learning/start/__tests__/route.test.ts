import { NextRequest } from 'next/server';

import { getServerSession } from '@/lib/auth/serverAuth';
import { startLearningBook } from '@/lib/repositories/bookRepository';
import { getUserByFirebaseId } from '@/lib/repositories/userRepository';

import { POST } from '../route';

jest.mock('@/lib/auth/serverAuth');
jest.mock('@/lib/repositories/userRepository');
jest.mock('@/lib/repositories/bookRepository');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetUserByFirebaseId = getUserByFirebaseId as jest.MockedFunction<typeof getUserByFirebaseId>;
const mockStartLearningBook = startLearningBook as jest.MockedFunction<typeof startLearningBook>;

describe('POST /api/books/[id]/learning/start', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should start learning a book successfully', async () => {
        const mockSession = { uid: 'firebase-uid', email: 'test@example.com' };
        const mockUser = { id: 'user-1', firebaseId: 'firebase-uid', email: 'test@example.com' };
        const mockBook = {
            id: 'book-1',
            titleUk: 'Test Book',
            titleEn: 'Test Book',
            descriptionUk: null,
            descriptionEn: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isLearning: true,
            userLevelScores: []
        };

        mockGetServerSession.mockResolvedValue(mockSession);
        mockGetUserByFirebaseId.mockResolvedValue(mockUser);
        mockStartLearningBook.mockResolvedValue(mockBook);

        const response = await POST({} as NextRequest, { params: Promise.resolve({ id: 'book-1' }) });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(mockBook);
        expect(mockStartLearningBook).toHaveBeenCalledWith(mockUser.id, 'book-1');
    });

    it('should return 401 when session is missing', async () => {
        mockGetServerSession.mockResolvedValue(null);

        const response = await POST({} as NextRequest, { params: Promise.resolve({ id: 'book-1' }) });

        expect(response.status).toBe(401);
        const data = await response.json();
        expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 404 when user is not found', async () => {
        const mockSession = { uid: 'firebase-uid', email: 'test@example.com' };
        mockGetServerSession.mockResolvedValue(mockSession);
        mockGetUserByFirebaseId.mockResolvedValue(null);

        const response = await POST({} as NextRequest, { params: Promise.resolve({ id: 'book-1' }) });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'User not found' });
    });

    it('should return 500 when book is not found', async () => {
        const mockSession = { uid: 'firebase-uid', email: 'test@example.com' };
        const mockUser = { id: 'user-1', firebaseId: 'firebase-uid', email: 'test@example.com' };

        mockGetServerSession.mockResolvedValue(mockSession);
        mockGetUserByFirebaseId.mockResolvedValue(mockUser);
        mockStartLearningBook.mockRejectedValue(new Error('Book not found'));

        const consoleError = jest.spyOn(console, 'error').mockImplementation();

        const response = await POST({} as NextRequest, { params: Promise.resolve({ id: 'invalid-book' }) });

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ error: 'Internal server error' });

        consoleError.mockRestore();
    });

    it('should handle server errors', async () => {
        const mockSession = { uid: 'firebase-uid', email: 'test@example.com' };
        const mockUser = { id: 'user-1', firebaseId: 'firebase-uid', email: 'test@example.com' };

        mockGetServerSession.mockResolvedValue(mockSession);
        mockGetUserByFirebaseId.mockResolvedValue(mockUser);
        mockStartLearningBook.mockRejectedValue(new Error('Database error'));

        const consoleError = jest.spyOn(console, 'error').mockImplementation();

        const response = await POST({} as NextRequest, { params: Promise.resolve({ id: 'book-1' }) });

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toEqual({ error: 'Internal server error' });

        consoleError.mockRestore();
    });
});
