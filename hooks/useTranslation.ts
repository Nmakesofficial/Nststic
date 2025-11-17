import { useState, useEffect, useCallback } from 'react';

const defaultLanguage = 'ar';

export const useTranslation = () => {
  // Set initial language directly to Arabic, ignoring browser settings.
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Use relative path for fetching JSON to make it work reliably on hosting
        const response = await fetch(`./locales/${language}.json`);
        if (!response.ok) {
          throw new Error('Failed to load translations');
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for ${language}, falling back to English.`);
        // Fallback to English if the desired language file is not found or fails to load
        if (language !== 'en') {
            try {
                const response = await fetch(`./locales/en.json`);
                if (response.ok) {
                    const data = await response.json();
                    setTranslations(data);
                } else {
                    throw new Error('Fallback translation also failed');
                }
            } catch (fallbackError) {
                console.error(`Could not load fallback English translations.`);
            }
        }
      }
    };

    fetchTranslations();
  }, [language]);

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    let translation = translations[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{{${placeholder}}}`, replacements[placeholder]);
        });
    }
    return translation;
  }, [translations]);

  return { t, language, setLanguage };
};
