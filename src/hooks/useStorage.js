import { useState, useEffect } from 'react';
import { DEFAULT_VELKY, DEFAULT_MALY, DEFAULT_BINARNI } from '../data/constants';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

  const [savedSequences, setSavedSequences] = useState(() => {
    try {
      const stored = localStorage.getItem('savedSequences');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const syncToDb = async () => {
    try {
      const payload = {
        velky: JSON.parse(localStorage.getItem('velky') || 'null') || DEFAULT_VELKY,
        maly: JSON.parse(localStorage.getItem('maly') || 'null') || DEFAULT_MALY,
        binarni: JSON.parse(localStorage.getItem('binarni') || 'null') || DEFAULT_BINARNI,
        savedBinaries: JSON.parse(localStorage.getItem('savedBinaries') || '[]'),
        savedSequences: JSON.parse(localStorage.getItem('savedSequences') || '[]'),
        updated_at: new Date().toISOString()
      };
      
      const docRef = doc(db, 'pao_app', 'user_data');
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      console.error('Failed to sync to Firebase:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchFromDb = async () => {
      try {
        const docRef = doc(db, 'pao_app', 'user_data');
        const docSnap = await getDoc(docRef);
          
        if (docSnap.exists() && isMounted) {
          const dbData = docSnap.data();
          
          if (dbData.velky) {
            setVelky(dbData.velky);
            localStorage.setItem('velky', JSON.stringify(dbData.velky));
          }
          if (dbData.maly) {
            setMaly(dbData.maly);
            localStorage.setItem('maly', JSON.stringify(dbData.maly));
          }
          if (dbData.binarni) {
            setBinarni(dbData.binarni);
            localStorage.setItem('binarni', JSON.stringify(dbData.binarni));
          }
          if (dbData.savedBinaries) {
            setSavedBinaries(dbData.savedBinaries);
            localStorage.setItem('savedBinaries', JSON.stringify(dbData.savedBinaries));
          }
          if (dbData.savedSequences) {
            setSavedSequences(dbData.savedSequences);
            localStorage.setItem('savedSequences', JSON.stringify(dbData.savedSequences));
          }
        }
      } catch (error) {
        console.error('Failed to fetch from Firebase:', error);
      }
    };
    
    fetchFromDb();
    
    return () => { isMounted = false; };
  }, []);

  const saveSystem = (system, data) => {
    try {
      localStorage.setItem(system, JSON.stringify(data));
      if (system === 'velky') setVelky(data);
      else if (system === 'maly') setMaly(data);
      else if (system === 'binarni') setBinarni(data);
      syncToDb();
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
      syncToDb();
    } catch (error) {
      console.error('Failed to save binary data:', error);
    }
  };

  const deleteBinary = (id) => {
    try {
      const updatedBinaries = savedBinaries.filter(item => item.id !== id);
      setSavedBinaries(updatedBinaries);
      localStorage.setItem('savedBinaries', JSON.stringify(updatedBinaries));
      syncToDb();
    } catch (error) {
      console.error('Failed to delete binary data:', error);
    }
  };

  const saveSequence = (data) => {
    try {
      let updatedSequences;
      if (data.id) {
        // Edit existing
        updatedSequences = savedSequences.map(seq => seq.id === data.id ? data : seq);
      } else {
        // Create new
        const newItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          ...data
        };
        updatedSequences = [...savedSequences, newItem];
      }
      setSavedSequences(updatedSequences);
      localStorage.setItem('savedSequences', JSON.stringify(updatedSequences));
      syncToDb();
    } catch (error) {
      console.error('Failed to save sequence data:', error);
    }
  };

  const deleteSequence = (id) => {
    try {
      const updatedSequences = savedSequences.filter(item => item.id !== id);
      setSavedSequences(updatedSequences);
      localStorage.setItem('savedSequences', JSON.stringify(updatedSequences));
      syncToDb();
    } catch (error) {
      console.error('Failed to delete sequence data:', error);
    }
  };

  const importSequences = (importedData) => {
    try {
      setSavedSequences(importedData);
      localStorage.setItem('savedSequences', JSON.stringify(importedData));
      syncToDb();
    } catch (error) {
      console.error('Failed to import sequence data:', error);
    }
  };

  return {
    data: { velky, maly, binarni },
    savedBinaries,
    saveBinary,
    deleteBinary,
    savedSequences,
    saveSequence,
    deleteSequence,
    importSequences,
    saveSystem,
    resetSystem
  };
}