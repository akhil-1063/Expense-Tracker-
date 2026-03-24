import { useReducer, useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { expenseReducer } from "../reducers/expenseReducer";
import type { Expense } from "../reducers/expenseReducer";
import { filterReducer, filterInitialState } from "../reducers/filterReducer";
import {
  addExpense,
  deleteExpense,
  editExpense,
  setCategory,
  setDate,
  setMinAmount,
  setMaxAmount,
  setSort,
  setSearch,
} from "../actions/expenseActions";

const categoryList = ["Food", "Travel", "Bills", "Other"];

const EntryForm = () => {
  const [expenses, expenseDispatch] = useReducer(expenseReducer, []);
  const [filters, filterDispatch] = useReducer(filterReducer, filterInitialState);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

    if (editingExpense) {
      expenseDispatch(
        editExpense({ ...editingExpense, amount: Number(amount), category, date, note })
      );
      setEditingExpense(null);
    } else {
      expenseDispatch(
        addExpense({ id: Date.now(), amount: Number(amount), category, date, note })
      );
    }

    form.reset();
  };

  const handleEdit = (exp: Expense) => {
    setEditingExpense(exp);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    formRef.current?.reset();
  };

  const handleDelete = (id: number) => {
    if (editingExpense?.id === id) setEditingExpense(null);
    expenseDispatch(deleteExpense(id));
  };

  let filtered = expenses;

  if (filters.search !== "") {
    filtered = filtered.filter((exp) =>
      exp.note.toLowerCase().includes(filters.search.toLowerCase()) ||
      exp.category.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

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

  if (filters.sortType === "recent") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  if (filters.sortType === "highest") {
    filtered = [...filtered].sort((a, b) => b.amount - a.amount);
  }

  const categoryTotals: { [key: string]: number } = {};

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const overallTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const chartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  const chartColors = ["#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3"];

  const inputClass = "bg-pink-50 rounded-lg px-3 py-2 text-sm text-pink-800 w-full";
  const labelClass = "text-sm text-pink-400 block mb-1";

  return (
    <div className="min-h-screen bg-pink-50">

      <div className="bg-pink-400 p-4 mb-4">
        <h1 className="text-xl font-bold text-white">Akil's Personal Expense Tracker</h1>
      </div>

      <div className="p-4 space-y-6">

        <div>
          <h2 className="text-pink-500 font-bold mb-3">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={labelClass}>Amount</label>
              <input
                name="amount"
                type="number"
                min="1"
                placeholder="0"
                key={editingExpense?.id ?? "new-amount"}
                defaultValue={editingExpense?.amount ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Date</label>
              <input
                name="date"
                type="date"
                key={editingExpense?.id ?? "new-date"}
                defaultValue={editingExpense?.date ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                name="category"
                key={editingExpense?.id ?? "new-category"}
                defaultValue={editingExpense?.category ?? categoryList[0]}
                className={inputClass}
              >
                {categoryList.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Note</label>
              <input
                name="note"
                type="text"
                placeholder="What was this for?"
                key={editingExpense?.id ?? "new-note"}
                defaultValue={editingExpense?.note ?? ""}
                className={inputClass}
              />
            </div>

            <div className="flex gap-2 pt-3">
              <button type="submit" className="bg-pink-400 text-white text-sm px-4 py-2 rounded-lg">
                {editingExpense ? "Save Changes" : "Add Expense"}
              </button>
              {editingExpense && (
                <button type="button" onClick={handleCancelEdit} className="bg-pink-100 text-pink-500 text-sm px-4 py-2 rounded-lg">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <hr className="border-pink-200" />

        <div>
          <h2 className="text-pink-500 font-bold mb-3">Chart </h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-pink-300 text-sm">No expenses</p>
          ) : (
            <>
              {Object.keys(categoryTotals).map((cat) => (
                <div key={cat} className="flex justify-between text-sm text-pink-700 mb-2">
                  <span>{cat}</span>
                  <span>₹{categoryTotals[cat]}</span>
                </div>
              ))}
              <div className="mt-4">
                <PieChart width={300} height={280}>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} paddingAngle={3}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}`} />
                  <Legend />
                </PieChart>
                <p className="text-pink-700 font-bold text-lg mt-2">Total: Rs.{overallTotal}</p>
              </div>
            </>
          )}
        </div>

        <hr className="border-pink-200" />

        <div>
          <h2 className="text-pink-500 font-bold mb-3"> Filters</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Search</label>
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => filterDispatch(setSearch(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select onChange={(e) => filterDispatch(setCategory(e.target.value))} className={inputClass}>
                <option value="All">All</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Date</label>
              <input type="date" onChange={(e) => filterDispatch(setDate(e.target.value))} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Min Amount</label>
              <input type="number" placeholder="0" onChange={(e) => filterDispatch(setMinAmount(e.target.value))} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Max Amount</label>
              <input type="number" placeholder="0" onChange={(e) => filterDispatch(setMaxAmount(e.target.value))} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Sort</label>
              <select onChange={(e) => filterDispatch(setSort(e.target.value))} className={inputClass}>
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Amount</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-pink-200" />

        <div>
          <h2 className="text-pink-500 font-bold mb-3">Expenses ({filtered.length})</h2>
          {filtered.length === 0 ? (
            <p className="text-pink-300 text-sm">No expenses found</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((exp) => (
                <div key={exp.id} className="bg-pink-100 rounded-xl p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-pink-700 font-bold">₹{exp.amount}</p>
                      <p className="text-pink-400 text-sm">{exp.category} · {exp.date}</p>
                      {exp.note && <p className="text-pink-400 text-sm">{exp.note}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(exp)} className="bg-pink-300 text-white text-xs px-3 py-1 rounded-lg">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="bg-pink-200 text-pink-600 text-xs px-3 py-1 rounded-lg">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EntryForm;
