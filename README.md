# Expense Tracker

personal expense tracker built with react and typescript

## what it does

- add expenses with amount, category, date, and notes
- edit and delete expenses
- filter by category, date, and amount range
- search expenses
- sort by date or amount
- pie chart showing spending breakdown
- all data stored in browser (no backend)

## tech stack

- react 19
- typescript
- tailwind css v4
- recharts for the pie chart
- vite

## how to run

```bash
npm install
npm run dev
```

## how to build

```bash
npm run build
```

output goes to `dist` folder

## project structure

```
src/
  actions/          - action creators
  reducers/         - expense and filter reducers
  components/       - EntryForm component
```

## features

- add/edit/delete expenses
- category-wise breakdown
- search and filter
- sort by recent or highest
- pie chart visualization

that's it
