export default function checkEnvironment(): string {
  const envUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://digital-supremacy-task-boards.vercel.app';

  return envUrl;
}
