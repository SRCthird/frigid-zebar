import { shellExec, WeatherOutput } from "zebar";

type Props = {
  weather: WeatherOutput | null
}
const getWeatherIcon = (weatherOutput: WeatherOutput) => {
  switch (weatherOutput.status) {
    case 'clear_day':
      return <i className="nf nf-weather-day_sunny"></i>;
    case 'clear_night':
      return <i className="nf nf-weather-night_clear"></i>;
    case 'cloudy_day':
      return <i className="nf nf-weather-day_cloudy"></i>;
    case 'cloudy_night':
      return <i className="nf nf-weather-night_alt_cloudy"></i>;
    case 'light_rain_day':
      return <i className="nf nf-weather-day_sprinkle"></i>;
    case 'light_rain_night':
      return <i className="nf nf-weather-night_alt_sprinkle"></i>;
    case 'heavy_rain_day':
      return <i className="nf nf-weather-day_rain"></i>;
    case 'heavy_rain_night':
      return <i className="nf nf-weather-night_alt_rain"></i>;
    case 'snow_day':
      return <i className="nf nf-weather-day_snow"></i>;
    case 'snow_night':
      return <i className="nf nf-weather-night_alt_snow"></i>;
    case 'thunder_day':
      return <i className="nf nf-weather-day_lightning"></i>;
    case 'thunder_night':
      return <i className="nf nf-weather-night_alt_lightning"></i>;
  }
}

const Weather = ({ weather }: Props) => {
  if (weather) {
    return (
      <button 
        className="interactive weather"
        onClick={()=> shellExec('powershell', '-Command Start-Process bingweather://')}
      >
        {getWeatherIcon(weather)}
        {Math.round(weather.celsiusTemp)}°C
      </button>
    )
  } else {
    return <></>
  }
}

export default Weather;
