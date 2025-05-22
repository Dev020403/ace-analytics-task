// Dish-related types
export interface Dish {
    id: number;
    dishName: string;
    description: string;
    image: string;
    Points: number;
  }
  
  export interface UserSelection {
    dishId: number;
    rank: number;
  }
  
  export interface RankedDish extends Dish {
    userRank: number | null;
    userPoints: number;
  }
  
  export interface DishContextType {
    dishes: Dish[];
    loading: boolean;
    error: string | null;
    userSelections: UserSelection[];
    updateSelection: (dishId: number, rank: number) => void;
    clearSelections: () => void;
    calculateResults: () => RankedDish[];
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    getPaginatedDishes: () => Dish[];
    getAllUserSelections: () => Record<number, UserSelection[]>;
    updateUserSelections: (userId: number, selections: UserSelection[]) => void;
  }
  
  export interface DishProviderProps {
    children: React.ReactNode;
  }