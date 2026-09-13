export const ATHLIMA_SPORTS = [
  { id: 'cricket', name: 'Cricket', category: 'Team Sport', capacity: 8 },
  { id: 'football', name: 'Football', category: 'Team Sport', capacity: 8 },

  { id: 'basketball-men', name: 'Basketball (Men)', category: 'Team Sport', capacity: 8 },
  { id: 'basketball-women', name: 'Basketball (Women)', category: 'Team Sport', capacity: 8 },
  { id: 'volleyball-men', name: 'Volleyball (Men)', category: 'Team Sport', capacity: 8 },
  { id: 'volleyball-women', name: 'Volleyball (Women)', category: 'Team Sport', capacity: 8 },
  { id: 'badminton', name: 'Badminton', category: 'Individual / Doubles', capacity: 8 },
  { id: 'chess', name: 'Chess', category: 'Individual', capacity: 8 },
  { id: 'table-tennis', name: 'Table Tennis', category: 'Individual / Doubles', capacity: 8 },
  { id: 'swimming', name: 'Swimming', category: 'Individual / Relay', capacity: 8 },
];

export const getSportRegistrationStatus = (registeredCount, capacity) => {
  if (registeredCount >= capacity) return 'FULL';
  if (registeredCount >= capacity - 2) return 'LIMITED';
  return 'OPEN';
};
