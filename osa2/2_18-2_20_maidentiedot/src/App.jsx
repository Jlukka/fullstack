import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const api_key = import.meta.env.VITE_SOME_KEY


const ShowButton = ({country, onClick}) => (
  <button onClick = {() => onClick([country])}>
    show
  </button>
)

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase())
  }

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const CountryLine = ({country, onClick}) => {
  return (
    <li>{country.name.common} <ShowButton country={country} onClick={onClick}/></li>
  )
}

const Weather = ({capital, weather}) => {
  if (weather === null) {
    return null
  }
  return (
    <div>
    <h2>Weather {capital}</h2>
    <p>Temperature {weather.main.temp}°C</p>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
    <p>Wind {weather.wind.speed} m/s </p>
    </div>
  )
}


const CountryData = ({country, weather}) => {
  return (
    <div>
    <h1>{country.name.common}</h1>
    <h3>{country.name.official}</h3>
    <h2>Basic information</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area} km²</p>
    <h2>Languages</h2>
    <ul>
    {
    Object.values(country.languages).map(langauge => 
    <li>{langauge}</li>
    )}
    </ul>
    <img src={country.flags.png}></img>
    <Weather capital={country.capital} weather={weather}/> 
    </div>
  )
}

const CountryDisplay = (props) => {
  console.log(props.countries)
  if (props.countries === null) {
    return null
  }
  if (props.countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } if (props.countries.length === 1) {
    props.setSelected(props.countries[0])
    console.log(props.selected)
    return <CountryData country={props.selected} weather={props.weather}/>
  } else {
  return (
    <ul>
      {
      props.countries.map((country) => <CountryLine country={country} onClick={props.onClick}/>)
      }
  </ul>
  )
  }
}

function App() {
  const [countryList, setCountryList] = useState(null)
  const [filter, setFilter] = useState(null)
  const [weather, setWeather] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {

    if (filter) {
      countryService
      .getAll()
      .then(response => {
      const countries = response.data
                    .filter(country => 
                    country.name.common
                    .toLowerCase()
                    .includes(filter))
      setCountryList(countries)
      })
    }
  }, [filter])

  useEffect(() => {
    if  (!(selected === null)) {
      console.log(selected.capitalInfo.latlng)
      weatherService
      .getWeather(selected.capitalInfo.latlng, api_key)
      .then(response => {
        setWeather(response.data)
        console.log(response.data.weather)
      })
    }
  },[selected])

  return (
    <>
    <Filter filter={filter} setFilter={setFilter} />
    <CountryDisplay countries={countryList} onClick={setCountryList} selected={selected} setSelected={setSelected} weather={weather} setWeather={setWeather}/>
    </>
  )
}

export default App
