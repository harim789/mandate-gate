import { createContext, useContext, useState } from 'react';
import { mandateRecords } from '../data/mock';

const MandatesContext = createContext(null);

export function MandatesProvider({ children }) {
  const [revokedMap, setRevokedMap] = useState({});

  function effective(id) {
    const raw = mandateRecords.find((m) => m.id === id);
    if (!raw) return null;
    const revokedAt = revokedMap[id];
    if (revokedAt) return { ...raw, status: '폐기됨', revokedAt };
    return raw;
  }

  function revoke(id) {
    setRevokedMap((p) => ({ ...p, [id]: '2026-08-07' }));
  }

  return (
    <MandatesContext.Provider value={{ all: mandateRecords, effective, revoke }}>
      {children}
    </MandatesContext.Provider>
  );
}

export function useMandates() {
  return useContext(MandatesContext);
}
