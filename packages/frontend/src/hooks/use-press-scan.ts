'use client'

import { useMemo, useRef } from 'react'
import { useEvent } from 'react-use'

const usePressScan = ({ onEnter }: { onEnter?: (value: string) => void }) => {
  const valueRef = useRef('')
  const isScanningRef = useRef(false)
  const scanBufferRef = useRef('')
  const scanTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const specialKeys = useMemo(
    () =>
      new Set([
        // Navigation keys
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Insert',
        'Delete',

        // Function keys
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'PrintScreen',
        'ScrollLock',
        'Pause',
        'Break',

        // Control keys
        'Shift',
        'Control',
        'Ctrl',
        'Alt',
        'Meta',
        'AltGr',
        'CapsLock',
        'NumLock',
        'Windows',
        'Command',
        'Option',
        'Fn',

        // Special keys
        'Escape',
        'Esc',
        'Tab',
        'Backspace',
        'Enter',
        'Return',
        'Space',
        'ContextMenu',
        'Menu',
        'Apps',
        'BrowserBack',
        'BrowserForward',
        'BrowserRefresh',
        'BrowserStop',
        'BrowserSearch',
        'BrowserFavorites',
        'BrowserHome',
        'VolumeMute',
        'VolumeDown',
        'VolumeUp',
        'MediaTrackNext',
        'MediaTrackPrevious',
        'MediaStop',
        'MediaPlayPause',
        'LaunchMail',
        'LaunchMediaPlayer',
        'LaunchApp1',
        'LaunchApp2',

        // Special characters
        // "~",
        // "!",
        // "@",
        // "#",
        // "$",
        // "%",
        // "^",
        // "&",
        // "*",
        // "(",
        // ")",
        // "_",
        // "+",
        // "{",
        // "}",
        // "[",
        // "]",
        // "|",
        // "\\",
        // ":",
        // '"',
        // ";",
        // "'",
        // "<",
        // ">",
        // "?",
        // ",",
        // ".",
        // "/",
        // "`",
        // "-",
        // "=",
      ]),
    [],
  )

  const handlePressScan = (evt: Event & Partial<KeyboardEvent>) => {
    if (evt.key === 'Unidentified' || evt.key === 'Enter') {
      if (evt.key === 'Enter') {
        if (scanBufferRef.current) {
          valueRef.current = scanBufferRef.current
          onEnter?.(scanBufferRef.current)
        }
        valueRef.current = ''
        isScanningRef.current = false
        scanBufferRef.current = ''
      }
      return
    }

    // Filter out special keys
    if (specialKeys.has(evt.key as string)) {
      return
    }

    if (!isScanningRef.current) {
      isScanningRef.current = true
    }

    scanBufferRef.current += evt.key

    // Clear previous timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }

    // Set new timeout
    scanTimeoutRef.current = setTimeout(() => {
      valueRef.current = scanBufferRef.current
      isScanningRef.current = false
      scanBufferRef.current = ''
    }, 500)
  }
  useEvent('keydown', handlePressScan, window)

  // useEffect(() => {
  //   console.log("initScan");
  //   window.addEventListener("keydown", handlePressScan);
  //   return () => {
  //     window.removeEventListener("keydown", handlePressScan);
  //   };
  // }, []);

  return valueRef.current
}

export default usePressScan
