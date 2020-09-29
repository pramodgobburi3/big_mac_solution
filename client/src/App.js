import React, { useEffect, useState } from 'react';
import http from 'http';
import './App.css';
import ip from 'public-ip';

import Middle from './components/Middle';
import Bottom from './components/Bottom';

const FETCH_COUNTRY_URL = 'http://localhost:8000/get-country/';

const App = props => {
  const [country, setCountry] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function fetchCountry() {
      // Get IP address and make request to server with IP
      const IP = await ip.v4();
      try {
        http.get(FETCH_COUNTRY_URL + IP, (r) => {
          r.setEncoding('utf-8');
          r.on('data', (data) => {
            var jsonData = JSON.parse(data);
            if (r.statusCode === 200) {
              setCountry(jsonData.data.country_name);
            }
          });
        });
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchCountry();
  }, []);

  return (
    <div className="App">
      <div className="Top">
        <p>You are in {country}</p>
        <p>Please enter an amount of money in your local currency</p>
        <input aria-label="amountInput" id="amountInput" type="number" min={0} step={0.1} value={amount} onChange={e => setAmount(e.target.value)}/>
      </div>
      <div className="Middle">
        <Middle country={country} amount={amount} />
      </div>
      <div className="Bottom">
        <Bottom country={country} amount={amount} />
      </div>
    </div>
  )
};

export default App;
