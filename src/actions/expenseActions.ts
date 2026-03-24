import type { Expense } from "../reducers/expenseReducer";


export const addExpense = (expense: Expense) => ({
  type: "add_expense" as const,
  payload: expense,
});

export const deleteExpense = (id: number) => ({
  type: "delete_expense" as const,
  payload: id,
});

export const editExpense = (expense: Expense) => ({
  type: "edit_expense" as const,
  payload: expense,
});


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

export const setSearch = (search: string) => ({
  type: "set_search" as const,
  payload: search,
});
