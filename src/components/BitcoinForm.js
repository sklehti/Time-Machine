import React from "react";

const BitcoinForm = (props) => {
  const { addDayRange, startDay, handleStartDay, endDay, handleEndDay } = props;

  let today = new Date().toLocaleDateString();
  let maxDay = new Date().toISOString().split(".")[0];
  let minDay = startDay + ":00";

  if (startDay === endDay && startDay !== "" && endDay !== "") {
    alert(
      "Time machine only works with the past: Yesterday is the latest date we can work with."
    );
  }

  return (
    <div>
      <h1> Saara's Time Machine</h1>
      <h4>Today is {today}</h4>
      <br />
      <h2>Date range</h2>
      <form onSubmit={addDayRange}>
        Start day:{" "}
        <input
          type="datetime-local"
          max={maxDay}
          value={startDay}
          onChange={handleStartDay}
        />{" "}
        End day:{" "}
        <input
          type="datetime-local"
          min={minDay}
          value={endDay}
          onChange={handleEndDay}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BitcoinForm;
