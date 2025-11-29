import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
const WorldMap = require('react-svg-worldmap').WorldMap;

const SimpleMap = (props) => {
  const [data, setData] = useState([
    { "country": "US", "value": 0 },
    { "country": "JP", "value": 0 },
    { "country": "CN", "value": 0 },
    { "country": "KR", "value": 0 },
  ]);

  const router = useRouter();

 
  useEffect(() => {
    if (props.data && Array.isArray(props.data)) {
      const tempData = props.data
        .filter((item) => item[0] != null)
        .map((item) => ({
          country: item[0],
          value: item[1],
        }));
      setData(tempData);
    }
  }, [props.data]);

  //  Handle clicks on countries
  const onClick = (e) => {
    if (props.clickHandler) {
      props.clickHandler(e.countryCode, e.countryValue);
    } else {

      router.push(`/country/${e.countryCode}`);
    }
  };
  return (
    <div>
      <div
        id="root"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "fit-content",
          height: "auto",
          color: props.color || "grey",
          backgroundColor: props.backgroundColor || "transparent",
          borderColor: props.borderColor || "grey"
        }}
      >
        <WorldMap
          color={props.color || "grey"}
          valueSuffix={(props.suffix) ? props.suffix : "players"}
          size="responsive"
          data={data}
          style={{ width: "100%" }}
          backgroundColor={props.backgroundColor || '#020b26'}
          borderColor={props.borderColor || 'grey'}
          onClickFunction={(e) => {onClick(e)}}
        />
      </div>
      <h2 style={{ textAlign: "center", marginTop: "auto", fontSize: "0.8rem"}}>
        {props.label}
      </h2>
    </div>
  );
};

export default SimpleMap;
