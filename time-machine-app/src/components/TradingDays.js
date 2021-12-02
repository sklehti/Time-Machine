import React from "react";

const TradingDays = (props) => {
  const { noTrading, bestDayToBuy, worstDayToBuy } = props;

  return (
    <div>
      <br />
      {!noTrading ? (
        <div className="text">
          <hr />
          <h2> The day to buy and the day to sell</h2>
          <p>
            The best day to buy is {bestDayToBuy} and the worst day to sell is{" "}
            {worstDayToBuy}.
          </p>
        </div>
      ) : noTrading && bestDayToBuy.length > 0 && worstDayToBuy.length > 0 ? (
        <div>
          <h2> The day to buy and the day to sell</h2>
          <p>It is better not buying or selling during this period.</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TradingDays;
