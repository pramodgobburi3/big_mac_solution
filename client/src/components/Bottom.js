import React, { useEffect, useState } from 'react';
import http from 'http';

const FETCH_RANDOM_URL = 'http://localhost:8000/random-result/'
const Bottom = props => {
  const [localPrice, setLocalPrice] = useState(0);
  const [localDollarPrice, setLocalDollarPrice] = useState(0);
  const [randomCountryName, setRandomCountryName] = useState('');
  const [randomDollarPrice, setRandomDollarPrice] = useState(0);
  const [numOfBigMacs, setNumOfBigMacs] = useState(0);
  const [currencyExchange, setCurrencyExchange] = useState(0);

  useEffect(() => {
    // Get local results
    try {
      if (props.country) {
        http.get(FETCH_RANDOM_URL + props.country , (r) => {
          r.setEncoding('utf-8');
          r.on('data', (data) => {
            if (r.statusCode === 200) {
              var jsonData = JSON.parse(data);
              setRandomCountryName(jsonData.payload.random_result.Country);
              setLocalPrice(jsonData.payload.country_result['Local price']);
              setLocalDollarPrice(jsonData.payload.country_result['Dollar price']);
              setRandomDollarPrice(jsonData.payload.random_result['Dollar price']);
            }
          });
        });
      }
    } catch (err) {
      console.log('err', err);
    }
  }, [props.country]);

  useEffect(() => {
    if (localDollarPrice !== 0 || randomDollarPrice !== 0) {
      setNumOfBigMacs(Math.floor((props.amount / localPrice) * (localDollarPrice / randomDollarPrice)));
      setCurrencyExchange(props.amount * (localDollarPrice / randomDollarPrice));
    }
  }, [props.amount]);

  return (
    <div>
      <p>Random Country: {randomCountryName}</p>
      <p>You could buy {numOfBigMacs} of Big Macs in {randomCountryName}</p>
      <p>Your {props.amount} is worth about {currencyExchange} in {randomCountryName}</p>
    </div>
  )
};

export default Bottom;