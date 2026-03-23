import { useReducer } from "react";
import { expenseReducer } from "../reducers/expenseReducer";
import { filterReducer, filterInitialState } from "../reducers/filterReducer";
import {
  addExpense,
  setCategory,
  setDate,
  setMinAmount,
  setMaxAmount,
  setSort,
} from "../actions/expenseActions";

const categoryList = ["Food", "Travel", "Bills", "Other"];

const EntryForm = () => {
  const [expenses, expenseDispatch] = useReducer(expenseReducer, []);
  const [filters, filterDispatch] = useReducer(filterReducer, filterInitialState);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const amount = form.amount.value;
    const date = form.date.value;
    const category = form.category.value;
    const note = form.note.value;

    if (!amount || !date || !category) {
      alert("Please fill in all required fields");
      return;
    }

    expenseDispatch(
      addExpense({ amount: Number(amount), category, date, note })
    );

    form.reset();
  };

  // filtering
  let filtered = expenses;

  if (filters.selectedCategory !== "All") {
    filtered = filtered.filter((exp) => exp.category === filters.selectedCategory);
  }

  if (filters.selectedDate !== "") {
    filtered = filtered.filter((exp) => exp.date === filters.selectedDate);
  }

  if (filters.minAmount !== "") {
    filtered = filtered.filter((exp) => exp.amount >= Number(filters.minAmount));
  }

  if (filters.maxAmount !== "") {
    filtered = filtered.filter((exp) => exp.amount <= Number(filters.maxAmount));
  }

  // sorting
  if (filters.sortType === "recent") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  if (filters.sortType === "highest") {
    filtered = [...filtered].sort((a, b) => b.amount - a.amount);
  }

  // category totals
  const categoryTotals: { [key: string]: number } = {};

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const overallTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input name="amount" type="number" />
        </div>

        <div>
          <label>Category:</label>
          <select name="category">
            {categoryList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date:</label>
          <input name="date" type="date" />
        </div>

        <div>
          <label>Note:</label>
          <input name="note" type="text" />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <div>
        <h3>Category Totals</h3>
        {Object.keys(categoryTotals).map((cat) => (
          <div key={cat}>
            <p>
              {cat} : ₹{categoryTotals[cat]}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3>Overall Total</h3>
        <p>₹{overallTotal}</p>
      </div>

      <div>
        <h3>Filters</h3>

        <div>
          <label>Category:</label>
          <select onChange={(e) => filterDispatch(setCategory(e.target.value))}>
            <option value="All">All</option>
            {categoryList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date:</label>
          <input type="date" onChange={(e) => filterDispatch(setDate(e.target.value))} />
        </div>

        <div>
          <label>Min Amount:</label>
          <input type="number" onChange={(e) => filterDispatch(setMinAmount(e.target.value))} />
        </div>

        <div>
          <label>Max Amount:</label>
          <input type="number" onChange={(e) => filterDispatch(setMaxAmount(e.target.value))} />
        </div>

        <div>
          <label>Sort:</label>
          <select onChange={(e) => filterDispatch(setSort(e.target.value))}>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Amount</option>
          </select>
        </div>
      </div>

      <div>
        <h3>Expenses</h3>
        {filtered.map((exp, index) => (
          <div key={index}>
            <p>
              ₹{exp.amount} | {exp.category} | {exp.date}
            </p>
            <p>{exp.note}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EntryForm;
