const CountrySearch = ({search, handleSearch}) => {

    return (
     <div>
        Find countries: <input value={search} onChange={handleSearch}/>
     </div>
    )
  }

  export default CountrySearch