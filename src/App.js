import React, { useState } from "react";
import axios from "axios";
import BitcoinForm from "./components/BitcoinForm";
import BitcoinDateRange from "./components/BitcoinDateRange";
import ImpairmentOfBitcoin from "./components/ImpairmentOfBitcoin";
import HighestTradingVolume from "./components/HighestTradingVolume";
import TradingDays from "./components/TradingDays";

import logo from "./images/logo512.png";

import "./App.css";

const App = () => {
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [priceOfDay, setPriceOfDay] = useState([]);
  const [maxRangeFirstDay, setMaxRangeFistDay] = useState("");
  const [maxRangeLastDay, setMaxRangeLastDay] = useState("");
  const [maxRangeDays, setMaxRangeDays] = useState(0);
  const [maxVolumeDay, setMaxVolumeDay] = useState("");
  const [maxVolumeEur, setMaxVolumeEur] = useState("");
  const [bestDayToBuy, setBestDayToBuy] = useState([]);
  const [worstDayToBuy, setWorstDayToBuy] = useState([]);
  const [noTrading, setNotrading] = useState(true);

  const toTimestamp = (year, month, day, hour, minute, second) => {
    var datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    return datum.getTime() / 1000;
  };

  const dividedToDate = (day) => {
    const dividedDateTemp_1 = day.split("T", 2);
    const dividedDateTemp_2 = dividedDateTemp_1[0].split("-", 3);
    const dividedTime = dividedDateTemp_1[1].split(":", 2);
    return dividedDateTemp_2.concat(dividedTime[0]);
  };

  const dateToISO = (time) => {
    return new Date(time).toISOString();
  };

  /**
   *
   * returns x searching data for the selected period per day
   *
   * @param {prices} x prices (and timeStamp) from the date range
   * @returns {datesAndPrices}
   *
   */
  const dateWithinGivenDateRange = (prices) => {
    let tempDay = [];
    let day = [];
    let datesAndPrices = [];

    for (let i = 0; i < prices.length; i++) {
      const date = dateToISO(prices[i][0]);
      const dividedDate = dividedToDate(date);

      if (
        dividedDate[2] > tempDay ||
        (tempDay > dividedDate[2] && dividedDate[2] === "01")
      ) {
        if (day.length > 0) {
          datesAndPrices.push(day);
        }
        tempDay = dividedDate[2];
      }
      day = prices[i];
    }
    return datesAndPrices;
  };

  /**
   *
   * returns x highest trading volume of Bitcoin
   *
   * @param {tempVolumeArray} x  volumes (and timeStamp) from the date range
   * @returns
   */
  const highestDateVolume = (tempVolumeArray) => {
    let bestVolume = [];

    for (let i = 0; i < tempVolumeArray.length; i++) {
      if (bestVolume[1] < tempVolumeArray[i][1] || bestVolume.length < 1) {
        bestVolume = [...tempVolumeArray[i]];
      }
    }

    return bestVolume;
  };

  /**
   *
   * return x the longest bearish (downward) trend of Bitcoin
   * and the bestday to buy and the best day to sell of Bitcoin
   *
   * @param {event} x event
   */
  const addDayRange = (event) => {
    event.preventDefault();
    try {
      const start = dividedToDate(startDay);
      const end = dividedToDate(endDay);

      const startTimeStamp = toTimestamp(
        start[0],
        start[1],
        start[2],
        start[3],
        0,
        0
      );

      let hours = parseInt(end[3]);
      hours += 1;
      const endTimeStamp = toTimestamp(end[0], end[1], end[2], hours, 0, 0);

      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${startTimeStamp}&to=${endTimeStamp}`
        )
        .then((response) => {
          const datesAndPrices = dateWithinGivenDateRange(response.data.prices);
          setPriceOfDay(datesAndPrices);

          let tempArray = [];
          let tempArrayLowerPrice = [];
          let tempVolumeArray = [];
          let lastPrice = [];
          let numberOfDays = 0;
          let maxNumber = 0;
          let maxLowerPriceRange = [];
          let maxLowerPriceRange_2 = [];

          tempArray = [...datesAndPrices];
          tempArrayLowerPrice = [...datesAndPrices];
          tempVolumeArray = [...response.data.total_volumes];

          // The longest bearish (downward) trend of Bitcoin
          for (var i = 0; i < tempArrayLowerPrice.length; i++) {
            if (
              lastPrice[1] > tempArrayLowerPrice[i][1] ||
              lastPrice.length < 1
            ) {
              numberOfDays += 1;
              maxLowerPriceRange.push(tempArrayLowerPrice[i]);
              lastPrice = tempArrayLowerPrice[i];
            } else {
              if (numberOfDays > maxNumber) {
                maxNumber = numberOfDays;
                maxLowerPriceRange_2 = maxLowerPriceRange;
              }
              maxLowerPriceRange = [];

              numberOfDays = 0;
              lastPrice = [];
            }

            if (tempArrayLowerPrice.length === 1) {
              maxLowerPriceRange_2 = maxLowerPriceRange;
            }
            if (
              tempArrayLowerPrice.length - 1 === i &&
              maxLowerPriceRange_2.length < 1
            ) {
              maxLowerPriceRange_2 = maxLowerPriceRange;
            }
          }

          let maxRangeFirstDayTemp = dateToISO(maxLowerPriceRange_2[0][0]);
          let maxRangeLastDayTemp = dateToISO(
            maxLowerPriceRange_2[maxLowerPriceRange_2.length - 1][0]
          );
          setMaxRangeFistDay(maxRangeFirstDayTemp.slice(0, 10));
          setMaxRangeLastDay(maxRangeLastDayTemp.slice(0, 10));
          setMaxRangeDays(maxNumber);

          const bestVolume = highestDateVolume(tempVolumeArray);

          let maxVolumeTemp = new Date(bestVolume[0]).toISOString();
          setMaxVolumeDay(maxVolumeTemp.slice(0, 10));
          setMaxVolumeEur(bestVolume[1]);

          let dontSellOrBuyTemp = false;
          let lowestPrice = [];
          let highestPrice = [];

          // The bestday to buy and the best day to sell of Bitcoin
          for (i = 0; i < tempArray.length; i++) {
            if (lowestPrice[1] > tempArray[i][1] || lowestPrice.length < 1) {
              lowestPrice = tempArray[i];
            }
            if (highestPrice[1] < tempArray[i][1] || highestPrice.length < 1) {
              highestPrice = tempArray[i];
            }
            if (
              lowestPrice[i] >= tempArray[tempArray.length - 1] ||
              tempArray.length === 1
            ) {
              dontSellOrBuyTemp = true;
            } else {
              dontSellOrBuyTemp = false;
            }
          }

          let bestDayTemp = dateToISO(lowestPrice[0]);
          let worstDayTemp = dateToISO(highestPrice[0]);

          setBestDayToBuy(bestDayTemp.slice(0, 10));
          setWorstDayToBuy(worstDayTemp.slice(0, 10));
          setNotrading(dontSellOrBuyTemp);
        });
    } catch (e) {
      alert("Select the start day and end day you want to view");
    }
  };

  const handleStartDay = (event) => {
    setStartDay(event.target.value);
  };

  const handleEndDay = (event) => {
    setEndDay(event.target.value);
  };

  return (
    <div className="backgroundStyle">
      <section>
        <div>
          <img src={logo} alt="Logo" />
        </div>

        <BitcoinForm
          addDayRange={addDayRange}
          startDay={startDay}
          handleStartDay={handleStartDay}
          endDay={endDay}
          handleEndDay={handleEndDay}
        />
        <div>
          <ImpairmentOfBitcoin
            maxRangeFirstDay={maxRangeFirstDay}
            maxRangeLastDay={maxRangeLastDay}
            maxRangeDays={maxRangeDays}
          />
        </div>
        <HighestTradingVolume
          maxVolumeDay={maxVolumeDay}
          maxVolumeEur={maxVolumeEur}
        />
        <TradingDays
          noTrading={noTrading}
          bestDayToBuy={bestDayToBuy}
          worstDayToBuy={worstDayToBuy}
        />
        <BitcoinDateRange priceOfDay={priceOfDay} />
      </section>
    </div>
  );
};

export default App;
