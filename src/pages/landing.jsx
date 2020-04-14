import React, { useState } from "react";
import Leaderboard from "../components/leaderboard_table/index.jsx";
import DataGeneration from "../components/data_gen/index.jsx";
import style from "./landing.css";

const Landing = function () {
  // This only applies for Squad leaderboard only
  // Lets assume that the leaderboard has 10 Squads max (Currently at 100 Squads)
  // Meaning that 10*4 = 40 members (or 39+4=43 at max)
  // We limit the leaderboard by each person not by an entire squad
  // If a member in the squad already having a place in the leaderboard (Higher rank)
  // Lets count the squad member as 3 and make his name in greyscale (Means he already holding a place on top)
  // (i.e. if already the leaderboard has 26, the new number will be 26+3=29, remove the count of the player who already had a name on the leaderboard)
  // If  a member in the squad already having a place in the leaderboard (Lesser rank)
  // Make the same, count the squad member as 3 and make his name greyscale in the lesser rank.
  // If the board holds 39 members so far and a duo comes to the last place, then the leaderboard only holds 41 member max
  // If the board holds 39 members so far and a squad (4 members) seeks the last place, then the leaderboard only holds 43 member max
  // The idea here is we only add Duos, Trios, Squads only if the leaderboard is < 40 (i.e. 39) and the max leaderboard go is 43.
  // By doing this way we can eliminate the leaderboard filled with same names in most of squad.

  // dataTemplate = {"squadId": 1231231, "Rank No": 1, "Slayer Name" : "Test", "isAlreadyPresent" : false, "Time": 1.00}

  let maxBoard = 10;

  const setMaxBoard = function (count) {
    maxBoard = count;
    console.log(maxBoard);
  };

  const [tableData, setTableData] = useState([]);

  const getNonDuplicateData = function (leaderboardData) {
    let count = 0;
    for (let i of leaderboardData) {
      if (i.isAlreadyPresent === false) {
        count += 1;
      }
    }
    return count;
  };

  const getRank = function (time) {
    const leaderboard = tableData;
    let rankNsquad = [-1, 0];
    for (let i of leaderboard) {
      if (time < i["Time"]) {
        rankNsquad = [i["Rank No"], i["squadId"]];
        break;
      }
    }
    if (rankNsquad[0] === -1) {
      if (leaderboard.length === 0) {
        return [1, 0];
      } if (getNonDuplicateData(leaderboard) < maxBoard) {
        let i = leaderboard[leaderboard.length - 1];
        return [i["Rank No"], 0];
      }
    } else {
      return rankNsquad;
    }
  };

  const genData = function (data) {
    const squadData = [];
    const rankNsquad = getRank(data.Time);
    const rankNo = rankNsquad[0];
    if (rankNo === -1) {
      return false;
    }
    const nextRankSquadId = rankNsquad[1];
    const squadId = Math.random();
    const time = data.Time;
    for (var i of data.Slayers) {
      if (i == undefined || i.trim().length == 0) {
        continue;
      }
      let data_template = {
        squadId: 1231231,
        "Rank No": 1,
        "Slayer Name": "Test",
        isAlreadyPresent: false,
        Time: 1.0,
      };
      data_template["squadId"] = squadId;
      data_template["Rank No"] = 1;
      data_template["Slayer Name"] = i;
      data_template["isAlreadyPresent"] = isNameAlreadyPresent(i, time);
      data_template["Time"] = time;
      squadData.push(data_template);
    }
    return [nextRankSquadId, squadData];
  };

  const placeData = function (squadId, data) {
    const localTableData = [...tableData];
    if (squadId === 0) {
      const beforeData = localTableData.splice(0);
      let prevRank = 0;
      if (beforeData.length > 0) {
        prevRank = beforeData[beforeData.length - 1]["Rank No"];
      }
      for (let k of data) {
        k["Rank No"] = prevRank + 1;
      }
      return beforeData.concat(data);
    }
    for (let i = 0; i < localTableData.length; i += 1) {
      const curData = localTableData[i];
      if (curData.squadId === squadId) {
        const beforeData = localTableData.splice(0, i);
        let prevRank = 0;
        if (beforeData.length > 0) {
          prevRank = beforeData[beforeData.length - 1]["Rank No"];
        }
        for (let k of data) {
          k["Rank No"] = prevRank + 1;
        }
        const afterData = localTableData;
        for (let j of afterData) {
          j["Rank No"] = j["Rank No"] + 1;
        }
        const concatData = beforeData.concat(data).concat(afterData);
        return concatData;
      }
    }
  };

  const removeSquadFrom = function (data, from) {
    while (data.length > from) {
      data.pop();
    }
    return data;
  };

  const removeExcessInLeaderBoard = function (leaderboardData) {
    let prevSquadId = null;
    for (let i = maxBoard; i < getNonDuplicateData(leaderboardData); i += 1) {
      if (prevSquadId === null) {
        prevSquadId = leaderboardData[i].squadId;
      }
      if (prevSquadId !== leaderboardData[i].squadId) {
        const finalData = removeSquadFrom(leaderboardData, i);
        return finalData;
      }
    }
    return leaderboardData;
  }

  const setFinalData = function (data) {
    setTableData(data);
  };

  const updateData = function (data) {
    console.log(data);
    const dataGen = genData(data);
    if (dataGen === false) {
      return;
    }
    const nextRankSquadId = dataGen[0];
    const squadData = dataGen[1];
    const leaderBoardData = placeData(nextRankSquadId, squadData);
    const finalData = removeExcessInLeaderBoard(leaderBoardData);
    setFinalData(finalData);
    console.log(tableData);
  };

  const isNameAlreadyPresent = function (slayerName, time) {
    const copiedTableData = [...tableData];
    for (let i of copiedTableData) {
      if (i["Slayer Name"] == slayerName) {
        if (time < i["Time"]) {
          i["isAlreadyPresent"] = true;
          setTableData(copiedTableData);
          return false;
        } else {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className={style.container}>
      <Leaderboard tableData={tableData} />
      <DataGeneration setMaxBoard={setMaxBoard} updateFunction={updateData} />
    </div>
  );
};

export default Landing;
