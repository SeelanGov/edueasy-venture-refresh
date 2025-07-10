const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const SUPABASE_URL = 'https://pensvamtfjtpsaoefblx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgzNzI5NywiZXhwIjoyMDU5NDEzMjk3fQ.5C2ffCUxF_85oNJRWXJr9_xmfnvFLl5nh6mD5qUTNQY';
const STORAGE_BUCKET = 'thandi-knowledge';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Knowledge modules based on the actual files we found
const knowledgeModules = [
  {
    module: 'bursary_scholarship_framework',
    jsonContent: {
      "id": "edu_bursaries_scholarships",
      "title": "Bursaries and Scholarships",
      "language": "en",
      "summary": "Find bursaries and scholarships for South African students with EduEasy.",
      "tags": ["Bursary", "Scholarship", "Funding", "NSFAS", "Funza Lushaka", "University", "TVET", "EduEasy"],
      "source_links": [
        "https://www.nsfas.org.za/content/eligibility.html",
        "https://www.education.gov.za/Programmes/FunzaLushaka.aspx",
        "https://www.dhet.gov.za/SitePages/StudentFunding.aspx"
      ]
    },
    htmlContent: '<h1>Bursaries and Scholarships</h1><p>Comprehensive guide to funding opportunities in South Africa.</p>'
  },
  {
    module: 'critical_skills_framework',
    jsonContent: {
      "id": "edu_critical_skills",
      "title": "Critical and Scarce Skills List",
      "language": "en",
      "summary": "Discover South Africa's high-demand careers with EduEasy.",
      "tags": ["Critical Skills", "Scarce Skills", "Careers", "Jobs", "Matric", "TVET", "University", "EduEasy"],
      "source_links": [
        "https://www.dhet.gov.za/SitePages/CriticalSkillsList.aspx",
        "https://www.labour.gov.za/labour-market-information"
      ]
    },
    htmlContent: '<h1>Critical and Scarce Skills</h1><p>Explore high-demand career opportunities in South Africa.</p>'
  },
  {
    module: 'future_trends_framework',
    jsonContent: {
      "id": "edu_future_work_trends",
      "title": "Future Work Trends",
      "language": "en",
      "summary": "Explore South Africa's future job trends with EduEasy.",
      "tags": ["Future Trends", "Careers", "Skills", "Green Economy", "AI", "Healthcare", "EduEasy"],
      "source_links": [
        "https://www.dhet.gov.za/SitePages/FutureSkills.aspx",
        "https://www.labour.gov.za/labour-market-information"
      ]
    },
    htmlContent: '<h1>Future Work Trends</h1><p>Prepare for emerging career opportunities and industry changes.</p>'
  },
  {
    module: 'nsc_framework',
    jsonContent: {
      "id": "edu_nsc_curriculum",
      "title": "National Senior Certificate (NSC) Curriculum",
      "language": "en",
      "summary": "The National Senior Certificate (NSC) is your Matric qualification.",
      "tags": ["NSC", "Matric", "Curriculum", "Subjects", "Education", "DBE"],
      "source_links": [
        "https://www.education.gov.za/Curriculum/NationalCurriculumStatementGradesR-12.aspx"
      ]
    },
    htmlContent: '<h1>NSC Curriculum</h1><p>Complete guide to Matric requirements and subjects.</p>'
  },
  {
    module: 'nsfas_framework',
    jsonContent: {
      "id": "edu_nsfas_application",
      "title": "NSFAS Application Process",
      "language": "en",
      "summary": "The National Student Financial Aid Scheme (NSFAS) provides funding for South African students.",
      "tags": ["NSFAS", "Funding", "Application", "Financial Aid", "Matric", "TVET", "University"],
      "source_links": [
        "https://www.nsfas.org.za/content/eligibility.html",
        "https://www.dhet.gov.za/SitePages/StudentFunding.aspx"
      ]
    },
    htmlContent: '<h1>NSFAS Application</h1><p>Step-by-step guide to applying for NSFAS funding.</p>'
  },
  {
    module: 'rpl_framework',
    jsonContent: {
      "id": "edu_rpl",
      "title": "Recognition of Prior Learning (RPL)",
      "language": "en",
      "summary": "Discover Recognition of Prior Learning (RPL) with EduEasy.",
      "tags": ["RPL", "Prior Learning", "Qualifications", "Experience", "SAQA", "SETA", "EduEasy"],
      "source_links": [
        "https://www.saqa.org.za/recognition-prior-learning-rpl",
        "https://www.dhet.gov.za/SitePages/RPL.aspx"
      ]
    },
    htmlContent: '<h1>Recognition of Prior Learning</h1><p>Turn your experience into formal qualifications.</p>'
  },
  {
    module: 'saqa_framework',
    jsonContent: {
      "id": "edu_saqa_framework",
      "title": "SAQA National Qualifications Framework (NQF)",
      "language": "en",
      "summary": "The National Qualifications Framework (NQF) organizes South African qualifications.",
      "tags": ["SAQA", "NQF", "Qualifications", "Education", "Career Planning"],
      "source_links": [
        "https://www.saqa.org.za/national-qualifications-framework",
        "https://www.dhet.gov.za/SitePages/NQF.aspx"
      ]
    },
    htmlContent: '<h1>SAQA Qualifications Framework</h1><p>Understanding the NQF levels and qualification pathways.</p>'
  },
  {
    module: 'seta_learnership_framework',
    jsonContent: {
      "id": "edu_seta_learnerships",
      "title": "SETA Learnerships",
      "language": "en",
      "summary": "Explore SETA learnerships with EduEasy.",
      "tags": ["SETA", "Learnership", "Training", "Careers", "Jobs", "Matric", "EduEasy"],
      "source_links": [
        "https://www.serviceseta.org.za/learnerships",
        "https://www.ceta.org.za/learnerships"
      ]
    },
    htmlContent: '<h1>SETA Learnerships</h1><p>Practical training programs for career development.</p>'
  },
  {
    module: 'tvet_framework',
    jsonContent: {
      "id": "edu_tvet_pathways",
      "title": "TVET College Pathways",
      "language": "en",
      "summary": "Explore Technical and Vocational Education and Training (TVET) colleges with EduEasy.",
      "tags": ["TVET", "Vocational", "Programs", "Matric", "Application", "Careers", "EduEasy"],
      "source_links": [
        "https://www.dhet.gov.za/SitePages/TVETColleges.aspx",
        "https://www.tvetcolleges.co.za"
      ]
    },
    htmlContent: '<h1>TVET Pathways</h1><p>Technical and vocational education opportunities.</p>'
  },
  {
    module: 'university_framework',
    jsonContent: {
      "id": "edu_university_application",
      "title": "University Application Guide",
      "language": "en",
      "summary": "Apply to South African universities with EduEasy's help.",
      "tags": ["University", "Application", "CAO", "APS", "Matric", "Higher Education"],
      "source_links": [
        "https://www.cao.ac.za",
        "https://www.dhet.gov.za/SitePages/UniversityEducation.aspx"
      ]
    },
    htmlContent: '<h1>University Applications</h1><p>Complete guide to university applications in South Africa.</p>'
  }
];

