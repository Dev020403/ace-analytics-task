import { type Dish } from "../types";

/**
 * Fetches the dish data from the provided GitHub URL
 */
export const fetchDishes = async (): Promise<Dish[]> => {
  try {
    const response = await fetch("/dishes.json");
    console.log("Response:", response);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dishes: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched dishes:", data);
    return data;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    throw error;
  }
};
