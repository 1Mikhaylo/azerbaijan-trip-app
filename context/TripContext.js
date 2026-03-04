import { createContext, useContext, useState } from 'react';

const TripContext = createContext();

export function TripProvider({ children }) {
  const [favouriteIds, setFavouriteIds] = useState([]);

  const toggleFavourite = (id) => {
    setFavouriteIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavourite = (id) => favouriteIds.includes(id);

  return (
    <TripContext.Provider value={{ favouriteIds, toggleFavourite, isFavourite }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  return useContext(TripContext);
}
