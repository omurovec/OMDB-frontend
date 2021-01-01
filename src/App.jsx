import './App.css';
import { useState, useEffect } from 'react';
import { SearchBar, Toggle, ListContainer } from './Components';
import { searchMovies, getNextPage } from './omdb';
import { useSelector } from 'react-redux';

const selectResultsRemaining = state => state.search.resultsRemaining;
const selectNominations = state => state.nominations;

function App() {
  const resultsRemaining = useSelector(selectResultsRemaining);
  const nominations = useSelector(selectNominations);
  const [width, setWidth] = useState(window.innerWidth);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    window.onresize = () => {
      setWidth(window.innerWidth);
    }
  });

  useEffect(() => {
    if(searchText) {
      searchMovies(searchText).then((searchResults => {
        setResults(searchResults);
      }));
    }
  }, [searchText]);

  const loadMore = () => {
    getNextPage().then((searchResults) => {
      setResults([...results, ...searchResults]);
    }).catch(err => {
      console.warn(err);
    })
  }

  return (
    <div className="App">
      <SearchBar onFocus={() => {setFocused(0)}} onChange={setSearchText}/>
      <div className="row-wrapper">
        {
          width < 1024 ?
            <ListContainer
              altHeader={<Toggle
                        setIndex={setFocused}
                        focused={focused}
                        labels={["Results", "Nominations"]}/>}
              title={focused === 0 ? "Results" : "Nominations"}
              data={focused === 0 ? results : nominations}
              altFooter={resultsRemaining && results ?
                         <p className="load-more" onClick={loadMore}>
                            Load more...
                         </p>
                        : null}
            />
          :
            <>
              <ListContainer
                title='Results'
                data={results}
                altFooter={resultsRemaining && results ?
                         <p className="load-more" onClick={loadMore}>
                            Load more...
                         </p>
                        : null}
              />
              <ListContainer
                title='Nominations'
                data={nominations}
              />
            </>
        }
      </div>
    </div>
  );
}

export default App;
