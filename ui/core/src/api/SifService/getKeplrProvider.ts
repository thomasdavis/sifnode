type WindowWithPossibleKeplr = typeof window & {
  keplr?: any;
  getOfflineSigner?: any
};

// Todo
type provider = any

// Detect mossible keplr provider from browser
export const getKeplrProvider = async (): Promise<provider> => {
  const win = window as WindowWithPossibleKeplr;

  if (!win) return null;

  if (win.keplr || win.getOfflineSigner) {
    return win.keplr
  }

  return null;
};
