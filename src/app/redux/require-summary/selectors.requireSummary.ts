// app/redux/requireSummary/selectors.requireSummary.ts
import { RootState } from '../store';

// User selectors
export const selectRequireSummaries = (state: RootState) => state.requireSummary.requireSummaries;
export const selectSelectedRequireSummary = (state: RootState) => state.requireSummary.selectedRequireSummary;
export const selectRequireSummaryLoading = (state: RootState) => state.requireSummary.loading;
export const selectRequireSummaryError = (state: RootState) => state.requireSummary.error;
export const selectRequireSummaryPagination = (state: RootState) => state.requireSummary.pagination;
