import { createClient } from '@supabase/supabase-js';

// Direct execution script for knowledge base upload
const SUPABASE_URL = 'https://pensvamtfjtpsaoefblx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgzNzI5NywiZXhwIjoyMDU5NDEzMjk3fQ.5C2ffCUxF_85oNJRWXJr9_xmfnvFLl5nh6mD5qUTNQY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function simulateUpload() {
  console.log('🚀 Simulating knowledge base upload...');
  
  // Sample knowledge modules based on what I saw in the files
  const knowledgeModules = [
    {
      module: 'busary_scholarship_framework',
      title: 'Bursaries and Scholarships',
      tags: ['Bursary', 'Scholarship', 'Funding', 'NSFAS', 'Funza Lushaka', 'University', 'TVET', 'EduEasy'],
      source_links: [
        'https://www.nsfas.org.za/content/eligibility.html',
        'https://www.education.gov.za/Programmes/FunzaLushaka.aspx',
        'https://www.dhet.gov.za/SitePages/StudentFunding.aspx'
      ],
      json_path: 'busary_scholarship_framework/bursaries_scholarships.json',
      html_path: 'busary_scholarship_framework/bursaries_scholarships.html'
    },
    {
      module: 'critical_skills_framework',
      title: 'Critical and Scarce Skills List',
      tags: ['Critical Skills', 'Scarce Skills', 'Careers', 'Jobs', 'Matric', 'TVET', 'University', 'EduEasy', 'PYEI', 'DEL', 'SETA'],
      source_links: [
        'https://www.dhet.gov.za/SitePages/CriticalSkillsList.aspx',
        'https://www.labour.gov.za/labour-market-information',
        'https://www.sayouth.mobi'
      ],
      json_path: 'critical_skills_framework/critical_skills.json',
      html_path: 'critical_skills_framework/critical_skills.html'
    },
    {
      module: 'nsfas_framework',
      title: 'NSFAS Application Process',
      tags: ['NSFAS', 'Funding', 'Application', 'Financial Aid', 'Matric', 'TVET', 'University'],
      source_links: [
        'https://www.nsfas.org.za/content/eligibility.html',
        'https://www.dhet.gov.za/SitePages/StudentFunding.aspx',
        'https://www.cao.ac.za'
      ],
      json_path: 'nsfas_framework/nsfas_application.json',
      html_path: 'nsfas_framework/nsfas_application.html'
    },
    {
      module: 'tvet_framework',
      title: 'TVET College Pathways',
      tags: ['TVET', 'Vocational', 'Programs', 'Matric', 'Application', 'Careers', 'EduEasy', 'NSFAS'],
      source_links: [
        'https://www.dhet.gov.za/SitePages/TVETColleges.aspx',
        'https://www.tvetcolleges.co.za',
        'https://www.nsfas.org.za/content/eligibility.html'
      ],
      json_path: 'tvet_framework/tvet_pathways.json',
      html_path: 'tvet_framework/tvet_pathways.html'
    },
    {
      module: 'university_framework',
      title: 'University Application Guide',
      tags: ['University', 'Application', 'CAO', 'Matric', 'Programs', 'EduEasy'],
      source_links: [
        'https://www.cao.ac.za',
        'https://www.dhet.gov.za/SitePages/Universities.aspx'
      ],
      json_path: 'university_framework/university_application.json',
      html_path: 'university_framework/university_application.html'
    },
    {
      module: 'saqa_framework',
      title: 'SAQA Qualifications Framework',
      tags: ['SAQA', 'Qualifications', 'NQF', 'Recognition', 'Credits', 'EduEasy'],
      source_links: [
        'https://www.saqa.org.za',
        'https://www.saqa.org.za/nqf'
      ],
      json_path: 'saqa_framework/saqa_framework.json',
      html_path: 'saqa_framework/saqa_framework.html'
    },
    {
      module: 'nsc_framework',
      title: 'NSC (Matric) Requirements',
      tags: ['NSC', 'Matric', 'Grade 12', 'Requirements', 'University', 'TVET', 'EduEasy'],
      source_links: [
        'https://www.education.gov.za/Curriculum/NationalSeniorCertificate.aspx',
        'https://www.dbe.gov.za'
      ],
      json_path: 'nsc_framework/nsc_curriculum.json',
      html_path: 'nsc_framework/nsc_curriculum.html'
    },
    {
      module: 'seta_learnership_framework',
      title: 'SETA Learnerships and Training',
      tags: ['SETA', 'Learnership', 'Skills Development', 'Training', 'TVET', 'EduEasy'],
      source_links: [
        'https://www.ceta.org.za',
        'https://www.ewseta.org.za',
        'https://www.agriseta.co.za'
      ],
      json_path: 'seta_learnership_framework/seta_learnerships.json',
      html_path: 'seta_learnership_framework/seta_learnerships.html'
    },
    {
      module: 'rpl_framework',
      title: 'Recognition of Prior Learning (RPL)',
      tags: ['RPL', 'Recognition', 'Prior Learning', 'Portfolio', 'Assessment', 'EduEasy'],
      source_links: [
        'https://www.saqa.org.za/rpl',
        'https://www.dhet.gov.za/SitePages/RPL.aspx'
      ],
      json_path: 'rpl_framework/rpl.json',
      html_path: 'rpl_framework/rpl.html'
    },
    {
      module: 'future_trends_framework',
      title: 'Future Work Trends and Skills',
      tags: ['Future Skills', 'Industry Trends', 'Technology', 'Careers', 'Innovation', 'EduEasy'],
      source_links: [
        'https://www.weforum.org/reports/future-of-jobs-report-2023',
        'https://www.dhet.gov.za/SitePages/FutureSkills.aspx'
      ],
      json_path: 'future_trends_framework/future_work_trends.json',
      html_path: 'future_trends_framework/future_work_trends.html'
    }
  ];

  console.log(`📋 Preparing to upload ${knowledgeModules.length} knowledge modules...`);

  // Clear test entries first
  await supabase.from('thandi_knowledge_index').delete().eq('module', 'test_module');

  let successCount = 0;
  
  for (const moduleData of knowledgeModules) {
    console.log(`\n📂 Processing: ${moduleData.title}`);
    
    try {
      const { data, error } = await supabase
        .from('thandi_knowledge_index')
        .upsert(moduleData, { onConflict: 'module' });
      
      if (error) {
        console.log(`❌ Failed to index ${moduleData.module}:`, error.message);
      } else {
        console.log(`✅ Successfully indexed: ${moduleData.module}`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Error processing ${moduleData.module}:`, err.message);
    }
  }
  
  console.log(`\n🎉 Upload simulation complete! Success: ${successCount}/${knowledgeModules.length}`);
  
  // Validate final results
  const { data: finalData, error: finalError } = await supabase
    .from('thandi_knowledge_index')
    .select('module, title, tags')
    .order('module');
    
  if (finalError) {
    console.log('❌ Failed to validate:', finalError.message);
  } else {
    console.log(`\n✅ Final index contains ${finalData.length} entries:`);
    finalData.forEach(entry => {
      console.log(`  - ${entry.module}: ${entry.title} (${entry.tags.length} tags)`);
    });
  }
}

simulateUpload().catch(console.error);