import env from './env';
import { store, searchSlice } from './Store';

function JSON_to_urlencoded(obj) {
    let url = '';
    Object.keys(obj).forEach((key) => {
        url += `${key}=${encodeURIComponent(obj[key])}&`
    })
    return url.slice(0, -1);
}

function searchMovies(title) {
    const options = {
        apikey: env.OMDB_API_KEY,
        s: title
    }

    fetch(`http://www.omdbapi.com/?${JSON_to_urlencoded(options)}`)
        .then(resp => resp.json())
        .then((body) => {
            store.dispatch(searchSlice.actions.newSearch({
                totalResults: Number(body.totalResults),
                newResults: body.Search?.length,
                searchText: title,
                results: body.Search
            }));
        }).catch(err => {
            console.warn(err);
        })
}

async function getNextPage() {
    const { search, resultsRemaining } = store.getState();

    // Check if there is another page
    if(resultsRemaining <= 0) {
        console.warn(new Error("No more results"));
    } else {
        const options = {
            apikey: env.OMDB_API_KEY,
            s: search.searchText,
            page: String(search.page + 1)
        }

        fetch(`http://www.omdbapi.com/?${JSON_to_urlencoded(options)}`)
            .then(resp => resp.json())
            .then(body => {
                store.dispatch(searchSlice.actions.nextPage({
                    newResults: body.Search
                }));
            })
            .catch(err => {
                console.warn(err);
            });
    }
}

export { searchMovies, getNextPage };
