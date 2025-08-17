-- Phase 2: Insert knowledge modules into thandi_knowledge_index

-- Clear any test data first
DELETE FROM public.thandi_knowledge_index WHERE module = 'test_module';

-- Insert the 10 knowledge modules with their metadata
INSERT INTO public.thandi_knowledge_index (module, title, tags, source_links, json_path, html_path) VALUES
('bursary_scholarship_framework', 'Bursaries and Scholarships', 
 ARRAY['Bursary', 'Scholarship', 'Funding', 'NSFAS', 'Funza Lushaka', 'University', 'TVET', 'EduEasy'],
 ARRAY['https://www.nsfas.org.za/content/eligibility.html', 'https://www.education.gov.za/Programmes/FunzaLushaka.aspx', 'https://www.dhet.gov.za/SitePages/StudentFunding.aspx'],
 'bursary_scholarship_framework/bursaries_scholarships.json',
 'bursary_scholarship_framework/bursaries_scholarships.html'),

('critical_skills_framework', 'Critical and Scarce Skills List',
 ARRAY['Critical Skills', 'Scarce Skills', 'Careers', 'Jobs', 'Matric', 'TVET', 'University', 'EduEasy', 'PYEI', 'DEL', 'SETA'],
 ARRAY['https://www.dhet.gov.za/SitePages/CriticalSkillsList.aspx', 'https://www.labour.gov.za/labour-market-information', 'https://www.sayouth.mobi'],
 'critical_skills_framework/critical_skills.json',
 'critical_skills_framework/critical_skills.html'),

('nsfas_framework', 'NSFAS Application Process',
 ARRAY['NSFAS', 'Funding', 'Application', 'Financial Aid', 'Matric', 'TVET', 'University'],
 ARRAY['https://www.nsfas.org.za/content/eligibility.html', 'https://www.dhet.gov.za/SitePages/StudentFunding.aspx', 'https://www.cao.ac.za'],
 'nsfas_framework/nsfas_application.json',
 'nsfas_framework/nsfas_application.html'),

('tvet_framework', 'TVET College Pathways',
 ARRAY['TVET', 'Vocational', 'Programs', 'Matric', 'Application', 'Careers', 'EduEasy', 'NSFAS'],
 ARRAY['https://www.dhet.gov.za/SitePages/TVETColleges.aspx', 'https://www.tvetcolleges.co.za', 'https://www.nsfas.org.za/content/eligibility.html'],
 'tvet_framework/tvet_pathways.json',
 'tvet_framework/tvet_pathways.html'),

('university_framework', 'University Application Guide',
 ARRAY['University', 'Application', 'CAO', 'Matric', 'Programs', 'EduEasy'],
 ARRAY['https://www.cao.ac.za', 'https://www.dhet.gov.za/SitePages/Universities.aspx'],
 'university_framework/university_application.json',
 'university_framework/university_application.html'),

('saqa_framework', 'SAQA Qualifications Framework',
 ARRAY['SAQA', 'Qualifications', 'NQF', 'Recognition', 'Credits', 'EduEasy'],
 ARRAY['https://www.saqa.org.za', 'https://www.saqa.org.za/nqf'],
 'saqa_framework/saqa_framework.json',
 'saqa_framework/saqa_framework.html'),

('nsc_framework', 'NSC (Matric) Requirements',
 ARRAY['NSC', 'Matric', 'Grade 12', 'Requirements', 'University', 'TVET', 'EduEasy'],
 ARRAY['https://www.education.gov.za/Curriculum/NationalSeniorCertificate.aspx', 'https://www.dbe.gov.za'],
 'nsc_framework/nsc_curriculum.json',
 'nsc_framework/nsc_curriculum.html'),

('seta_learnership_framework', 'SETA Learnerships and Training',
 ARRAY['SETA', 'Learnership', 'Skills Development', 'Training', 'TVET', 'EduEasy'],
 ARRAY['https://www.ceta.org.za', 'https://www.ewseta.org.za', 'https://www.agriseta.co.za'],
 'seta_learnership_framework/seta_learnerships.json',
 'seta_learnership_framework/seta_learnerships.html'),

('rpl_framework', 'Recognition of Prior Learning (RPL)',
 ARRAY['RPL', 'Recognition', 'Prior Learning', 'Portfolio', 'Assessment', 'EduEasy'],
 ARRAY['https://www.saqa.org.za/rpl', 'https://www.dhet.gov.za/SitePages/RPL.aspx'],
 'rpl_framework/rpl.json',
 'rpl_framework/rpl.html'),

('future_trends_framework', 'Future Work Trends and Skills',
 ARRAY['Future Skills', 'Industry Trends', 'Technology', 'Careers', 'Innovation', 'EduEasy'],
 ARRAY['https://www.weforum.org/reports/future-of-jobs-report-2023', 'https://www.dhet.gov.za/SitePages/FutureSkills.aspx'],
 'future_trends_framework/future_work_trends.json',
 'future_trends_framework/future_work_trends.html')

ON CONFLICT (module) DO UPDATE SET
  title = EXCLUDED.title,
  tags = EXCLUDED.tags,
  source_links = EXCLUDED.source_links,
  json_path = EXCLUDED.json_path,
  html_path = EXCLUDED.html_path,
  updated_at = now();