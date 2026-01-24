import { useState, useEffect } from 'react';
import { DEFAULT_VELKY, DEFAULT_MALY, DEFAULT_BINARNI } from '../data/constants';

export function useStorage() {
  const [velky, setVelky] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('velky') || JSON.stringify(DEFAULT_VELKY));
      return stored;
    } catch {
      return DEFAULT_VELKY;
    }
  });

  const [maly, setMaly] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maly') || JSON.stringify(DEFAULT_MALY));
    } catch {
      return DEFAULT_MALY;
    }
  });

  const [binarni, setBinarni] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('binarni') || JSON.stringify(DEFAULT_BINARNI));
    } catch {
      return DEFAULT_BINARNI;
    }
  });

  const [savedBinaries, setSavedBinaries] = useState(() => {
    try {
      const stored = localStorage.getItem('savedBinaries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveSystem = (system, data) => {
    try {
      localStorage.setItem(system, JSON.stringify(data));
      if (system === 'velky') setVelky(data);
      else if (system === 'maly') setMaly(data);
      else if (system === 'binarni') setBinarni(data);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const resetSystem = (system) => {
    const defaults = {
      velky: DEFAULT_VELKY,
      maly: DEFAULT_MALY,
      binarni: DEFAULT_BINARNI
    };
    
    if (confirm('Opravdu obnovit výchozí hodnoty?')) {
      saveSystem(system, defaults[system]);
    }
  };

  const saveBinary = (data) => {
    try {
      const newItem = {
        id: Date.now().toString(),
        ...data
      };
      const updatedBinaries = [...savedBinaries, newItem];
      setSavedBinaries(updatedBinaries);
      localStorage.setItem('savedBinaries', JSON.stringify(updatedBinaries));
    } catch (error) {
      console.error('Failed to save binary data:', error);
    }
  };

  const deleteBinary = (id) => {
    try {
      const updatedBinaries = savedBinaries.filter(item => item.id !== id);
      setSavedBinaries(updatedBinaries);
      localStorage.setItem('savedBinaries', JSON.stringify(updatedBinaries));
    } catch (error) {
      console.error('Failed to delete binary data:', error);
    }
  };
  return {
    data: { velky, maly, binarni },
    savedBinaries,
    saveBinary,
    deleteBinary,
    saveSystem,
    resetSystem
  };
}