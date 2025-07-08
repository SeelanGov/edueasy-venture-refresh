import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const STORAGE_BUCKET = 'public';

const baseDir = path.join(__dirname, '../supabase/thandi_knowledge_base');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadAndIndex() {
  const modules = await readdir(baseDir);
  for (const module of modules) {
    const moduleDir = path.join(baseDir, module);
    if (!(await stat(moduleDir)).isDirectory()) continue;

    const files = await readdir(moduleDir);
    const jsonFile = files.find(f => f.endsWith('.json'));
    const htmlFile = files.find(f => f.endsWith('.html'));
    if (!jsonFile || !htmlFile) continue;

    const jsonPath = path.join(moduleDir, jsonFile);
    const htmlPath = path.join(moduleDir, htmlFile);

    // Read JSON metadata
    const jsonData = JSON.parse(await readFile(jsonPath, 'utf-8'));
    const { title, tags, source_links } = jsonData;

    // Upload files to Supabase Storage
    const storageJsonPath = `thandi_knowledge_base/${module}/${jsonFile}`;
    const storageHtmlPath = `thandi_knowledge_base/${module}/${htmlFile}`;

    await supabase.storage.from(STORAGE_BUCKET).upload(storageJsonPath, await readFile(jsonPath), {
      contentType: 'application/json',
      upsert: true,
    });
    await supabase.storage.from(STORAGE_BUCKET).upload(storageHtmlPath, await readFile(htmlPath), {
      contentType: 'text/html',
      upsert: true,
    });

    // Insert into index table
    await supabase.from('thandi_knowledge_index').upsert({
      module,
      title,
      tags,
      source_links,
      json_path: storageJsonPath,
      html_path: storageHtmlPath,
    }, { onConflict: 'module' });
  }
}

uploadAndIndex().then(() => {
  console.log('Upload and indexing complete.');
}).catch(console.error); 