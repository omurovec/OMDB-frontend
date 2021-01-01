import { Award, AwardFilled, Search, Poster } from './Icons/';

const SearchBar = (props) => (
  <div className="container searchbar">
    <img src={Search} alt="search"/>
    <input
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
      placeholder="Search"/>
  </div>
);

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

const ListItem = (props) => (
  <li>
    <img
      src={props.Poster === "N/A" ? Poster : props.Poster}
      alt="poster"
      className="poster"/>
    <div>
      <h3>
        {props.Title}
        {/* <span className="year"> - {props.Year}</span> */}
      </h3>
      <p>{props.Year}</p>
      <p>{props.Type}</p>
      <p className="see-more" onClick={() => {
          //TODO: Open Model
      }}>
        See more...
      </p>
    </div>
    <img
      src={props.selected ? AwardFilled : Award}
      alt="award"
      className="award"
    />
  </li>
)

const ListContainer = (props) => (
    <div className="container">
      {props.altHeader?
      props.altHeader:
      <h2>{props.title}</h2>}
      <ul className="list">
        {props.data && props.data.length > 0 ?
         props.data.map(item => <ListItem key={item.imdbID} {...item}/>)
         :
         <p>0 {props.title}...</p>
        }
        {props.altFooter ?? null}
      </ul>
    </div>
);

export { SearchBar, Toggle, ListContainer };
