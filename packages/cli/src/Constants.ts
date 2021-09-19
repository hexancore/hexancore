import path from 'path';

export const CLI_ROOT_DIR = path.dirname(__dirname);
export const PROJECT_ROOT_DIR = process.cwd();
export const PROJECT_SRC_DIR = path.join(PROJECT_ROOT_DIR, 'src');
