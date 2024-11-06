import { useCallback, useMemo, useState } from 'react';
export const useLoadingTracker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const ltrack = useCallback(
    <TArgs extends unknown[], TResult>(action: (...args: TArgs) => TResult) => {
      return async (...args: TArgs) => {
        try {
          setIsLoading(true);
          const res = await action(...args);
          return res;
        } finally {
          setIsLoading(false);
        }
      };
    },
    [setIsLoading]
  );
  return useMemo(
    () => ({
      ltrack,
      isLoading
    }),
    [isLoading, ltrack]
  );
};

export const useLoadingTrackerForList = () => {
  const [loadingData, setLoadingData] = useState<Record<string, boolean>>({});
  const ltrack = useCallback(
    <TArgs extends unknown[], TResult>(id: string, action: (...args: TArgs) => TResult) => {
      return async (...args: TArgs) => {
        try {
          setLoadingData({ ...loadingData, [id]: true });
          const res = await action(...args);
          return res;
        } finally {
          setLoadingData(
            Object.fromEntries(Object.entries(loadingData).filter(([key]) => key !== id))
          );
        }
      };
    },
    [setLoadingData, loadingData]
  );
  return useMemo(
    () => ({
      ltrack,
      loadingData
    }),
    [loadingData, ltrack]
  );
};
