'use strict';

var React = require('react-native');

export async function getETHPrice() {
  const response = await fetch("https://api.coinmarketcap.com/v1/ticker/ethereum/", {method: "GET"});
  const responseText = await response.text();
  if (response.status >= 200) {
    const json = JSON.parse(responseText);
    console.log("eth price: " + responseText);
    return parseFloat(json[0].price_usd);
  } else {
    console.error(responseText);
    return 0;
  }
}

export default { getETHPrice };
