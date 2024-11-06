import { useQuery } from '@tanstack/react-query';
import { getChatInteraction } from './chatQuery';
import { DialogStep } from 'globalTypes';

export const useChatInteraction = (interactionId: string, step: string) =>
  useQuery(
    ['chatTransactions', interactionId, step],
    async () => await getChatInteraction(interactionId),
    {
      initialData: 0,
      enabled: step === DialogStep.END
    }
  );
