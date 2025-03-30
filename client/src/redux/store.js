import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: { results: null, loading: false, error: null, pinnedCharts: [] },
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setResults(state, action) {
      state.loading = false;
      state.results = action.payload;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    pinChart(state, action) {
      const chart = action.payload;
      // Avoid duplicates by checking title or unique ID
      if (!state.pinnedCharts.some(c => c.title === chart.title)) {
        state.pinnedCharts.push(chart);
      }
    },
    unpinChart(state, action) {
      state.pinnedCharts = state.pinnedCharts.filter(c => c.title !== action.payload);
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
      state.pinnedCharts = []; // Clear pinned charts on logout
    },
  },
});

export const { setLoading, setResults, setError, pinChart, unpinChart } = dataSlice.actions;
export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    auth: authSlice.reducer,
  },
});