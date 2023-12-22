/* eslint-disable react/prop-types */
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on map" />
    );

  const countries = cities.reduce(
    (arr, city) =>
      // out of all the cities we're here filtering out all the countries that were visited to avoid duplicates
      !arr.map((el) => el.country).includes(city.country)
        ? [...arr, { country: city.country, emoji: city.emoji }]
        : arr,
    [] // the accumulator array would start at []
  );
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
