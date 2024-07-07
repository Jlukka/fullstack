import axios from 'axios'

const getWeather = (coords, apikey) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${apikey}&units=metric`)
}

export default {getWeather}