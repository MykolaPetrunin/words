import { redirect } from 'next/navigation';

import { appPaths } from '@/lib/appPaths';

export default function BooksIndexPage(): never {
    redirect(appPaths.subjects);
}
