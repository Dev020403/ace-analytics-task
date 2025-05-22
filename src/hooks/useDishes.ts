import { useContext } from 'react';
import { DishContext } from '../context/DishContext';
import { type DishContextType } from '../types';

// Custom hook to access dish context values
export const useDishes = (): DishContextType => {
  const context = useContext(DishContext);
  
  if (!context) {
    throw new Error('useDishes must be used within a DishProvider');
  }
  
  return context;
};