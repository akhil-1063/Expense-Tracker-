export type Expense = {
  amount: number;
  category: string;
  date: string;
  note: string;
};

export type ExpenseAction =
  | { type: "add_expense"; payload: Expense }
  | { type: "set_expenses"; payload: Expense[] };

export const expenseReducer = (state: Expense[], action: ExpenseAction): Expense[] => {
  switch (action.type) {
    case "add_expense":
      return [action.payload, ...state];
    case "set_expenses":
      return action.payload;
    default:
      return state;
  }
};
