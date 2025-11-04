export interface User {
  id: string;
  username: string;
}

export interface Word {
  _id: string;
  userId: string;
  english: string;
  hebrew: string;
  createdAt: string;
  lastPracticed?: string;
  correctCount: number;
  incorrectCount: number;
  searchCount: number;
  lastSearched?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string }>;
}
