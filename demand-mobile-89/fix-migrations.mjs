import { readdirSync, renameSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const rootMigDir = 'c:\\Users\\PRECISE\\Desktop\\Projects\\New GHM app\\supabase\\migrations';
const demandMigDir = 'c:\\Users\\PRECISE\\Desktop\\Projects\\New GHM app\\demand-mobile-89\\supabase\\migrations';

// 1. Copy root migrations to demand directory
console.log('Copying root migrations...');
const rootFiles = readdirSync(rootMigDir);
for (const file of rootFiles) {
    const src = join(rootMigDir, file);
    const dest = join(demandMigDir, file);
    if (!existsSync(dest)) {
        copyFileSync(src, dest);
        console.log(`  Copied: ${file}`);
    }
}

// 2. Rename files with dashes in demand directory
console.log('Fixing filenames (replacing first dash with underscore)...');
const demandFiles = readdirSync(demandMigDir);
for (const file of demandFiles) {
    // Pattern: 14 digits followed by a dash
    if (/^\d{14}-/.test(file)) {
        const newName = file.replace(/^(\d{14})-/, '$1_');
        const oldPath = join(demandMigDir, file);
        const newPath = join(demandMigDir, newName);
        if (!existsSync(newPath)) {
            renameSync(oldPath, newPath);
            console.log(`  Renamed: ${file} -> ${newName}`);
        } else {
            console.log(`  Skipping: ${file} (target already exists)`);
        }
    }
}
console.log('Done!');
