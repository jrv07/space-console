import { createSlice, configureStore } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    results: null,
    loading: false,
    error: null,
    pinnedCharts: [],
    queryHistory: [], // Store { query, results }
  },
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setResults(state, action) {
      state.loading = false;
      state.results = action.payload;
      // Add to history
      state.queryHistory.unshift(action.payload);
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
      // Add error to history
      state.queryHistory.unshift({ query: action.payload.query, results: [{ error: action.payload.message }] });
    },
    pinChart(state, action) {
      const chart = action.payload;
      if (!state.pinnedCharts.some(c => c.title === chart.title)) {
        state.pinnedCharts.push(chart);
      }
    },
    unpinChart(state, action) {
      state.pinnedCharts = state.pinnedCharts.filter(c => c.title !== action.payload);
    },
    clearSearch(state) {
      state.results = null;
      state.error = null;
      state.loading = false;
      state.queryHistory = [];
    },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, username: null, token: null },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      state.pinnedCharts = [];
    },
  },
});

export const { setLoading, setResults, setError, pinChart, unpinChart, clearSearch } = dataSlice.actions;
export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    auth: authSlice.reducer,
  },
});