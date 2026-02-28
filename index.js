import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ใน ESM จะไม่มี __dirname ให้ใช้โดยตรง ต้องสร้างขึ้นมาเอง (ถ้าจำเป็นต้องใช้)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTENSIONS_MAP = {
  'Images': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'Music': ['.mp3', '.wav', '.aac', '.flac'],
  'Documents': ['.pdf', '.docx', '.txt', '.xlsx'],
  'Videos': ['.mp4', '.mov', '.avi'],
  'Archives': ['.zip', '.rar', '.7z']
};

async function organizeFiles() {
  try {
    // 1. ต้องประกาศตัวแปรนี้ก่อนเพื่อนใน Function
    const targetDir = process.cwd();

    const files = await fs.readdir(targetDir, { withFileTypes: true });

    for (const file of files) {
      console.log(file.isDirectory());
      if (file.isDirectory() || file.name === 'index.js' || file.name === 'package.json') {
        continue;
      }
      console.log(file.name);
      const fileName = file.name;
      const ext = path.extname(fileName).toLowerCase();

      const targetFolderName = Object.keys(EXTENSIONS_MAP).find(folder =>
        EXTENSIONS_MAP[folder].includes(ext)
      ) || 'Others';

      // 2. ตรงนี้จะเรียกใช้ targetDir ได้เพราะประกาศไว้ข้างบนแล้ว
      const folderPath = path.join(targetDir, targetFolderName);
      const oldPath = path.join(targetDir, fileName);
      const newPath = path.join(folderPath, fileName);

      await fs.mkdir(folderPath, { recursive: true });
      await fs.rename(oldPath, newPath);

      console.log(`✅ Moved: ${fileName} -> ${targetFolderName}`);
    }
    console.log('\n✨ Done!');
  } catch (error) {
    // ถ้า targetDir ไม่ถูกประกาศไว้ใน scope นี้ มันจะพ่น Error ออกมาที่นี่
    console.error('❌ Error organizing files:', error.message);
  }
}

organizeFiles();

