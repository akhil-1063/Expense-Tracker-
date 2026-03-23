export type FilterState = {
  selectedCategory: string;
  selectedDate: string;
  minAmount: string;
  maxAmount: string;
  sortType: string;
  search: string;
};

export type FilterAction =
  | { type: "set_category"; payload: string }
  | { type: "set_date"; payload: string }
  | { type: "set_min_amount"; payload: string }
  | { type: "set_max_amount"; payload: string }
  | { type: "set_sort"; payload: string }
  | { type: "set_search"; payload: string };

export const filterInitialState: FilterState = {
  selectedCategory: "All",
  selectedDate: "",
  minAmount: "",
  maxAmount: "",
  sortType: "recent",
  search: "",
};

export const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case "set_category":
      return { ...state, selectedCategory: action.payload };
    case "set_date":
      return { ...state, selectedDate: action.payload };
    case "set_min_amount":
      return { ...state, minAmount: action.payload };
    case "set_max_amount":
      return { ...state, maxAmount: action.payload };
    case "set_sort":
      return { ...state, sortType: action.payload };
    case "set_search":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};
