import React, {useState, useEffect, useRef} from 'react';
import style from "./index.css"

const Leaderboard = function (props) {

  const [data, setData] = useState(props.tableData)
  const valRef = useRef(data);
  useEffect(() => {
      console.log(props.tableData)
      setData(props.tableData)
      valRef.current = props.tableData
    }, [props.tableData]);

  return (
    <div className={style['container']}>
      <table>
        <thead>
          <tr>
            <td className={style['slno']}>Sl. No</td>
            <td className={style['rank']}>Rank</td>
            <td className={style['slayer']}>Slayer</td>
            <td className={style['time']}>Time</td>
          </tr>
        </thead>
        <tbody>
        {data.map((i,j) => (
            <tr>
              <td>{j+1}</td>
              <td>{i["Rank No"]}</td>
              <td className={i['isAlreadyPresent'] ? style['cross'] : "false"}>{i["Slayer Name"]}</td>
              <td>{i["Time"]}</td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
};

export default Leaderboard;
