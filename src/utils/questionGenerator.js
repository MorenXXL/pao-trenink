import { KARTY_SYSTEM, KARTY_NUMBER_TO_CARD } from '../data/constants';

export function generateQuestion(system, mode, data) {
  if (system === 'velky') {
    const n = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
    
    // Get PAO components directly from structured data
    const pao1 = data.velky[n[0]];
    const pao2 = data.velky[n[1]];
    const pao3 = data.velky[n[2]];
    
    // Safety check to ensure objects exist
    if (!pao1 || !pao2 || !pao3) {
      return {
        question: "Error: Missing data",
        answer: "Please check system data"
      };
    }
    
    if (mode === 'num-pao') {
      return {
        question: String(`${n[0].toString().padStart(2, '0')} ${n[1].toString().padStart(2, '0')} ${n[2].toString().padStart(2, '0')}`),
        answer: String(`${pao1.person} ${pao2.action} ${pao3.object}`),
        mode: 'num-pao'
      };
    } else {
      return {
        question: String(`${pao1.person} ${pao2.action} ${pao3.object}`),
        answer: String(`${n[0].toString().padStart(2, '0')} ${n[1].toString().padStart(2, '0')} ${n[2].toString().padStart(2, '0')}`),
        mode: 'pao-num'
      };
    }
  }
  
  else if (system === 'maly') {
    const n = Math.floor(Math.random() * 100);
    
    if (!data.maly || data.maly[n] === undefined) {
      return {
        question: "Error: Missing data",
        answer: "Please check system data"
      };
    }
    
    if (mode === 'num-word') {
      return {
        question: String(n.toString().padStart(2, '0')),
        answer: String(data.maly[n]),
        mode: 'num-word'
      };
    } else {
      return {
        question: String(data.maly[n]),
        answer: String(n.toString().padStart(2, '0')),
        mode: 'word-num'
      };
    }
  }
  
  else if (system === 'karty') {
    const allCards = Object.keys(KARTY_SYSTEM);
    
    if (mode === 'card-num') {
      const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
      const cardData = KARTY_SYSTEM[randomCard];
      return {
        question: String(randomCard),
        answer: String(cardData.number.toString().padStart(2, '0')),
        mode: 'card-num'
      };
    } else if (mode === 'cards-pao') {
      // Generate 3 unique cards
      const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
      const card1 = shuffledCards[0];
      const card2 = shuffledCards[1];
      const card3 = shuffledCards[2];
      
      const cardData1 = KARTY_SYSTEM[card1];
      const cardData2 = KARTY_SYSTEM[card2];
      const cardData3 = KARTY_SYSTEM[card3];
      
      return {
        question: String(`${card1} ${card2} ${card3}`),
        answer: String(`${cardData1.person} ${cardData2.action} ${cardData3.object}`),
        mode: 'cards-pao'
      };
    } else {
      // Generate 3 unique cards
      const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
      const card1 = shuffledCards[0];
      const card2 = shuffledCards[1];
      const card3 = shuffledCards[2];
      
      const cardData1 = KARTY_SYSTEM[card1];
      const cardData2 = KARTY_SYSTEM[card2];
      const cardData3 = KARTY_SYSTEM[card3];
      
      return {
        question: String(`${cardData1.person} ${cardData2.action} ${cardData3.object}`),
        answer: String(`${card1} ${card2} ${card3}`)
      };
    }
  }
  
  else if (system === 'binarni') {
    if (mode === 'seq-pao' || mode === 'pao-seq') {
      // Generate 3 random numbers for PAO (00-77 for binary system)
      const generateBinaryNumber = () => {
        const tens = Math.floor(Math.random() * 8); // 0-7
        const units = Math.floor(Math.random() * 8); // 0-7
        return tens * 10 + units;
      };
      
      const n = [
        generateBinaryNumber(),
        generateBinaryNumber(),
        generateBinaryNumber()
      ];
      
      // Convert numbers to binary using the binary system mapping
      const getBinaryForNumber = (num) => {
        const tens = Math.floor(num / 10);
        const units = num % 10;
        
        // Find binary codes for tens and units
        const tensBinary = Object.keys(data.binarni).find(key => data.binarni[key] === tens) || '000';
        const unitsBinary = Object.keys(data.binarni).find(key => data.binarni[key] === units) || '000';
        
        return tensBinary + unitsBinary;
      };
      
      const binarySequence = n.map(getBinaryForNumber).join('');
      
      // Get PAO components
      const pao1 = data.velky[n[0]] || { person: "Unknown", action: "does", object: "something" };
      const pao2 = data.velky[n[1]] || { person: "Unknown", action: "does", object: "something" };
      const pao3 = data.velky[n[2]] || { person: "Unknown", action: "does", object: "something" };
      
      if (mode === 'seq-pao') {
        return {
          question: String(binarySequence),
          answer: `${pao1.person} ${pao2.action} ${pao3.object}`,
          mode: 'seq-pao'
        };
      } else {
        return {
          question: `${pao1.person} ${pao2.action} ${pao3.object}`,
          answer: String(binarySequence),
          mode: 'pao-seq',
          paoNumbers: `${n[0].toString().padStart(2, '0')} ${n[1].toString().padStart(2, '0')} ${n[2].toString().padStart(2, '0')}`
        };
      }
    }
    else if (mode === 'seq-word' || mode === 'word-seq') {
      // Generate random number for word (00-77 for binary system)
      const tens = Math.floor(Math.random() * 8); // 0-7
      const units = Math.floor(Math.random() * 8); // 0-7
      const n = tens * 10 + units;
      
      // Convert number to binary sequence using the binary system mapping
      const convertNumberToBinary = (num) => {
        const tens = Math.floor(num / 10);
        const units = num % 10;
        
        // Find binary codes for tens and units from the binary system
        const tensBinary = Object.keys(data.binarni).find(key => data.binarni[key] === tens) || '000';
        const unitsBinary = Object.keys(data.binarni).find(key => data.binarni[key] === units) || '000';
        
        return tensBinary + unitsBinary;
      };
      
      const binarySequence = convertNumberToBinary(n);
      const word = data.maly[n] || "neznámé slovo";
      
      if (!word) {
        return {
          question: "Error: Missing word data for " + n,
          answer: "Please check system data for number " + n
        };
      }
      
      if (mode === 'seq-word') {
        return {
          question: String(binarySequence),
          answer: String(word),
          debugInfo: `Number: ${n.toString().padStart(2, '0')}, Binary: ${binarySequence}, Word: ${word}`
        };
      } else {
        const verificationNumber = Math.floor(Math.random() * 100);
        return {
          question: String(word),
          answer: String(binarySequence),
          debugInfo: `Original: ${n.toString().padStart(2, '0')}, Binary: ${binarySequence}, Verification: ${verificationNumber.toString().padStart(2, '0')}, Word: ${word}`
        };
      }
    }
    else if (mode === 'text-utf8') {
      // Generate random Czech text for UTF-8 conversion
      const sampleTexts = [
        'Ahoj', 'Světe', 'Čeština', 'Příklad', 'Kódování', 'Binární', 'Systém', 'Paměť',
        'Trénink', 'Učení', 'Věda', 'Technika', 'Počítač', 'Program', 'Aplikace', 'Data'
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      
      // Convert text to UTF-8 binary
      const textToBinary = (text) => {
        return Array.from(text)
          .map(char => {
            const code = char.charCodeAt(0);
            return code.toString(2).padStart(8, '0');
          })
          .join(' ');
      };
      
      // Convert binary to PAO sequences (group by 6 bits for our system)
      const binaryToPAO = (binaryString) => {
        const cleanBinary = binaryString.replace(/\s/g, '');
        const paoSequences = [];
        
        // Group into 6-bit chunks (our binary system uses 3-bit pairs)
        for (let i = 0; i < cleanBinary.length; i += 6) {
          const chunk = cleanBinary.substr(i, 6);
          if (chunk.length === 6) {
            const first3 = chunk.substr(0, 3);
            const second3 = chunk.substr(3, 3);
            
            const firstNum = data.binarni[first3] !== undefined ? data.binarni[first3] : 0;
            const secondNum = data.binarni[second3] !== undefined ? data.binarni[second3] : 0;
            const combinedNum = firstNum * 10 + secondNum;
            
            const pao = data.velky[combinedNum] || { person: "Unknown", action: "does", object: "something" };
            paoSequences.push(`${pao.person} ${pao.action} ${pao.object}`);
          }
        }
        
        return paoSequences.join(' | ');
      };
      
      const binaryCode = textToBinary(randomText);
      const paoSequence = binaryToPAO(binaryCode);
      
      // Convert to numeric sequences for display
      const binaryToNumbers = (binaryString) => {
        const cleanBinary = binaryString.replace(/\s/g, '');
        const numbers = [];
        
        for (let i = 0; i < cleanBinary.length; i += 6) {
          const chunk = cleanBinary.substr(i, 6);
          if (chunk.length === 6) {
            const first3 = chunk.substr(0, 3);
            const second3 = chunk.substr(3, 3);
            
            const firstNum = data.binarni[first3] !== undefined ? data.binarni[first3] : 0;
            const secondNum = data.binarni[second3] !== undefined ? data.binarni[second3] : 0;
            const combinedNum = firstNum * 10 + secondNum;
            
            numbers.push(combinedNum.toString().padStart(2, '0'));
          }
        }
        
        return numbers.join(' ');
      };
      
      const numberSequence = binaryToNumbers(binaryCode);
      
      return {
        question: String(randomText),
        answer: String(binaryCode),
        paoSequence: String(paoSequence),
        numberSequence: String(numberSequence),
        mode: 'text-utf8'
      };
    }
    else {
      const binaryKeys = Object.keys(data.binarni);
      const b = binaryKeys[Math.floor(Math.random() * binaryKeys.length)];
      
      if (!data.binarni || data.binarni[b] === undefined) {
        return {
          question: "Error: Missing binary data",
          answer: "Please check system data"
        };
      }
      
      if (mode === 'bin-num') {
        return {
          question: String(b),
          answer: String(data.binarni[b])
        };
      } else {
        return {
          question: String(data.binarni[b]),
          answer: String(b)
        };
      }
    }
  }
  
  // Fallback for unknown system
  return {
    question: "Error: Unknown system",
    answer: "Please check system configuration"
  };
}