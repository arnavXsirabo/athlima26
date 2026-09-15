export const ATHLIMA_SPORTS = [
  { id: 'cricket', name: 'Cricket', category: 'Team Sport', capacity: 8, price: 1800, minPlayers: 11, maxPlayers: 15 },
  { id: 'football', name: 'Football', category: 'Team Sport', capacity: 8, price: 1800, minPlayers: 9, maxPlayers: 16 },
  { id: 'basketball-men', name: 'Basketball (Men)', category: 'Team Sport', capacity: 8, price: 2000, minPlayers: 7, maxPlayers: 13 },
  { id: 'basketball-women', name: 'Basketball (Women)', category: 'Team Sport', capacity: 8, price: 1000, minPlayers: 3, maxPlayers: 6 },
  { id: 'volleyball-men', name: 'Volleyball (Men)', category: 'Team Sport', capacity: 8, price: 1500, minPlayers: 6, maxPlayers: 12 },
  { id: 'volleyball-women', name: 'Volleyball (Women)', category: 'Team Sport', capacity: 8, price: 1500, minPlayers: 6, maxPlayers: 12 },
  { id: 'badminton', name: 'Badminton', category: 'Team Sport', capacity: 8, price: 1600, minPlayers: 4, maxPlayers: 8 },
  { id: 'chess', name: 'Chess', category: 'Team Sport', capacity: 8, price: 500, minPlayers: 4, maxPlayers: 5 },
  { id: 'table-tennis', name: 'Table Tennis', category: 'Team Sport', capacity: 8, price: 500, minPlayers: 4, maxPlayers: 5 },
  { id: 'swimming', name: 'Swimming', category: 'Individual Sport', capacity: 8, price: 150, minPlayers: 1, maxPlayers: 1 },
];

export const getSportRegistrationStatus = (registeredCount, capacity) => {
  if (registeredCount >= capacity) return 'FULL';
  if (registeredCount >= capacity - 2) return 'LIMITED';
  return 'OPEN';
};
