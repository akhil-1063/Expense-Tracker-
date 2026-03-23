import { useEffect, useReducer } from "react";

type Expense = {
  amount: number;
  category: string;
  date: string;
  note: string;
};

type State = {
  expenses: Expense[];
  selectedCategory: string;
  selectedDate: string;
  minAmount: string;
  maxAmount: string;
  sortType: string;
};

type Action =
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "SET_EXPENSES"; payload: Expense[] }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_MIN_AMOUNT"; payload: string }
  | { type: "SET_MAX_AMOUNT"; payload: string }
  | { type: "SET_SORT"; payload: string };

const initialState: State = {
  expenses: [],
  selectedCategory: "All",
  selectedDate: "",
  minAmount: "",
  maxAmount: "",
  sortType: "recent",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
      };

    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
      };

    case "SET_MIN_AMOUNT":
      return {
        ...state,
        minAmount: action.payload,
      };

    case "SET_MAX_AMOUNT":
      return {
        ...state,
        maxAmount: action.payload,
      };

    case "SET_SORT":
      return {
        ...state,
        sortType: action.payload,
      };

    default:
      return state;
  }
};

const EntryForm = () => {
  const categoryList = ["Food", "Travel", "Bills", "Other"];

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const amt = e.target.amount.value;
    const dte = e.target.date.value;
    const ctg = e.target.category.value;
    const note = e.target.note.value;

    if (!amt || !dte || !ctg ) {
      alert("Enter the Details First");
      return;
    }

    const newExpense = {
      amount: Number(amt),
      category: ctg,
      date: dte,
      note: note,
    };

    dispatch({ type: "ADD_EXPENSE", payload: newExpense });

    (e.target as HTMLFormElement).reset();
  };

  useEffect(() => {
    const data = localStorage.getItem("expenses");
    const parsed = data ? JSON.parse(data) : [];

    dispatch({ type: "SET_EXPENSES", payload: parsed });
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

  // FILTERING (same logic)
  let filteredExpenses = state.expenses;

  if (state.selectedCategory !== "All") {
    filteredExpenses = filteredExpenses.filter((exp) => {
      return exp.category === state.selectedCategory;
    });
  }

  if (state.selectedDate !== "") {
    filteredExpenses = filteredExpenses.filter((exp) => {
      return exp.date === state.selectedDate;
    });
  }

  if (state.minAmount !== "") {
    filteredExpenses = filteredExpenses.filter((exp) => {
      return exp.amount >= Number(state.minAmount);
    });
  }

  if (state.maxAmount !== "") {
    filteredExpenses = filteredExpenses.filter((exp) => {
      return exp.amount <= Number(state.maxAmount);
    });
  }

  // SORTING
  if (state.sortType === "recent") {
    filteredExpenses = filteredExpenses.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  if (state.sortType === "highest") {
    filteredExpenses = filteredExpenses.sort((a, b) => {
      return b.amount - a.amount;
    });
  }

  // CATEGORY TOTALS
  const categoryTotals: { [key: string]: number } = {};

  state.expenses.forEach((exp) => {
    if (categoryTotals[exp.category]) {
      categoryTotals[exp.category] =
        categoryTotals[exp.category] + exp.amount;
    } else {
      categoryTotals[exp.category] = exp.amount;
    }
  });
let overallTotal = 0;

state.expenses.forEach((exp) => {
  overallTotal = overallTotal + exp.amount;
});
  

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

        <button>Add Expense</button>
      </form>

      {/* CATEGORY TOTALS */}
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

      {/* FILTERS */}
      <div>
        <h3>Filters</h3>

        <div>
          <label>Category:</label>
          <select
            onChange={(e) =>
              dispatch({ type: "SET_CATEGORY", payload: e.target.value })
            }
          >
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
          <input
            type="date"
            onChange={(e) =>
              dispatch({ type: "SET_DATE", payload: e.target.value })
            }
          />
        </div>

        <div>
          <label>Min Amount:</label>
          <input
            type="number"
            onChange={(e) =>
              dispatch({ type: "SET_MIN_AMOUNT", payload: e.target.value })
            }
          />
        </div>

        <div>
          <label>Max Amount:</label>
          <input
            type="number"
            onChange={(e) =>
              dispatch({ type: "SET_MAX_AMOUNT", payload: e.target.value })
            }
          />
        </div>

        <div>
          <label>Sort:</label>
          <select
            onChange={(e) =>
              dispatch({ type: "SET_SORT", payload: e.target.value })
            }
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* FINAL LIST */}
      <div>
        <h3>Expenses</h3>
        {filteredExpenses.map((exp, index) => (
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