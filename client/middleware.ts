import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: true,
});

export const config = {
  matcher: [
    '/',
    '/(uk|en|pl)(/.*)?',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};
