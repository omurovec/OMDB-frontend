import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Award, AwardFilled, Search, Poster, Exit } from './Icons/';
import { store, nominationsSlice, moreInfoSlice } from './Store';
import { getMovieData } from './omdb';

const selectNominationIDs = state => state.nominations.nominations.map(item => item.imdbID);
const selectMoreInfoID = state => state.moreInfo.id;
const selectMoreInfoData = state => state.moreInfo.data;
const selectMaxNominations = state => state.nominations.nominations.length >= 5;

const SearchBar = (props) => (
  <div className="container searchbar">
    <img src={Search} alt="search"/>
    <input
      onFocus={props.onFocus}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
      placeholder="Search"/>
  </div>
);

const Banner = (props) => {
  const maxNominations = useSelector(selectMaxNominations);

  return (
    <div className={`banner container ${maxNominations?null:"hidden"}`}>
      <h3>{props.text}</h3>
    </div>
  )
}

const Toggle = (props) => (
  <ul className="toggle">
    {props.labels.map((item, index) => (
      <li key={item}>
        <h2 className={props.focused===index ? "focused" : null}
            onClick={() => props.setIndex(index)}>
          {item}
        </h2>
      </li>
    ))}
  </ul>
)

const ListItem = (props) => {
  const maxNominations = useSelector(selectMaxNominations);

  return (
    <li>
      <img
        onClick={() => {
          store.dispatch(moreInfoSlice.actions.setID(props.imdbID));
        }}
        src={props.Poster === "N/A" ? Poster : props.Poster}
        alt="poster"
        className="poster"/>
      <div onClick={() => {
          store.dispatch(moreInfoSlice.actions.setID(props.imdbID));
        }}>
        <h3>
          {props.Title}
          {/* <span className="year"> - {props.Year}</span> */}
        </h3>
        <p>{props.Year}</p>
        <p>{props.Type}</p>
        <p className="see-more">
          See more...
        </p>
      </div>
      <img
        onClick={() => {
          if(props.selected) {
            store.dispatch(nominationsSlice.actions.removeNom(props.imdbID))
          } else if(!maxNominations) {
              store.dispatch(nominationsSlice.actions.addNom(props));
          }
        }}
        src={props.selected ? AwardFilled : Award}
        alt="award"
        className={`award ${maxNominations&&!props.selected?'disabled':null}`}
      />
    </li>
  )
}

const ListContainer = (props) => {
  const nominationIDs = useSelector(selectNominationIDs);

  return (
      <div className="container">
        {props.altHeader?
        props.altHeader:
        <h2>{props.title}</h2>}
        <ul className="list">
          {props.data && props.data.length > 0 ?
           props.data.map(item =>
                          <ListItem
                            {...item}
                            key={item.imdbID}
                            selected={nominationIDs.indexOf(item.imdbID)+1}
                            />)
          :
          <p>0 {props.title}...</p>
          }
          {props.altFooter ?? null}
        </ul>
      </div>
  );
}

const MoreInfo = (props) => {
  const imdbID = useSelector(selectMoreInfoID);
  const data = useSelector(selectMoreInfoData);
  const nominations = useSelector(selectNominationIDs);
  const maxNominations = useSelector(selectMaxNominations);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if(imdbID && !data) {
      getMovieData(imdbID);
    }
  }, [imdbID, data]);

  useEffect(() => {
    setSelected(nominations.indexOf(imdbID)+1);
  }, [nominations, imdbID])

  return imdbID ?
      <div id="more-info">
        {data?
         <div className="container">
           <img
             onClick={() => {
               store.dispatch(moreInfoSlice.actions.wipeMoreInfo());
             }}
             className="exit"
             src={Exit}
             alt="exit"/>
           <div className="scroll-content">
              <div className="info">
                <img
                    src={data.Poster === "N/A" ? Poster : data.Poster}
                    alt="poster"
                    className="poster"/>
                <div className="text">
                  <div className="title">
                    <h1>{data.Title}</h1>
                    <img
                      onClick={() => {
                        if(selected) {
                          store.dispatch(nominationsSlice.actions.removeNom(imdbID))
                        } else if(!maxNominations) {
                            store.dispatch(nominationsSlice.actions.addNom({
                                          Title: data.Title,
                                          Year: data.Year,
                                          Type: data.Type,
                                          Poster: data.Poster,
                                          imdbID,
                                        }));
                        }
                      }}
                      src={selected?AwardFilled:Award}
                      className={`award ${maxNominations&&!selected?"disabled":null}`}
                      alt="award"/>
                  </div>
                  <h4>Release Date: {data.Released}</h4>
                  <h4>Rated: {data.Rated}</h4>
                  <h4>Rating: {data.imdbRating}</h4>
                  <h4>Runtime: {data.Runtime}</h4>
                  <h4>Genre: {data.Genre}</h4>
                </div>
              </div>
              <p className="plot">{data.Plot}</p>
           </div>
         </div>
         :
         null
        }
      </div>
    :
      null
}

export { SearchBar, Banner, Toggle, ListContainer, MoreInfo };
