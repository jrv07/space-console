import { createSlice, configureStore } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    results: null,
    loading: false,
    error: null,
    pinnedCharts: [],
    queryHistory: [],
  },
  reducers: {
    setLoading(state) {
      console.log('store.js: setLoading dispatched, setting loading to true');
      state.loading = true;
      state.error = null;
    },
    setResults(state, action) {
      console.log('store.js: setResults dispatched, setting loading to false');
      state.loading = false;
      state.results = action.payload;
      state.queryHistory.unshift(action.payload);
    },
    setError(state, action) {
      console.log('store.js: setError dispatched, setting loading to false');
      state.loading = false;
      state.error = action.payload;
      state.queryHistory.unshift({
        query: action.payload.query,
        results: [{ error: action.payload.message }],
      });
    },
    pinChart(state, action) {
      const chart = action.payload;
      if (!state.pinnedCharts.some((c) => c.title === chart.title)) {
        state.pinnedCharts.push(chart);
      }
    },
    unpinChart(state, action) {
      state.pinnedCharts = state.pinnedCharts.filter(
        (c) => c.title !== action.payload
      );
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

export const {
  setLoading,
  setResults,
  setError,
  pinChart,
  unpinChart,
  clearSearch,
} = dataSlice.actions;
export const { login, logout } = authSlice.actions;
export const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    auth: authSlice.reducer,
  },
});