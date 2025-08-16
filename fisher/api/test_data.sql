-- Dados de teste para cnpj_file_control
-- Simula diferentes status de arquivos CNPJ

INSERT INTO cnpj_file_control (folder, filename, file_url, file_size_bytes, last_modified, status, download_date, import_date, local_path, download_attempts, import_attempts, last_error) VALUES
-- Arquivos PENDENTES (status inicial)
('2025-08', 'CNPJ_2025_08.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-08/CNPJ_2025_08.zip', 1280000000, '2025-08-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),
('2025-07', 'CNPJ_2025_07.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-07/CNPJ_2025_07.zip', 1250000000, '2025-07-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),
('2025-06', 'CNPJ_2025_06.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-06/CNPJ_2025_06.zip', 1220000000, '2025-06-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),

-- Arquivos BAIXADOS mas não importados
('2025-05', 'CNPJ_2025_05.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-05/CNPJ_2025_05.zip', 1200000000, '2025-05-01 10:00:00', 'DOWNLOADED', '2025-08-14 15:30:00', NULL, '/app/api/data/cnpj/2025-05/CNPJ_2025_05.zip', 1, 0, NULL),
('2025-04', 'CNPJ_2025_04.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-04/CNPJ_2025_04.zip', 1180000000, '2025-04-01 10:00:00', 'DOWNLOADED', '2025-08-14 14:45:00', NULL, '/app/api/data/cnpj/2025-04/CNPJ_2025_04.zip', 1, 0, NULL),
('2025-03', 'CNPJ_2025_03.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-03/CNPJ_2025_03.zip', 1150000000, '2025-03-01 10:00:00', 'DOWNLOADED', '2025-08-14 13:20:00', NULL, '/app/api/data/cnpj/2025-03/CNPJ_2025_03.zip', 1, 0, NULL),

-- Arquivos IMPORTADOS com sucesso
('2025-02', 'CNPJ_2025_02.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-02/CNPJ_2025_02.zip', 1120000000, '2025-02-01 10:00:00', 'IMPORTED', '2025-08-14 12:15:00', '2025-08-14 12:45:00', '/app/api/data/cnpj/2025-02/CNPJ_2025_02.zip', 1, 1, NULL),
('2025-01', 'CNPJ_2025_01.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2025-01/CNPJ_2025_01.zip', 1100000000, '2025-01-01 10:00:00', 'IMPORTED', '2025-08-14 11:30:00', '2025-08-14 12:00:00', '/app/api/data/cnpj/2025-01/CNPJ_2025_01.zip', 1, 1, NULL),
('2024-12', 'CNPJ_2024_12.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-12/CNPJ_2024_12.zip', 1080000000, '2024-12-01 10:00:00', 'IMPORTED', '2025-08-14 10:45:00', '2025-08-14 11:15:00', '/app/api/data/cnpj/2024-12/CNPJ_2024_12.zip', 1, 1, NULL),

-- Arquivos com FALHA no download
('2024-11', 'CNPJ_2024_11.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-11/CNPJ_2024_11.zip', 1050000000, '2024-11-01 10:00:00', 'FAILED', NULL, NULL, NULL, 3, 0, 'Connection timeout after 30 seconds'),
('2024-10', 'CNPJ_2024_10.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-10/CNPJ_2024_10.zip', 1020000000, '2024-10-01 10:00:00', 'FAILED', NULL, NULL, NULL, 2, 0, 'HTTP 404 - File not found'),

-- Arquivos com FALHA na importação
('2024-09', 'CNPJ_2024_09.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-09/CNPJ_2024_09.zip', 1000000000, '2024-09-01 10:00:00', 'FAILED', '2025-08-14 09:30:00', NULL, '/app/api/data/cnpj/2024-09/CNPJ_2024_09.zip', 1, 2, 'Invalid ZIP file format'),
('2024-08', 'CNPJ_2024_08.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-08/CNPJ_2024_08.zip', 980000000, '2024-08-01 10:00:00', 'FAILED', '2025-08-14 08:45:00', NULL, '/app/api/data/cnpj/2024-08/CNPJ_2024_08.zip', 1, 1, 'Database connection error during import'),

-- Mais arquivos PENDENTES para testar volume
('2024-07', 'CNPJ_2024_07.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-07/CNPJ_2024_07.zip', 950000000, '2024-07-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),
('2024-06', 'CNPJ_2024_06.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-06/CNPJ_2024_06.zip', 920000000, '2024-06-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),
('2024-05', 'CNPJ_2024_05.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-05/CNPJ_2024_05.zip', 900000000, '2024-05-01 10:00:00', 'PENDING', NULL, NULL, NULL, 0, 0, NULL),

-- Arquivos mais antigos IMPORTADOS
('2024-04', 'CNPJ_2024_04.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-04/CNPJ_2024_04.zip', 880000000, '2024-04-01 10:00:00', 'IMPORTED', '2025-08-14 07:30:00', '2025-08-14 08:00:00', '/app/api/data/cnpj/2024-04/CNPJ_2024_04.zip', 1, 1, NULL),
('2024-03', 'CNPJ_2024_03.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-03/CNPJ_2024_03.zip', 850000000, '2024-03-01 10:00:00', 'IMPORTED', '2025-08-14 06:45:00', '2025-08-14 07:15:00', '/app/api/data/cnpj/2024-03/CNPJ_2024_03.zip', 1, 1, NULL),
('2024-02', 'CNPJ_2024_02.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-02/CNPJ_2024_02.zip', 820000000, '2024-02-01 10:00:00', 'IMPORTED', '2025-08-14 06:00:00', '2025-08-14 06:30:00', '/app/api/data/cnpj/2024-02/CNPJ_2024_02.zip', 1, 1, NULL),
('2024-01', 'CNPJ_2024_01.zip', 'https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/2024-01/CNPJ_2024_01.zip', 800000000, '2024-01-01 10:00:00', 'IMPORTED', '2025-08-14 05:15:00', '2025-08-14 05:45:00', '/app/api/data/cnpj/2024-01/CNPJ_2024_01.zip', 1, 1, NULL); 