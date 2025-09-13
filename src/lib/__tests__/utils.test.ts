import { cn } from '../utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names', () => {
            const result = cn('bg-red-500', 'text-white');
            expect(result).toBe('bg-red-500 text-white');
        });

        it('should handle conflicting Tailwind classes', () => {
            const result = cn('px-2 py-1', 'px-4');
            expect(result).toBe('py-1 px-4');
        });

        it('should filter out falsy values', () => {
            const result = cn('foo', null, undefined, false, 'bar', '');
            expect(result).toBe('foo bar');
        });

        it('should handle conditional classes', () => {
            const isActive = true;
            const isDisabled = false;
            const result = cn('base-class', isActive && 'active', isDisabled && 'disabled');
            expect(result).toBe('base-class active');
        });

        it('should handle arrays of classes', () => {
            const result = cn(['foo', 'bar'], 'baz');
            expect(result).toBe('foo bar baz');
        });

        it('should handle objects with boolean values', () => {
            const result = cn({
                'text-red-500': true,
                'bg-blue-500': false,
                'font-bold': true
            });
            expect(result).toBe('text-red-500 font-bold');
        });

        it('should handle empty inputs', () => {
            const result = cn();
            expect(result).toBe('');
        });

        it('should merge complex Tailwind classes correctly', () => {
            const result = cn('text-sm font-medium text-gray-900', 'text-lg text-blue-600');
            expect(result).toBe('font-medium text-lg text-blue-600');
        });
    });
});
