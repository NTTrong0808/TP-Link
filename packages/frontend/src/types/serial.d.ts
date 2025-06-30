interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  writable: WritableStream;
}

interface Navigator {
  serial: {
    requestPort(): Promise<SerialPort>;
  };
}
