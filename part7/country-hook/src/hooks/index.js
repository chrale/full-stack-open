import axios from 'axios'
import { useState, useEffect } from "react"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const getCountry = async (name) => {
  const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
  return response.data
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return undefined
    }

    getCountry(name)
      .then(country => {
        setCountry({
            found: true,
            data: {
                name: country.name.common,
                capital: country.capital[0],
                population: country.population,
                flag: country.flags.png
            }
        })
      })
      .catch(error => {
        setCountry({ found: false })
    })
  }, [name])

  return country
}