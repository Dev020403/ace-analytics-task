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

  // Load all user selections from localStorage
  const loadAllUserSelections = (): Record<number, UserSelection[]> => {
    const allSelections: Record<number, UserSelection[]> = {};

    // Scan localStorage for all user selections
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("userSelections-")) {
        try {
          const userId = parseInt(key.split("-")[1]);
          const selections = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(selections)) {
            allSelections[userId] = selections;
          }
        } catch (error) {
          console.error(`Error parsing selections for key ${key}:`, error);
        }
      }
    }

    return allSelections;
  };

  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoading(true);
        const dishData = await fetchDishes();
        setDishes(dishData);

        // Load all user selections from localStorage
        const allSelections = loadAllUserSelections();
        setAllUserSelections(allSelections);

        // Retrieve current user's selections if logged in
        if (currentUser) {
          const savedSelections = localStorage.getItem(
            `userSelections-${currentUser.id}`
          );
          if (savedSelections) {
            try {
              const parsedSelections = JSON.parse(savedSelections);
              setUserSelections(
                Array.isArray(parsedSelections) ? parsedSelections : []
              );
            } catch (error) {
              console.error("Error parsing current user selections:", error);
              setUserSelections([]);
            }
          } else {
            setUserSelections([]);
          }
        } else {
          setUserSelections([]);
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

  const updateSelection = (dishId: number, rank: number): void => {
    if (!currentUser) return;

    // Get current user's selections
    const currentSelections = [...userSelections];

    // Remove any existing selection for this dish
    let updatedSelections = currentSelections.filter(
      (selection) => selection.dishId !== dishId
    );

    // Remove any existing selection for this rank
    updatedSelections = updatedSelections.filter(
      (selection) => selection.rank !== rank
    );

    // Add the new selection
    updatedSelections.push({ dishId, rank });

    // Update current user's selections
    setUserSelections(updatedSelections);

    // Update all selections state immediately
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

    // Debug log to verify the update
    console.log(
      "Updated selections for user",
      currentUser.id,
      ":",
      updatedSelections
    );
    console.log("All user selections:", newAllSelections);
  };

  const clearSelections = (): void => {
    if (!currentUser) return;

    // Clear current user's selections
    setUserSelections([]);

    // Update all selections state by removing current user's selections
    const newAllSelections = { ...allUserSelections };
    delete newAllSelections[currentUser.id];
    setAllUserSelections(newAllSelections);

    // Remove from localStorage
    localStorage.removeItem(`userSelections-${currentUser.id}`);

    console.log("Cleared selections for user", currentUser.id);
    console.log("Remaining selections:", newAllSelections);
  };

  // Calculate results with points based on rankings from ALL users
  const calculateResults = (): RankedDish[] => {
    // Calculate total ranking points for each dish from all users
    const rankingPointsMap = new Map<number, number>();

    // Initialize with 0 ranking points
    dishes.forEach((dish) => {
      rankingPointsMap.set(dish.id, 0);
    });

    // Add up points from ALL users' rankings
    Object.entries(allUserSelections).forEach(([, selections]) => {
      selections.forEach((selection) => {
        const currentRankingPoints =
          rankingPointsMap.get(selection.dishId) || 0;
        const additionalPoints = calculatePoints(selection.rank);
        rankingPointsMap.set(
          selection.dishId,
          currentRankingPoints + additionalPoints
        );
      });
    });

    // Generate results with total points (base + ranking points)
    const results = dishes.map((dish) => {
      const selection = currentUser
        ? userSelections.find((s) => s.dishId === dish.id)
        : null;

      const basePoints = dish.Points || 0;
      const rankingPoints = rankingPointsMap.get(dish.id) || 0;
      const totalPoints = basePoints + rankingPoints;

      return {
        ...dish,
        userRank: selection ? selection.rank : null,
        userPoints: selection ? calculatePoints(selection.rank) : 0,
        points: totalPoints, // Base points + all users' ranking points
        basePoints: basePoints, // Original dish points
        rankingPoints: rankingPoints, // Points from all user rankings
      };
    });

    // Sort by total points (descending), then by dish name for consistency
    return results.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return a.dishName.localeCompare(b.dishName);
    });
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

  // Update user selections (for admin use)
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

    console.log("Admin updated selections for user", userId, ":", selections);
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
