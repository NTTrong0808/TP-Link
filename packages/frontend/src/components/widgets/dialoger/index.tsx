'use client';

import { createContext, ReactNode, useContext } from 'react';
import { create } from 'zustand';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { cn } from '@/lib/tw';

const createDialogerId = () => Math.random().toString(36).substring(2, 15);

export interface DialogerProperty {
  id: string;
  title?: string;
  variant: 'dialog';
  content: ReactNode;
  disableCloseOutside?: boolean;
  hideXIcon?: boolean;
}

export interface DialogerState {
  dialogs: DialogerProperty[];

  addDialoger: (dialog: Omit<DialogerProperty, 'id'>) => void;
  closeDialogerByIndex: (index: number) => void;
  closeDialogerById: (id: string) => void;
  closeAllDialoger: () => void;
}

export const useDialoger = create<DialogerState>((set) => ({
  dialogs: [],

  addDialoger: (dialog) => {
    set((state) => ({
      dialogs: [...state.dialogs, { ...dialog, id: createDialogerId() }],
    }));
  },

  closeDialogerByIndex: (index) => {
    set((state) => ({
      dialogs: state.dialogs.filter((d, i) => i !== index),
    }));
  },

  closeDialogerById: (id) => {
    set((state) => ({
      ...state,
      dialogs: state.dialogs.filter((d) => d.id !== id),
    }));
  },

  closeAllDialoger() {
    set((state) => ({
      ...state,
      dialogs: [],
    }));
  },
}));

export interface DialogContextState {
  dialog: DialogerProperty;

  close: () => void;
}

export const DialogContext = createContext<DialogContextState>(
  {} as DialogContextState
);

export const useDialogContext = () => {
  const ctx = useContext(DialogContext);

  if (!ctx) {
    throw new Error(
      'useDialogContext must be used within a DialogContext.Provider'
    );
  }

  return ctx;
};

export interface DialogerProps {}

export const Dialoger = (props: DialogerProps) => {
  const { dialogs, closeDialogerById } = useDialoger();

  return dialogs.map((dialog, index) => (
    <DialogContext.Provider
      key={dialog.id}
      value={{ dialog, close: () => closeDialogerById(dialog.id) }}
    >
      <Dialog
        open
        onOpenChange={(open) => (!open ? closeDialogerById(dialog.id) : null)}
      >
        <DialogContent
          {...(dialog.disableCloseOutside
            ? {
                onInteractOutside: (e) => {
                  e.preventDefault();
                },
              }
            : {})}
          className={cn('', dialog?.hideXIcon && '[&>button]:hidden')}
        >
          {dialog.title ? (
            <DialogHeader className='mb-4'>
              <DialogTitle>{dialog.title}</DialogTitle>
            </DialogHeader>
          ) : null}

          {dialog.content}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  ));
};
