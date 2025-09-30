-- CBT Platform Migration Script
-- Run this after setting up your cloud database and running `npm run db:push`

-- Insert Admin Data
INSERT INTO admins (id, admin_id, email, password, first_name, last_name, created_at, updated_at) VALUES 
('ef3832b9-1a71-4fa6-9c6d-1f7ad4981eae', 'ADM001', 'admin@cbtplatform.com', '$2b$10$7jDggXlipR.iUAd221YPsOoArnkYJ77Ro6RXwd0hFa2QWEfWbGmbS', 'System', 'Administrator', '2025-09-08 13:44:01.358054', '2025-09-08 13:44:01.358054')
ON CONFLICT (id) DO NOTHING;

-- Insert Courses
INSERT INTO courses (id, name, description, duration, is_active, created_at, updated_at) VALUES 
('fe42dbd2-d5d8-4b6b-8b11-02e42080d43c', 'Mathematics', 'Basic mathematics and algebra concepts', 45, true, '2025-09-08 13:44:13.700075', '2025-09-08 13:44:13.700075'),
('b984c28b-411e-4381-b1e7-fcb47339f173', 'Physics', 'Introduction to physics principles and laws', 60, true, '2025-09-08 13:44:13.700075', '2025-09-08 13:44:13.700075'),
('cd45cc8b-70bb-4b14-b265-2d469875688e', 'Chemistry', 'Fundamental chemistry concepts and reactions', 50, true, '2025-09-08 13:44:13.700075', '2025-09-08 13:44:13.700075'),
('2958304e-83b4-4cc9-8dd2-1a281238eb14', 'Biology', 'Basic biological concepts and life sciences', 55, true, '2025-09-08 13:44:13.700075', '2025-09-08 13:44:13.700075')
ON CONFLICT (id) DO NOTHING;

-- Insert Questions
INSERT INTO questions (id, course_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, created_at, updated_at) VALUES 
-- Mathematics Questions
('dbf6275e-f8ae-4f2f-946a-8b42bf9e19e4', 'fe42dbd2-d5d8-4b6b-8b11-02e42080d43c', 'What is 2 + 2?', '3', '4', '5', '6', 'B', 'easy', '2025-09-08 13:44:35.263491', '2025-09-08 13:44:35.263491'),
('4a521d25-cc1a-42f4-8f80-2401a5f32c31', 'fe42dbd2-d5d8-4b6b-8b11-02e42080d43c', 'Solve for x: 2x + 4 = 10', 'x = 2', 'x = 3', 'x = 4', 'x = 5', 'B', 'medium', '2025-09-08 13:44:35.263491', '2025-09-08 13:44:35.263491'),
('a9858218-fd8f-4723-a35a-4ec6fee40ed5', 'fe42dbd2-d5d8-4b6b-8b11-02e42080d43c', 'What is the derivative of x²?', 'x', '2x', 'x³', '2x²', 'B', 'hard', '2025-09-08 13:44:35.263491', '2025-09-08 13:44:35.263491'),

-- Physics Questions  
('0638c8c9-47f3-473d-b393-24f72d4c1ca7', 'b984c28b-411e-4381-b1e7-fcb47339f173', 'What is the unit of force?', 'Joule', 'Newton', 'Watt', 'Pascal', 'B', 'easy', '2025-09-08 13:44:38.155345', '2025-09-08 13:44:38.155345'),
('d45ad648-0886-4cf9-8677-bdde6b2f1ae5', 'b984c28b-411e-4381-b1e7-fcb47339f173', 'According to Newton''s second law, F =', 'mv', 'ma', 'mg', 'mv²', 'B', 'medium', '2025-09-08 13:44:38.155345', '2025-09-08 13:44:38.155345'),
('79026543-b3f1-4b5d-a41f-598598941e9d', 'b984c28b-411e-4381-b1e7-fcb47339f173', 'The speed of light in vacuum is approximately', '3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s', 'A', 'medium', '2025-09-08 13:44:38.155345', '2025-09-08 13:44:38.155345'),

-- Chemistry Questions
('696fa4eb-803c-4fdb-a6d6-173ee2a9502d', 'cd45cc8b-70bb-4b14-b265-2d469875688e', 'What is the chemical symbol for water?', 'H₂O', 'CO₂', 'NaCl', 'O₂', 'A', 'easy', '2025-09-08 13:44:40.109442', '2025-09-08 13:44:40.109442'),
('4abe0cdf-2893-4ff7-ab5f-f60c10c68177', 'cd45cc8b-70bb-4b14-b265-2d469875688e', 'How many protons does a carbon atom have?', '4', '6', '8', '12', 'B', 'medium', '2025-09-08 13:44:40.109442', '2025-09-08 13:44:40.109442'),
('ff055f62-ad7f-4cb6-a152-657645cc8e8b', 'cd45cc8b-70bb-4b14-b265-2d469875688e', 'What type of bond forms between sodium and chlorine?', 'Covalent', 'Ionic', 'Metallic', 'Hydrogen', 'B', 'medium', '2025-09-08 13:44:40.109442', '2025-09-08 13:44:40.109442'),

-- Biology Questions
('2401627d-2d31-4ae3-b997-85fcacae20d5', '2958304e-83b4-4cc9-8dd2-1a281238eb14', 'What is the basic unit of life?', 'Tissue', 'Organ', 'Cell', 'Organism', 'C', 'easy', '2025-09-08 13:44:43.37886', '2025-09-08 13:44:43.37886'),
('68cf788d-d400-4271-a168-4db8885bdee3', '2958304e-83b4-4cc9-8dd2-1a281238eb14', 'Which organelle is known as the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast', 'B', 'medium', '2025-09-08 13:44:43.37886', '2025-09-08 13:44:43.37886'),
('9cf45874-187f-4572-9d15-2b78eae08c56', '2958304e-83b4-4cc9-8dd2-1a281238eb14', 'DNA stands for', 'Deoxyribonucleic Acid', 'Dinitrogen Acid', 'Dextrose Nucleic Acid', 'Direct Nuclear Acid', 'A', 'medium', '2025-09-08 13:44:43.37886', '2025-09-08 13:44:43.37886')
ON CONFLICT (id) DO NOTHING;