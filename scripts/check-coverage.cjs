#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const coverageFile = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

try {
    console.log('🧪 Запуск тестів з покриттям...\n');
    
    execSync('npm run test:coverage', { stdio: 'inherit' });
    
    if (!fs.existsSync(coverageFile)) {
        console.error('❌ Файл покриття не знайдено!');
        process.exit(1);
    }
    
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
    const thresholds = {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
    };
    
    console.log('\n📊 Результати покриття:\n');
    
    let failed = false;
    const total = coverage.total;
    
    Object.keys(thresholds).forEach((metric) => {
        const value = total[metric].pct;
        const threshold = thresholds[metric];
        const status = value >= threshold ? '✅' : '❌';
        const emoji = value >= threshold ? '🎉' : '⚠️';
        
        console.log(`${status} ${metric.padEnd(10)}: ${value.toFixed(2)}% (поріг: ${threshold}%) ${emoji}`);
        
        if (value < threshold) {
            failed = true;
        }
    });
    
    if (failed) {
        console.log('\n❌ Покриття тестами нижче встановлених порогів!');
        console.log('💡 Додайте більше тестів для збільшення покриття.');
        process.exit(1);
    } else {
        console.log('\n✅ Всі пороги покриття досягнуті! 🎉');
        process.exit(0);
    }
} catch (error) {
    if (error.status !== undefined) {
        process.exit(error.status);
    }
    console.error('❌ Помилка при виконанні тестів:', error.message);
    process.exit(1);
}
