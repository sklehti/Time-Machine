import React from "react";

const ImpairmentOfBitcoin = (props) => {
  const { maxRangeFirstDay, maxRangeLastDay, maxRangeDays } = props;

  return (
    <div>
      {maxRangeFirstDay !== "" && maxRangeLastDay !== "" && maxRangeDays > 1 ? (
        <div>
          <hr />
          <h2> The longest bearish (downward) trend </h2>
          <p>
            Price of day {maxRangeLastDay} is lower than price of day{" "}
            {maxRangeFirstDay}
          </p>
          <br />
          <p>
            In bitcoin’s historical data from CoinGecko, the price decreased{" "}
            {maxRangeDays} days in a row for the inputs from {maxRangeFirstDay}{" "}
            to {maxRangeLastDay}.
          </p>
        </div>
      ) : maxRangeDays !== 0 ? (
        <div>
          <hr />
          <h2> The longest bearish (downward) trend </h2>
          <p>
            In bitcoin’s historical data from CoinGecko, there is no information
            of this period.
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ImpairmentOfBitcoin;
