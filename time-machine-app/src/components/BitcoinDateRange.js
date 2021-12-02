import React from "react";

const BitcoinDateRange = ({ priceOfDay }) => {
  return (
    <div>
      <br />
      <div>
        {priceOfDay.length > 0 ? (
          <div>
            <hr />
            <h2>Selected days and prices</h2>
            <table>
              <tbody>
                <tr>
                  <th>Day</th>
                  <th>EUR/BTC</th>
                  <th>Coinbase timestamp</th>
                </tr>
                {priceOfDay.map((m, index) => (
                  <tr key={index}>
                    <td>{new Date(m[0]).toISOString().split("T")[0]}</td>
                    <td>{m[1]} </td>
                    <td>{m[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BitcoinDateRange;
