const Country = ({name, capital, area, languages, flag, temperature, wind, icon}) =>{
    const weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`
    return(
      <div>
        <h1>{name}</h1>
        <p>
          capital {capital}<br></br>
          area {area}
        </p>
        <h3>languages:</h3>
        <ul>
          {languages.map(language=><li key={language}>{language}</li>)}
        </ul>
        <img src={flag.png} alt={flag.alt} />
        <h2>Weather in {capital}</h2>
        temperature {temperature}<br></br>
        <img src={weatherIcon}/><br></br>
        wind {wind}
      </div>
    )
  }

  export default Country