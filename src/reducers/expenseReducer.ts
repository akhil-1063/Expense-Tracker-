export type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
};

export type ExpenseAction =
  | { type: "add_expense"; payload: Expense }
  | { type: "delete_expense"; payload: number }
  | { type: "edit_expense"; payload: Expense };

export const expenseReducer = (state: Expense[], action: ExpenseAction) => {
  switch (action.type) {
    case "add_expense":
      return [action.payload, ...state];
    case "delete_expense":
      return state.filter((exp) => exp.id !== action.payload);
    case "edit_expense":
      return state.map((exp) => (exp.id === action.payload.id ? action.payload : exp));
    default:
      return state;
  }
};
