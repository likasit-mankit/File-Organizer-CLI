import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ใน ESM จะไม่มี __dirname ให้ใช้โดยตรง ต้องสร้างขึ้นมาเอง (ถ้าจำเป็นต้องใช้)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTENSIONS_MAP = {
  'Images': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'Documents': ['.pdf', '.docx', '.txt', '.xlsx'],
  'Videos': ['.mp4', '.mov', '.avi'],
  'Archives': ['.zip', '.rar', '.7z']
};

async function organizeFiles() {
  try {
    const targetDirectory = process.cwd();
    console.log('Organizing files in:', targetDirectory);

    const files = await fs.readdir(targetDirectory, { withFileTypes: true });
    console.log('Found files:', files);
    for (const file of files) {
      if (file.isDirectory() || file == '.git' || file == 'index.js' || file == 'package.json') {
        continue;
      }
      const fileName = file.name;
      const ext = path.extname(fileName).toLowerCase();

      // 3. หาว่าไฟล์นี้ควรไปอยู่ Folder ไหน?
      const targetFolder = Object.keys(EXTENSIONS_MAP).find(folder =>
        EXTENSIONS_MAP[folder].includes(ext)
      ) || 'Others'; // ถ้าไม่เข้าพวก ให้ไปอยู่โฟลเดอร์ Others

      // 4. สร้างเส้นทาง (Path) ปลายทาง
      const folderPath = path.join(targetDir, targetFolder);
      const oldPath = path.join(targetDir, fileName);
      const newPath = path.join(folderPath, fileName);

      // 5. ลงมือย้าย!
      // สร้าง Folder ก่อน (ถ้ามีแล้วมันจะไม่สร้างซ้ำเพราะ recursive: true)
      await fs.mkdir(folderPath, { recursive: true });

      // ย้ายไฟล์จากที่เดิมไปที่ใหม่
      await fs.rename(oldPath, newPath);

      console.log(`Moved: ${fileName} -> ${targetFolder}`);
    }

    console.log('\nDone! All files organized.');

  } catch (error) {
    console.error('Error organizing files:', error.message);
  }
}

organizeFiles();

