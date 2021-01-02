import { createSlice, configureStore } from '@reduxjs/toolkit';

const nominationsSlice = createSlice({
    name: 'nominations',
    initialState: {
        nominations: []
    },
    reducers: {
        addNom: (state, action) => {
            state.nominations.push(action.payload);
        },
        removeNom: (state, action) => {
            state.nominations = state.nominations.filter((item) =>
                                                         item.imdbID !== action.payload
                                                        );
        }
    }
});

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        totalResults: 0,
        resultsRemaining: 0,
        page: 0,
        searchText: '',
        results: [],
    },
    reducers: {
        newSearch: (state, action) => {
            const { results, totalResults, newResults, searchText } = action.payload;
            state.totalResults = totalResults;
            state.resultsRemaining = totalResults - newResults;
            state.page = 1;
            state.searchText = searchText;
            state.results = results;
        },
        nextPage: (state, action) => {
            state.page++;
            state.resultsRemaining -= action.payload.newResults.length;
            state.results = [...state.results, ...action.payload.newResults];
        }
    }
});

const moreInfoSlice = createSlice({
    name: "more-info",
    initialState: {
        id: null,
        data: null
    },
    reducers: {
        setID: (state, action) => {
            state.id = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
        wipeMoreInfo: (state) => {
            state.id = null;
            state.data = null;
        }
    }
})

const store = configureStore({
    reducer: {
        nominations: nominationsSlice.reducer,
        search: searchSlice.reducer,
        moreInfo: moreInfoSlice.reducer
    },
});

export { nominationsSlice, searchSlice, moreInfoSlice, store };
