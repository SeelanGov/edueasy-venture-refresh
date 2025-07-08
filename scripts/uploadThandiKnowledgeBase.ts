import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const STORAGE_BUCKET = 'thandi-knowledge';

const baseDir = path.join(__dirname, '../supabase/thandi_knowledge_base');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadAndIndex() {
  console.log('🚀 Starting knowledge base upload and indexing...');
  
  const modules = await readdir(baseDir);
  console.log(`📁 Found ${modules.length} potential modules: ${modules.join(', ')}`);
  
  let successCount = 0;
  let skippedCount = 0;
  
  for (const module of modules) {
    const moduleDir = path.join(baseDir, module);
    
    // Skip non-directories (like files)
    const dirStat = await stat(moduleDir);
    if (!dirStat.isDirectory()) {
      console.log(`⏭️  Skipping ${module} (not a directory)`);
      skippedCount++;
      continue;
    }

    console.log(`\n📂 Processing module: ${module}`);
    
    const files = await readdir(moduleDir);
    const jsonFile = files.find(f => f.endsWith('.json'));
    const htmlFile = files.find(f => f.endsWith('.html'));
    
    if (!jsonFile || !htmlFile) {
      console.log(`⚠️  Skipping ${module}: missing files (json: ${jsonFile}, html: ${htmlFile})`);
      skippedCount++;
      continue;
    }

    const jsonPath = path.join(moduleDir, jsonFile);
    const htmlPath = path.join(moduleDir, htmlFile);

    try {
      // Read JSON metadata
      const jsonData = JSON.parse(await readFile(jsonPath, 'utf-8'));
      const { title, tags, source_links } = jsonData;
      console.log(`📋 Module: ${title}, Tags: ${tags?.length || 0}, Sources: ${source_links?.length || 0}`);

      // Upload files to Supabase Storage
      const storageJsonPath = `${module}/${jsonFile}`;
      const storageHtmlPath = `${module}/${htmlFile}`;

      // Upload JSON file
      const jsonUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageJsonPath, await readFile(jsonPath), {
          contentType: 'application/json',
          upsert: true,
        });
      
      if (jsonUpload.error) {
        console.log(`❌ JSON upload failed: ${jsonUpload.error.message}`);
        continue;
      }
      
      // Upload HTML file
      const htmlUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageHtmlPath, await readFile(htmlPath), {
          contentType: 'text/html',
          upsert: true,
        });
        
      if (htmlUpload.error) {
        console.log(`❌ HTML upload failed: ${htmlUpload.error.message}`);
        continue;
      }

      console.log(`✅ Files uploaded: ${storageJsonPath}, ${storageHtmlPath}`);

      // Insert into index table
      const indexResult = await supabase.from('thandi_knowledge_index').upsert({
        module,
        title,
        tags: tags || [],
        source_links: source_links || [],
        json_path: storageJsonPath,
        html_path: storageHtmlPath,
      }, { onConflict: 'module' });
      
      if (indexResult.error) {
        console.log(`❌ Index insert failed: ${indexResult.error.message}`);
        continue;
      }

      console.log(`✅ Module ${module} indexed successfully`);
      successCount++;
      
    } catch (error) {
      console.log(`❌ Error processing ${module}:`, error.message);
      skippedCount++;
    }
  }
  
  console.log(`\n🎉 Upload complete! Success: ${successCount}, Skipped: ${skippedCount}`);
  
  // Validate results
  console.log('\n🔍 Validating index entries...');
  const { data: indexData, error: indexError } = await supabase
    .from('thandi_knowledge_index')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (indexError) {
    console.log('❌ Failed to validate index:', indexError.message);
  } else {
    console.log(`✅ Index contains ${indexData.length} entries:`);
    indexData.forEach(entry => {
      console.log(`  - ${entry.module}: ${entry.title} (${entry.tags.length} tags)`);
    });
  }
}

uploadAndIndex().then(() => {
  console.log('Upload and indexing complete.');
}).catch(console.error); 