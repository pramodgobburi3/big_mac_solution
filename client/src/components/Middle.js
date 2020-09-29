import React, { useEffect, useState } from 'react';
import http from 'http';

const FETCH_LOCAL_RESULTS_URL = 'http://localhost:8000/local-result/'
const Middle = props => {
  const [priceOfBigMac, setPriceOfBigMac] = useState(0);
  const [bigMacs, setBigMacs] = useState(0);
  const [dppp, setDppp] = useState(0);

  useEffect(() => {
    // Get local results
    try {
      if (props.country) {
        var url = FETCH_LOCAL_RESULTS_URL + props.country;

        http.get(url, (r) => {
          r.setEncoding('utf-8');
          r.on('data', (data) => {
            if (r.statusCode === 200) {
              var jsonData = JSON.parse(data);
              setPriceOfBigMac(jsonData.payload['Local price']);
              setDppp(jsonData.payload['Dollar PPP']);
            }
          });
        });
      }
      
    } catch (err) {
      console.log('err', err);
    }
  }, [props.country]);

  useEffect(() => {
    if (priceOfBigMac > 0) {
      setBigMacs(Math.floor(props.amount / priceOfBigMac));
    }
  }, [props.amount])
  return (
    <div>
      <p>You could buy {bigMacs} of Big Macs in your country</p>
      <p>Your Dollar Power Purchasing Parity (PPP) is {dppp} </p>
    </div>
  )
};

export default Middle;