#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const coverageFile = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

try {
    console.log('🧪 Running tests with coverage...\n');

    execSync('npm run test:coverage', { stdio: 'inherit' });

    if (!fs.existsSync(coverageFile)) {
        console.error('❌ Coverage file not found!');
        process.exit(1);
    }

    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf-8'));
    const thresholds = {
        branches: 75,
        functions: 80,
        lines: 80,
        statements: 80
    };

    console.log('\n📊 Coverage Results:\n');

    let failed = false;
    const total = coverage.total;

    Object.keys(thresholds).forEach((metric) => {
        const value = total[metric].pct;
        const threshold = thresholds[metric];
        const status = value >= threshold ? '✅' : '❌';
        const emoji = value >= threshold ? '🎉' : '⚠️';

        console.log(`${status} ${metric.padEnd(10)}: ${value.toFixed(2)}% (threshold: ${threshold}%) ${emoji}`);

        if (value < threshold) {
            failed = true;
        }
    });

    if (failed) {
        console.log('\n❌ Test coverage is below the configured thresholds!');
        console.log('💡 Add more tests to increase coverage.');
        process.exit(1);
    } else {
        console.log('\n✅ All coverage thresholds met! 🎉');
        process.exit(0);
    }
} catch (error) {
    if (error.status !== undefined) {
        process.exit(error.status);
    }
    console.error('❌ Error running tests:', error.message);
    process.exit(1);
}
