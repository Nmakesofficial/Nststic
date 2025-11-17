import { useState, useEffect, useCallback } from 'react';

const RATE_LIMIT_KEY = 'nstatic-rate-limit';
const DAILY_LIMIT = 1;

interface RateLimitData {
  date: string;
  count: number;
}

export const useRateLimiter = () => {
  const [creationCount, setCreationCount] = useState<number>(0);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getTodayString();
    let data: RateLimitData = { date: today, count: 0 };
    
    try {
      const storedData = localStorage.getItem(RATE_LIMIT_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.date === today) {
          data = parsedData;
        } else {
          // Date has changed, reset count
          localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        }
      } else {
         localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to read rate limit data from localStorage", error);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    }
    
    setCreationCount(data.count);
  }, []);

  const incrementCount = useCallback(() => {
    const today = getTodayString();
    setCreationCount(prevCount => {
        const newCount = prevCount + 1;
        const data: RateLimitData = { date: today, count: newCount };
        try {
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save rate limit data to localStorage", error);
        }
        return newCount;
    });
  }, []);

  return { creationCount, limit: DAILY_LIMIT, incrementCount };
};