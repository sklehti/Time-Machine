import React from "react";

const HighestTradingVolume = (props) => {
  const { maxVolumeDay, maxVolumeEur } = props;

  return (
    <div>
      {maxVolumeDay !== "" && maxVolumeEur !== "" ? (
        <div>
          <hr />
          <h2>The highest trading volume</h2>
          <p>
            The date with the highest trading volume is {maxVolumeDay} and the
            volume on that day in euros is {maxVolumeEur}
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HighestTradingVolume;
