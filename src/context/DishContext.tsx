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

// ---- Context Default ---- //
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

// ---- Component ---- //
export const DishProvider: FC<DishProviderProps> = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // ---- State ---- //
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);
  const [allUserSelections, setAllUserSelections] = useState<
    Record<number, UserSelection[]>
  >({});
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const totalPages = Math.ceil(dishes.length / itemsPerPage);

  // ---- Helpers ---- //

  const calculatePoints = (rank: number): number => {
    return rank === 1 ? 30 : rank === 2 ? 20 : rank === 3 ? 10 : 0;
  };

  const loadAllUserSelections = (): Record<number, UserSelection[]> => {
    const selections: Record<number, UserSelection[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("userSelections-")) {
        try {
          const userId = parseInt(key.split("-")[1]);
          const parsed = JSON.parse(localStorage.getItem(key) || "[]");
          if (Array.isArray(parsed)) selections[userId] = parsed;
        } catch (err) {
          console.error(`Failed to parse ${key}:`, err);
        }
      }
    }

    return selections;
  };

  const getUserSelectionsFromStorage = (userId: number): UserSelection[] => {
    try {
      const stored = localStorage.getItem(`userSelections-${userId}`);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Error loading user selections:", err);
      return [];
    }
  };

  // ---- Effects ---- //

  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoading(true);
        const dishData = await fetchDishes();
        setDishes(dishData);

        const allSelections = loadAllUserSelections();
        setAllUserSelections(allSelections);

        if (currentUser) {
          setUserSelections(getUserSelectionsFromStorage(currentUser.id));
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

  // ---- Ranking Logic ---- //

  const updateSelection = (dishId: number, rank: number): void => {
    if (!currentUser) return;

    const updated = userSelections
      .filter((sel) => sel.dishId !== dishId && sel.rank !== rank)
      .concat({ dishId, rank });

    setUserSelections(updated);

    const updatedAll = { ...allUserSelections, [currentUser.id]: updated };
    setAllUserSelections(updatedAll);

    localStorage.setItem(
      `userSelections-${currentUser.id}`,
      JSON.stringify(updated)
    );
  };

  const clearSelections = (): void => {
    if (!currentUser) return;

    setUserSelections([]);
    const updatedAll = { ...allUserSelections };
    delete updatedAll[currentUser.id];
    setAllUserSelections(updatedAll);
    localStorage.removeItem(`userSelections-${currentUser.id}`);
  };

  const calculateResults = (): RankedDish[] => {
    const rankingPointsMap = new Map<number, number>();

    dishes.forEach((dish) => rankingPointsMap.set(dish.id, 0));

    Object.values(allUserSelections).forEach((selections) => {
      selections.forEach(({ dishId, rank }) => {
        const prev = rankingPointsMap.get(dishId) || 0;
        rankingPointsMap.set(dishId, prev + calculatePoints(rank));
      });
    });

    return dishes
      .map((dish) => {
        const selection = userSelections.find((s) => s.dishId === dish.id);
        const basePoints = dish.Points || 0;
        const rankingPoints = rankingPointsMap.get(dish.id) || 0;

        return {
          ...dish,
          userRank: selection?.rank || null,
          userPoints: selection ? calculatePoints(selection.rank) : 0,
          points: basePoints + rankingPoints,
          basePoints,
          rankingPoints,
        };
      })
      .sort(
        (a, b) => b.points - a.points || a.dishName.localeCompare(b.dishName)
      );
  };

  // ---- Pagination ---- //

  const getPaginatedDishes = (): Dish[] => {
    const start = (page - 1) * itemsPerPage;
    return dishes.slice(start, start + itemsPerPage);
  };

  // ---- Admin ---- //

  const getAllUserSelections = (): Record<number, UserSelection[]> =>
    allUserSelections;

  const updateUserSelections = (
    userId: number,
    selections: UserSelection[]
  ): void => {
    const updatedAll = { ...allUserSelections, [userId]: selections };
    setAllUserSelections(updatedAll);
    localStorage.setItem(
      `userSelections-${userId}`,
      JSON.stringify(selections)
    );

    if (currentUser?.id === userId) setUserSelections(selections);
  };

  // ---- Provider Value ---- //

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
