import { createClient } from '@supabase/supabase-js';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

// Supabase configuration
const SUPABASE_URL = 'https://pensvamtfjtpsaoefblx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgzNzI5NywiZXhwIjoyMDU5NDEzMjk3fQ.5C2ffCUxF_85oNJRWXJr9_xmfnvFLl5nh6mD5qUTNQY';
const STORAGE_BUCKET = 'thandi-knowledge';

const baseDir = path.resolve(__dirname, '../supabase/thandi_knowledge_base');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface UploadResult {
  module: string;
  jsonUploaded: boolean;
  htmlUploaded: boolean;
  jsonPath?: string;
  htmlPath?: string;
  error?: string;
}

async function uploadKnowledgeBaseFiles() {
  console.log('🚀 Starting Thandi Knowledge Base Upload with Verification...\n');
  
  try {
    // Check if base directory exists
    await stat(baseDir);
    console.log(`📁 Base directory found: ${baseDir}`);
  } catch (error) {
    console.error(`❌ Base directory not found: ${baseDir}`);
    return;
  }

  const modules = await readdir(baseDir);
  console.log(`📂 Found ${modules.length} potential modules: ${modules.join(', ')}\n`);
  
  const uploadResults: UploadResult[] = [];
  let totalUploaded = 0;

  // Upload files for each module
  for (const module of modules) {
    const moduleDir = path.join(baseDir, module);
    
    // Skip non-directories
    const dirStat = await stat(moduleDir);
    if (!dirStat.isDirectory()) {
      console.log(`⏭️  Skipping ${module} (not a directory)`);
      continue;
    }

    console.log(`📂 Processing module: ${module}`);
    
    const result: UploadResult = {
      module,
      jsonUploaded: false,
      htmlUploaded: false
    };

    try {
      const files = await readdir(moduleDir);
      const jsonFile = files.find(f => f.endsWith('.json'));
      const htmlFile = files.find(f => f.endsWith('.html'));
      
      if (!jsonFile || !htmlFile) {
        result.error = `Missing files (json: ${jsonFile || 'none'}, html: ${htmlFile || 'none'})`;
        console.log(`⚠️  ${result.error}`);
        uploadResults.push(result);
        continue;
      }

      const jsonPath = path.join(moduleDir, jsonFile);
      const htmlPath = path.join(moduleDir, htmlFile);

      // Upload JSON file
      const storageJsonPath = `${module}/${jsonFile}`;
      console.log(`  📤 Uploading JSON: ${storageJsonPath}`);
      
      const jsonContent = await readFile(jsonPath);
      const jsonUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageJsonPath, jsonContent, {
          contentType: 'application/json',
          upsert: true,
        });
      
      if (jsonUpload.error) {
        result.error = `JSON upload failed: ${jsonUpload.error.message}`;
        console.log(`    ❌ ${result.error}`);
      } else {
        result.jsonUploaded = true;
        result.jsonPath = storageJsonPath;
        console.log(`    ✅ JSON uploaded successfully`);
        totalUploaded++;
      }

      // Upload HTML file
      const storageHtmlPath = `${module}/${htmlFile}`;
      console.log(`  📤 Uploading HTML: ${storageHtmlPath}`);
      
      const htmlContent = await readFile(htmlPath);
      const htmlUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageHtmlPath, htmlContent, {
          contentType: 'text/html',
          upsert: true,
        });
        
      if (htmlUpload.error) {
        result.error = (result.error || '') + ` HTML upload failed: ${htmlUpload.error.message}`;
        console.log(`    ❌ HTML upload failed: ${htmlUpload.error.message}`);
      } else {
        result.htmlUploaded = true;
        result.htmlPath = storageHtmlPath;
        console.log(`    ✅ HTML uploaded successfully`);
        totalUploaded++;
      }

    } catch (error) {
      result.error = `Processing error: ${error.message}`;
      console.log(`  ❌ ${result.error}`);
    }

    uploadResults.push(result);
    console.log('');
  }

  console.log(`📊 Upload Summary: ${totalUploaded} files uploaded\n`);

  // VERIFICATION PHASE
  console.log('🔍 VERIFICATION PHASE - Listing Supabase Storage Contents...\n');
  
  // List all files in the bucket
  const { data: bucketFiles, error: listError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });

  if (listError) {
    console.error(`❌ Failed to list bucket contents: ${listError.message}`);
    return;
  }

  if (!bucketFiles || bucketFiles.length === 0) {
    console.log(`⚠️  Bucket '${STORAGE_BUCKET}' is empty!`);
    return;
  }

  console.log(`📋 Found ${bucketFiles.length} items in bucket '${STORAGE_BUCKET}':`);
  
  // List folders first
  const folders = bucketFiles.filter(item => !item.name.includes('.'));
  const files = bucketFiles.filter(item => item.name.includes('.'));
  
  if (folders.length > 0) {
    console.log('\n📁 Folders:');
    folders.forEach(folder => {
      console.log(`  - ${folder.name}/`);
    });
  }

  if (files.length > 0) {
    console.log('\n📄 Files:');
    files.forEach(file => {
      console.log(`  - ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
    });
  }

  // Detailed verification per module
  console.log('\n🔍 MODULE VERIFICATION:\n');
  
  for (const result of uploadResults) {
    console.log(`📦 Module: ${result.module}`);
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
      continue;
    }

    // Check if module folder exists
    const moduleFiles = bucketFiles.filter(item => item.name.startsWith(result.module + '/'));
    
    if (moduleFiles.length === 0) {
      console.log(`  ❌ No files found in storage for module ${result.module}`);
      continue;
    }

    // Verify JSON file
    const jsonFileInStorage = moduleFiles.find(item => item.name.endsWith('.json'));
    if (jsonFileInStorage) {
      console.log(`  ✅ JSON file confirmed: ${jsonFileInStorage.name}`);
      
      // Test file accessibility
      const { data: jsonData, error: jsonError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(jsonFileInStorage.name);
      
      if (jsonError) {
        console.log(`    ⚠️  JSON file not accessible: ${jsonError.message}`);
      } else {
        console.log(`    ✅ JSON file accessible (${jsonData.size} bytes)`);
      }
    } else {
      console.log(`  ❌ JSON file missing in storage`);
    }

    // Verify HTML file
    const htmlFileInStorage = moduleFiles.find(item => item.name.endsWith('.html'));
    if (htmlFileInStorage) {
      console.log(`  ✅ HTML file confirmed: ${htmlFileInStorage.name}`);
      
      // Test file accessibility
      const { data: htmlData, error: htmlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(htmlFileInStorage.name);
      
      if (htmlError) {
        console.log(`    ⚠️  HTML file not accessible: ${htmlError.message}`);
      } else {
        console.log(`    ✅ HTML file accessible (${htmlData.size} bytes)`);
      }
    } else {
      console.log(`  ❌ HTML file missing in storage`);
    }

    console.log('');
  }

  // Final verification summary
  const successfulModules = uploadResults.filter(r => r.jsonUploaded && r.htmlUploaded);
  const failedModules = uploadResults.filter(r => !r.jsonUploaded || !r.htmlUploaded);

  console.log('📊 FINAL VERIFICATION SUMMARY:');
  console.log(`✅ Successful modules: ${successfulModules.length}`);
  successfulModules.forEach(m => console.log(`  - ${m.module}`));
  
  if (failedModules.length > 0) {
    console.log(`❌ Failed modules: ${failedModules.length}`);
    failedModules.forEach(m => console.log(`  - ${m.module}: ${m.error || 'Unknown error'}`));
  }

  console.log(`\n🎉 Upload and verification complete!`);
  console.log(`📈 Total files in storage: ${bucketFiles.length}`);
  console.log(`✅ Successfully uploaded and verified: ${successfulModules.length * 2} files`);
}

// Execute the upload
uploadKnowledgeBaseFiles()
  .then(() => console.log('\n🏁 Process completed.'))
  .catch(error => console.error('\n💥 Process failed:', error));