async function uploadKnowledgeBase() {
  console.log('🚀 Starting Thandi Knowledge Base Upload with Verification...\n');
  
  let totalUploaded = 0;
  const results = [];

  // Upload each module's files
  for (const moduleData of knowledgeModules) {
    console.log(`📂 Processing module: ${moduleData.module}`);
    
    try {
      // Upload JSON file
      const jsonPath = `${moduleData.module}/${moduleData.module.replace('_framework', '')}.json`;
      console.log(`  📤 Uploading JSON: ${jsonPath}`);
      
      const jsonUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(jsonPath, JSON.stringify(moduleData.jsonContent, null, 2), {
          contentType: 'application/json',
          upsert: true,
        });
      
      if (jsonUpload.error) {
        console.log(`    ❌ JSON upload failed: ${jsonUpload.error.message}`);
        results.push({ module: moduleData.module, success: false, error: jsonUpload.error.message });
        continue;
      } else {
        console.log(`    ✅ JSON uploaded successfully`);
        totalUploaded++;
      }

      // Upload HTML file
      const htmlPath = `${moduleData.module}/${moduleData.module.replace('_framework', '')}.html`;
      console.log(`  📤 Uploading HTML: ${htmlPath}`);
      
      const htmlUpload = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(htmlPath, moduleData.htmlContent, {
          contentType: 'text/html',
          upsert: true,
        });
        
      if (htmlUpload.error) {
        console.log(`    ❌ HTML upload failed: ${htmlUpload.error.message}`);
        results.push({ module: moduleData.module, success: false, error: htmlUpload.error.message });
      } else {
        console.log(`    ✅ HTML uploaded successfully`);
        totalUploaded++;
        results.push({ module: moduleData.module, success: true });
      }

    } catch (error) {
      console.log(`  ❌ Error processing ${moduleData.module}: ${error.message}`);
      results.push({ module: moduleData.module, success: false, error: error.message });
    }

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
  
  // List all items with details
  bucketFiles.forEach(item => {
    const size = item.metadata?.size ? `(${item.metadata.size} bytes)` : '(unknown size)';
    console.log(`  - ${item.name} ${size}`);
  });

  // MODULE-SPECIFIC VERIFICATION
  console.log('\n🔍 MODULE VERIFICATION:\n');
  
  for (const moduleData of knowledgeModules) {
    console.log(`📦 Module: ${moduleData.module}`);
    
    // Check for both JSON and HTML files
    const jsonFileName = `${moduleData.module}/${moduleData.module.replace('_framework', '')}.json`;
    const htmlFileName = `${moduleData.module}/${moduleData.module.replace('_framework', '')}.html`;
    
    const jsonFileExists = bucketFiles.find(item => item.name === jsonFileName);
    const htmlFileExists = bucketFiles.find(item => item.name === htmlFileName);
    
    if (jsonFileExists) {
      console.log(`  ✅ JSON file confirmed: ${jsonFileName}`);
      
      // Test accessibility
      const { data: jsonData, error: jsonError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(jsonFileName);
      
      if (jsonError) {
        console.log(`    ⚠️  JSON file not accessible: ${jsonError.message}`);
      } else {
        console.log(`    ✅ JSON file accessible (${jsonData.size} bytes)`);
      }
    } else {
      console.log(`  ❌ JSON file missing: ${jsonFileName}`);
    }

    if (htmlFileExists) {
      console.log(`  ✅ HTML file confirmed: ${htmlFileName}`);
      
      // Test accessibility
      const { data: htmlData, error: htmlError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(htmlFileName);
      
      if (htmlError) {
        console.log(`    ⚠️  HTML file not accessible: ${htmlError.message}`);
      } else {
        console.log(`    ✅ HTML file accessible (${htmlData.size} bytes)`);
      }
    } else {
      console.log(`  ❌ HTML file missing: ${htmlFileName}`);
    }

    console.log('');
  }

  // FINAL SUMMARY
  const successfulUploads = results.filter(r => r.success);
  const failedUploads = results.filter(r => !r.success);

  console.log('📊 FINAL VERIFICATION SUMMARY:');
  console.log(`✅ Successfully uploaded modules: ${successfulUploads.length}`);
  successfulUploads.forEach(r => console.log(`  - ${r.module}`));
  
  if (failedUploads.length > 0) {
    console.log(`❌ Failed uploads: ${failedUploads.length}`);
    failedUploads.forEach(r => console.log(`  - ${r.module}: ${r.error}`));
  }

  console.log(`\n🎉 Upload and verification complete!`);
  console.log(`📈 Total files in storage: ${bucketFiles.length}`);
  console.log(`✅ Successfully uploaded and verified: ${successfulUploads.length * 2} files`);

  // Verify database index matches storage files
  console.log('\n🔍 DATABASE INDEX VERIFICATION:');
  const { data: indexData, error: indexError } = await supabase
    .from('thandi_knowledge_index')
    .select('module, json_path, html_path');
    
  if (indexError) {
    console.log('❌ Failed to query knowledge index:', indexError.message);
  } else {
    console.log(`📋 Database has ${indexData.length} indexed modules:`);
    indexData.forEach(entry => {
      const jsonExists = bucketFiles.find(f => f.name === entry.json_path);
      const htmlExists = bucketFiles.find(f => f.name === entry.html_path);
      const status = (jsonExists && htmlExists) ? '✅' : '❌';
      console.log(`  ${status} ${entry.module} (JSON: ${jsonExists ? '✅' : '❌'}, HTML: ${htmlExists ? '✅' : '❌'})`);
    });
  }
}

// Execute the upload
uploadKnowledgeBase()
  .then(() => console.log('\n🏁 Knowledge base upload and verification completed.'))
  .catch(error => console.error('\n💥 Process failed:', error));