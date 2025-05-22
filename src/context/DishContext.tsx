import { createContext, useState, useEffect, useContext, type FC } from "react";
import { AuthContext } from "./AuthContext";
import { fetchDishes } from "../service/dishService";
import {
  type Dish,
  type DishContextType,
  type DishProviderProps,
  type UserSelection,
  type RankedDish,
} from "../types";

// Create context with default values
export const DishContext = createContext<DishContextType>({
  dishes: [],
  loading: true,
  error: null,
  userSelections: [],
  updateSelection: () => {},
  clearSelections: () => {},
  calculateResults: () => [],
  page: 1,
  setPage: () => {},
  totalPages: 1,
  getPaginatedDishes: () => [],
  getAllUserSelections: () => ({}),
  updateUserSelections: () => {},
});

export const DishProvider: FC<DishProviderProps> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [allUserSelections, setAllUserSelections] = useState<
    Record<number, UserSelection[]>
  >({});

  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoading(true);
        const dishData = await fetchDishes();
        setDishes(dishData);

        // Load all user selections from localStorage
        const allSelections: Record<number, UserSelection[]> = {};

        // Scan localStorage for user selections
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("userSelections-")) {
            const userId = parseInt(key.split("-")[1]);
            const selections = JSON.parse(localStorage.getItem(key) || "[]");
            allSelections[userId] = selections;
          }
        }

        setAllUserSelections(allSelections);

        // Retrieve current user's selections if logged in
        if (currentUser) {
          const savedSelections = localStorage.getItem(
            `userSelections-${currentUser.id}`
          );
          if (savedSelections) {
            setUserSelections(JSON.parse(savedSelections));
          } else {
            setUserSelections([]);
          }
        }
      } catch (err) {
        setError("Failed to load dishes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, [currentUser]);

  const updateSelection = (dishId: number, rank: number): void => {
    if (!currentUser) return;

    // Check if the dish is already in another rank
    const existingAtRank = userSelections.find(
      (selection) => selection.rank === rank
    );

    // Create a new array removing any previous selection of this dish
    let updatedSelections = userSelections.filter(
      (selection) => selection.dishId !== dishId
    );

    // If there was a dish in this rank already, remove its rank
    if (existingAtRank && existingAtRank.dishId !== dishId) {
      updatedSelections = updatedSelections.filter(
        (selection) => selection.rank !== rank
      );
    }

    // Add the new selection
    updatedSelections.push({ dishId, rank });

    // Update state
    setUserSelections(updatedSelections);

    // Update all selections state
    const newAllSelections = {
      ...allUserSelections,
      [currentUser.id]: updatedSelections,
    };
    setAllUserSelections(newAllSelections);

    // Save to localStorage
    localStorage.setItem(
      `userSelections-${currentUser.id}`,
      JSON.stringify(updatedSelections)
    );
  };

  const clearSelections = (): void => {
    if (!currentUser) return;

    setUserSelections([]);

    // Update all selections state
    const newAllSelections = { ...allUserSelections };
    delete newAllSelections[currentUser.id];
    setAllUserSelections(newAllSelections);

    // Remove from localStorage
    localStorage.removeItem(`userSelections-${currentUser.id}`);
  };

  const calculatePoints = (rank: number): number => {
    switch (rank) {
      case 1:
        return 30;
      case 2:
        return 20;
      case 3:
        return 10;
      default:
        return 0;
    }
  };

  // Calculate results with points based on rankings from all users
  const calculateResults = (): RankedDish[] => {
    // Calculate total points for each dish from all users
    const pointsMap = new Map<number, number>();

    // Initialize points map with the dish's base points
    dishes.forEach((dish) => {
      pointsMap.set(dish.id, dish.Points || 0); // Use dish.points (from your data)
    });

    // Add points from all users' rankings
    Object.values(allUserSelections).forEach((selections) => {
      selections.forEach((selection) => {
        const currentPoints = pointsMap.get(selection.dishId) || 0;
        pointsMap.set(
          selection.dishId,
          currentPoints + calculatePoints(selection.rank)
        );
      });
    });

    // Generate results with current user's ranking
    const results = dishes.map((dish) => {
      const selection = currentUser
        ? userSelections.find((s) => s.dishId === dish.id)
        : null;

      return {
        ...dish,
        userRank: selection ? selection.rank : null,
        userPoints: selection ? calculatePoints(selection.rank) : 0,
        points: pointsMap.get(dish.id) || 0, // Total points (base + ranked)
      };
    });

    // Sort by total points (descending)
    return results.sort((a, b) => b.points - a.points);
  };

  // Get paginated dishes
  const getPaginatedDishes = (): Dish[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return dishes.slice(startIndex, endIndex);
  };

  // Get all user selections for admin
  const getAllUserSelections = (): Record<number, UserSelection[]> => {
    return allUserSelections;
  };

  // Update user selections (for admin)
  const updateUserSelections = (
    userId: number,
    selections: UserSelection[]
  ): void => {
    // Update in state
    const newAllSelections = {
      ...allUserSelections,
      [userId]: selections,
    };
    setAllUserSelections(newAllSelections);

    // Update in localStorage
    localStorage.setItem(
      `userSelections-${userId}`,
      JSON.stringify(selections)
    );

    // If this is the current user, update userSelections state
    if (currentUser && currentUser.id === userId) {
      setUserSelections(selections);
    }
  };

  const totalPages = Math.ceil(dishes.length / itemsPerPage);

  const value: DishContextType = {
    dishes,
    loading,
    error,
    userSelections,
    updateSelection,
    clearSelections,
    calculateResults,
    page,
    setPage,
    totalPages,
    getPaginatedDishes,
    getAllUserSelections,
    updateUserSelections,
  };

  return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
};
