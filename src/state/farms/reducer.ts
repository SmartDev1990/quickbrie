import { createReducer } from '@reduxjs/toolkit';
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
import { GlobalConst } from 'constants/index';
import { updateVersion } from 'state/global/actions';
import { FarmListInfo } from 'types';
import { acceptFarmUpdate, fetchFarmList } from './actions';

export interface FarmsListsState {
	readonly byUrl: {
		readonly [url: string]: {
			readonly current: FarmListInfo | null;
			readonly pendingUpdate: FarmListInfo | null;
			readonly loadingRequestId: string | null;
			readonly error: string | null;
		};
	};
	// this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
	readonly lastInitializedDefaultListOfLists?: string[];
	readonly selectedListUrl: string | undefined;
}

type ListState = FarmsListsState['byUrl'][string];

const NEW_LIST_STATE: ListState = {
	error: null,
	current: null,
	loadingRequestId: null,
	pendingUpdate: null,
};

const { DEFAULT_LP_FARMS_LIST_URL } = GlobalConst.utils;

const DEFAULT_LIST_OF_LISTS = [DEFAULT_LP_FARMS_LIST_URL];

type Mutable<T> = {
	-readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};

const initialState: FarmsListsState = {
	lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
	byUrl: {
		...DEFAULT_LIST_OF_LISTS.reduce<Mutable<FarmsListsState['byUrl']>>((memo, listUrl) => {
			memo[listUrl] = NEW_LIST_STATE;
			return memo;
		}, {}),
	},
	selectedListUrl: DEFAULT_LP_FARMS_LIST_URL,
};

export default createReducer(initialState, (builder) =>
	builder
		.addCase(fetchFarmList.pending, (state, { payload: { requestId, url } }) => {
			state.byUrl[url] = {
				...state.byUrl[url],
				loadingRequestId: requestId,
				error: null,
				current: null,
				pendingUpdate: null,
			};
		})
		.addCase(fetchFarmList.fulfilled, (state, { payload: { requestId, farmList, url } }) => {
			const current = state.byUrl[url]?.current;
			const loadingRequestId = state.byUrl[url]?.loadingRequestId;

			// no-op if update does nothing
			if (current) {
				const upgradeType = getVersionUpgrade(current.version, farmList.version);
				if (upgradeType === VersionUpgrade.NONE) return;
				if (loadingRequestId === null || loadingRequestId === requestId) {
					state.byUrl[url] = {
						...state.byUrl[url],
						loadingRequestId: null,
						error: null,
						current: current,
						pendingUpdate: farmList,
					};
				}
			} else {
				state.byUrl[url] = {
					...state.byUrl[url],
					loadingRequestId: null,
					error: null,
					current: farmList,
					pendingUpdate: null,
				};
			}
		})
		.addCase(fetchFarmList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
			if (state.byUrl[url]?.loadingRequestId !== requestId) {
				// no-op since it's not the latest request
				return;
			}

			state.byUrl[url] = {
				...state.byUrl[url],
				loadingRequestId: null,
				error: errorMessage,
				current: null,
				pendingUpdate: null,
			};
		})
		.addCase(acceptFarmUpdate, (state, { payload: url }) => {
			if (!state.byUrl[url]?.pendingUpdate) {
				throw new Error('accept list update called without pending update');
			}
			state.byUrl[url] = {
				...state.byUrl[url],
				pendingUpdate: null,
				current: state.byUrl[url].pendingUpdate,
			};
		})
		.addCase(updateVersion, (state) => {
			// state loaded from localStorage, but new lists have never been initialized
			if (!state.lastInitializedDefaultListOfLists) {
				state.byUrl = initialState.byUrl;
				state.selectedListUrl = DEFAULT_LP_FARMS_LIST_URL;
			} else if (state.lastInitializedDefaultListOfLists) {
				const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
					(s, l) => s.add(l),
					new Set(),
				);
				const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set());

				DEFAULT_LIST_OF_LISTS.forEach((listUrl) => {
					if (!lastInitializedSet.has(listUrl)) {
						state.byUrl[listUrl] = NEW_LIST_STATE;
					}
				});

				state.lastInitializedDefaultListOfLists.forEach((listUrl) => {
					if (!newListOfListsSet.has(listUrl)) {
						delete state.byUrl[listUrl];
					}
				});
			}

			state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS;

			if (!state.selectedListUrl) {
				state.selectedListUrl = DEFAULT_LP_FARMS_LIST_URL;
				if (!state.byUrl[DEFAULT_LP_FARMS_LIST_URL]) {
					state.byUrl[DEFAULT_LP_FARMS_LIST_URL] = NEW_LIST_STATE;
				}
			}
		}),
);
