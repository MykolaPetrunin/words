jest.mock('@prisma/client', () => {
    const PrismaClient = jest.fn().mockImplementation(() => ({ __mockPrisma: true }));
    return { PrismaClient };
});

describe('prisma singleton behavior', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
        Object.defineProperty(process.env, 'NODE_ENV', { value: originalNodeEnv, configurable: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (globalThis as any).prisma;
        jest.resetModules();
    });

    it('sets global prisma in non-production environments', async () => {
        Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true });
        jest.resetModules();

        const mod = await import('../prisma');
        const client = mod.default;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((globalThis as any).prisma).toBe(client);
        expect(client).toEqual({ __mockPrisma: true });
    });

    it('does not set global prisma in production', async () => {
        Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
        jest.resetModules();

        const mod = await import('../prisma');
        const client = mod.default;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((globalThis as any).prisma).toBeUndefined();
        expect(client).toEqual({ __mockPrisma: true });
    });
});
