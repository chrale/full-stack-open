import { useEffect, useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import Country from './components/Country'
import CountrySearch from './components/CountrySearch'

const App = () => {
  const [countryNames, setCountryNames] = useState(null)
  const [country, setCountry] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [showCountry, setShowCountry] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(()=>{
    //skip if the search is empty
    if (search) { 
      // countries are fetched
      countryService
        .getCountries()
        .then(countriesData =>{
          const countries = countriesData.map(country => country.name.common) 
          const filteredCountriesNames = countries.filter(name =>name.toLowerCase().includes(search.toLowerCase()))
          if (filteredCountriesNames.length === 1) {
            getCountryData(filteredCountriesNames[0])
          }
          else {
            setCountryNames(filteredCountriesNames)
            setShowCountry(false)
          }
        })
    }
  }, [search])

  const getCountryData=(countryName)=>{
    if (countryName) {
      //fetch the country 
      countryService
      .getCountry(countryName)
      .then(countryData =>{
        const capitalLatLng = Object.values(countryData.capitalInfo)
        const capitalLat = capitalLatLng[0][0]
        const capitalLng = capitalLatLng[0][1]
        weatherService
          .getWeather(capitalLat, capitalLng)
          .then(weatherData =>{
            const country = {
              name: countryName,
              capital: countryData.capital,
              area: countryData.area,
              languages: Object.values(countryData.languages), 
              flag: countryData.flags, 
              temperature: weatherData.main.temp + " Celcius", 
              wind: weatherData.wind.speed + " m/s", 
              icon: weatherData.weather[0].icon       
            }
            setCountry(country)
            setCountryName(countryName)
            setShowCountry(true)
            setCountryNames([countryName])
          })
          
      })
    }
  }

  const handleSearch = (event) =>{
    setSearch(event.target.value)
    if (event.target.value==="") {
      setShowCountry(false)
      setCountry(null)
      setCountryName(null)
      setCountryNames(null)
    }
  }

  const handleShowCountry = (countryName) => {
    getCountryData(countryName)
  }

  if (!countryNames ) { 
    // Countries is empty --> render only search
    return <CountrySearch search={search} handleSearch={handleSearch}/ >
  
  } else if (countryNames.length>10 && search != '' && !showCountry){
    //over 10 countries --> need more specification. Also search not empty
    return (
      <div>
        <CountrySearch search={search} handleSearch={handleSearch}/ >
        Too many matches, specify another filter    
      </div>
    )

  } else if (countryNames.length<11 && countryNames.length>1 && search !='' && !showCountry){
    //less than 10 countries --> show all names. Also search not empty
    return (
      <div>
        <CountrySearch search={search} handleSearch={handleSearch}/ >
        {countryNames.map(countryName=><div key={countryName}>{countryName} <button onClick={()=>handleShowCountry(countryName)}>show</button></div>)}    
      </div>
    )

  } else if (country && countryName===country.name && search!='' && showCountry) {
    // there's only one country, show its info. Also search not empty
    return (
      <div>
        <CountrySearch search={search} handleSearch={handleSearch}/ >
        <Country 
          name={country.name} 
          capital={country.capital} 
          area={country.area} 
          languages={country.languages} 
          flag={country.flag} 
          icon={country.icon} 
          temperature={country.temperature} 
          wind={country.wind}
        />
      </div>
    )
  } else {
    // all other cases e.g. when countries list have items already but searching for wrong name
    return <CountrySearch search={search} handleSearch={handleSearch}/ > 
  }
}

export default App

