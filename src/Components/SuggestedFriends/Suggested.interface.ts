export interface SuggestionsResponseType {
  success: boolean;
  message: string;
  data: { suggestions: SuggestedUser[] };
  meta: { pagination: SuggestionsPagination };
}

export interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export interface SuggestionsPagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage?: number;
}

export interface FollowResponseType {
  success: boolean;
  message: string;
  data: {
    following: boolean;
    followersCount: number;
  };
}