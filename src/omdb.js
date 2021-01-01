import env from './env';
import { store, searchSlice } from './Store';

function JSON_to_urlencoded(obj) {
    let url = '';
    Object.keys(obj).forEach((key) => {
        url += `${key}=${obj[key].replace('&', 'and').replace('=', '').replace(' ', '+')}&`
    })
    return url.slice(0, -1);
}

function searchMovies(title) {
    return new Promise((resolve, reject) => {
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
                    searchText: title
                }));
                resolve(body.Search);
            }).catch(err => {
                reject(err);
            })
    })
}

async function getNextPage() {
    return new Promise((resolve, reject) => {
        const { search, resultsRemaining } = store.getState();

        // Check if there is another page
        if(resultsRemaining <= 0) {
            reject(new Error("No more results"));
        }

        const options = {
            apikey: env.OMDB_API_KEY,
            s: search.searchText,
            page: String(search.page + 1)
        }

        fetch(`http://www.omdbapi.com/?${JSON_to_urlencoded(options)}`)
            .then(resp => resp.json())
            .then(body => {
                store.dispatch(searchSlice.actions.nextPage({
                    newResults: body.Search.length
                }));
                console.log(body);
                resolve(body.Search);
            })
            .catch(err => {
                reject(new Error(err));
            })
    })
}

export { searchMovies, getNextPage };
