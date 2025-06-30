import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ILCPosTerminal } from '@/lib/api/queries/pos-terminal/schema';

export interface PosTerminalStore {
  posTerminal: ILCPosTerminal | null;
  choosenPosTerminal: (posTerminal: ILCPosTerminal) => void;
  removePosTerminal: () => void;
}

export const usePosTerminal = create<PosTerminalStore>()(
  persist(
    (set, get) => ({
      posTerminal: null,
      choosenPosTerminal: (posTerminal: ILCPosTerminal) => {
        set((state) => {
          return {
            posTerminal,
          };
        });
      },
      removePosTerminal: () => {
        {
          set((state) => ({
            posTerminal: null,
          }));
        }
      },
    }),
    {
      name: 'LangfarmTicketPosTerminal',
    }
  )
);
