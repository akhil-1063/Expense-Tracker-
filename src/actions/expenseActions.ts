import type { Expense } from "../reducers/expenseReducer";

// expense action creators
export const addExpense = (expense: Expense) => ({
  type: "add_expense" as const,
  payload: expense,
});

export const setExpenses = (expenses: Expense[]) => ({
  type: "set_expenses" as const,
  payload: expenses,
});

// filter action creators
export const setCategory = (category: string) => ({
  type: "set_category" as const,
  payload: category,
});

export const setDate = (date: string) => ({
  type: "set_date" as const,
  payload: date,
});

export const setMinAmount = (amount: string) => ({
  type: "set_min_amount" as const,
  payload: amount,
});

export const setMaxAmount = (amount: string) => ({
  type: "set_max_amount" as const,
  payload: amount,
});

export const setSort = (sort: string) => ({
  type: "set_sort" as const,
  payload: sort,
});
