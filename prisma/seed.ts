/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    console.log('🌱 Starting seed...');

    // Seed levels
    console.log('📚 Seeding levels...');

    const levels = [
        {
            id: 'junior',
            key: 'junior',
            nameUk: 'Junior',
            nameEn: 'Junior',
            isActive: true,
            orderIndex: 0
        },
        {
            id: 'middle',
            key: 'middle',
            nameUk: 'Middle',
            nameEn: 'Middle',
            isActive: true,
            orderIndex: 1
        },
        {
            id: 'senior',
            key: 'senior',
            nameUk: 'Senior',
            nameEn: 'Senior',
            isActive: true,
            orderIndex: 2
        }
    ];

    for (const level of levels) {
        await prisma.level.upsert({
            where: { id: level.id },
            update: {
                nameUk: level.nameUk,
                nameEn: level.nameEn,
                isActive: level.isActive,
                orderIndex: level.orderIndex
            },
            create: level
        });
        console.log(`✅ Level "${level.nameEn}" seeded`);
    }

    // Seed subjects
    console.log('📚 Seeding subjects...');

    const subjects = [
        {
            id: 'frontend',
            nameUk: 'Front-End розробник',
            nameEn: 'Front-End Developer',
            descriptionUk: 'Створення користувацьких інтерфейсів та клієнтської частини веб-додатків',
            descriptionEn: 'Creating user interfaces and client-side web applications',
            isActive: true
        },
        {
            id: 'backend',
            nameUk: 'Backend розробка',
            nameEn: 'Backend Development',
            descriptionUk: 'Серверна розробка, API, бази даних та архітектура',
            descriptionEn: 'Server-side development, APIs, databases and architecture',
            isActive: true
        },
        {
            id: 'devops',
            nameUk: 'DevOps',
            nameEn: 'DevOps',
            descriptionUk: 'Автоматизація розгортання, CI/CD, моніторинг та інфраструктура',
            descriptionEn: 'Deployment automation, CI/CD, monitoring and infrastructure',
            isActive: true
        },
        {
            id: 'algorithms',
            nameUk: 'Алгоритми та структури даних',
            nameEn: 'Algorithms and Data Structures',
            descriptionUk: 'Основи алгоритмів, структури даних та складність обчислень',
            descriptionEn: 'Fundamentals of algorithms, data structures and computational complexity',
            isActive: true
        }
    ];

    for (const subject of subjects) {
        await prisma.subject.upsert({
            where: { id: subject.id },
            update: {
                nameUk: subject.nameUk,
                nameEn: subject.nameEn,
                descriptionUk: subject.descriptionUk,
                descriptionEn: subject.descriptionEn,
                isActive: subject.isActive
            },
            create: subject
        });
        console.log(`✅ Subject "${subject.nameEn}" seeded`);
    }

    // Seed books
    console.log('📖 Seeding books...');

    const books = [
        {
            id: 'javascript-frontend',
            titleUk: 'Javascript для Front-End розробника',
            titleEn: 'Javascript for Front-End Developer',
            descriptionUk: 'Повний курс JavaScript для frontend розробки з практичними прикладами та завданнями',
            descriptionEn: 'Complete JavaScript course for frontend development with practical examples and tasks',
            isActive: true
        }
    ];

    for (const book of books) {
        await prisma.book.upsert({
            where: { id: book.id },
            update: {
                titleUk: book.titleUk,
                titleEn: book.titleEn,
                descriptionUk: book.descriptionUk,
                descriptionEn: book.descriptionEn,
                isActive: book.isActive
            },
            create: book
        });
        console.log(`✅ Book "${book.titleEn}" seeded`);
    }

    // Seed book-subject relations
    console.log('🔗 Seeding book-subject relations...');

    const bookSubjectRelations = [
        {
            bookId: 'javascript-frontend',
            subjectId: 'frontend'
        }
    ];

    for (const relation of bookSubjectRelations) {
        await prisma.bookSubject.upsert({
            where: {
                bookId_subjectId: {
                    bookId: relation.bookId,
                    subjectId: relation.subjectId
                }
            },
            update: {},
            create: relation
        });
        console.log(`✅ Book-Subject relation "${relation.bookId}" - "${relation.subjectId}" seeded`);
    }

    console.log('🎉 Seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
