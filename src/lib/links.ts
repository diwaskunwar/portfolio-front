/** Shared external links, kept in one place so they cannot drift apart. */

const RESUME_FILE_ID = '1nQBhjBfv3r36OhWtKwUjcZeb59i0bap2';

/**
 * Direct download. Google responds with
 * `content-disposition: attachment; filename="resume.pdf"`, so this saves the
 * file rather than opening the Drive viewer.
 */
export const RESUME_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${RESUME_FILE_ID}`;

/** Drive preview, for reading it in the browser without downloading. */
export const RESUME_VIEW_URL = `https://drive.google.com/file/d/${RESUME_FILE_ID}/view`;

export const GITHUB_URL = 'https://github.com/diwaskunwar';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/diwas-kunwar/';
export const HUGGINGFACE_URL = 'https://huggingface.co/diwaskunwar10';
export const EMAIL = 'diwas.kuwar@gmail.com';
export const EMAIL_URL = `mailto:${EMAIL}`;
