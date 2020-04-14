import React, { useState } from "react";
import Leaderboard from "../components/leaderboard_table/index.jsx";
import DataGeneration from "../components/data_gen/index.jsx";
import style from "./landing.css";

const Landing = function () {
  // This only applies for Squad leaderboard only
  // Lets assume that the leaderboard holds 10 Squads max (Currently at 100 Squads)
  // We limit the leaderboard by each person not by an entire squad
  // Meaning that 10*4 = 40 members (or 39+4=43 at max)
  // If a member in the squad already having a place in the leaderboard (Higher rank)
  // Lets count the squad member as 3 and make his name in lighter color / strikeout (Means he already holding a place on top)
  // (i.e. if already the leaderboard has 26, the new number will be 26+3=29, remove the count of the player who already had a name on the leaderboard)
  // If  a member in the squad already having a place in the leaderboard (Lesser rank)
  // Make the same, count the squad member as 3 and make his name greyscale in the lesser rank.
  // If the board holds 39 members so far and a duo comes to the last place, then the leaderboard only holds 41 member max
  // If the board holds 39 members so far and a squad (4 members) seeks the last place, then the leaderboard only holds 43 member max
  // The idea here is we only add Duos, Trios, Squads only if the leaderboard is < 40 (i.e. 39) and the max leaderboard go is 43.
  // By doing this way we can eliminate the leaderboard filled with same names in most of squad.

  // dataTemplate = {"squadId": 1231231, "Rank No": 1, "Slayer Name" : "Test", "isAlreadyPresent" : false, "Time": 1.00}

  // The number of member that the board holds (maxboard + 3)
  let maxBoard = 10;

  // Template for leaderboard rows.
  // squadId => A unique id to identify the squad, each member in the squad is assigned the same id
  // rankNo => Rank number,
  // slayerName => Name of the slayer,
  // isAlreadyPresent => Is the slayer already holds row in the upper ranks,
  // Time => time taken to complete the trials (Sorting key)
  const dataTemplate = {
    squadId: 1231231,
    rankNo: 1,
    slayerName: "Test",
    isAlreadyPresent: false,
    Time: 1.0,
  };

  // Used to change maxBoard value to test the functionality
  const setMaxBoard = function (count) {
    maxBoard = count;
  };

  // The leaderboard table getter and setter
  const [tableData, setTableData] = useState([]);

  // Will return non-duplicate slayers count. (No. of slayer with isAlreadyPresent = false)
  const getNonDuplicateData = function (leaderboardData) {
    let count = 0;
    leaderboardData.forEach(function (data) {
      if (data.isAlreadyPresent === false) {
        count += 1;
      }
    });
    return count;
  };

  // Return an array [rankNo, squadId]
  // rankNo => Rank of the squad by comparing the time
  // squadId=> The id of the squad which is next to the current squad. (rankNo+1.squadId)
  const getrankNsquad = function (time) {
    const leaderboard = tableData;
    // -1 => Current squad does not hold any rank in the leaderboard
    // 0 => There is no squad behind / next to the current squad. (May be the current squad is last squad or the leaderboard is empty)
    let rankNsquad = [-1, 0];
    for (let i = 0; i < leaderboard.length; i += 1) {
      const leaderBoardData = leaderboard[i];
      if (time < leaderBoardData.Time) {
        rankNsquad = [leaderBoardData.rankNo, leaderBoardData.squadId];
        break;
      }
    }
    if (rankNsquad[0] === -1) {
      if (leaderboard.length === 0) {
        return [1, 0];
      }
      if (getNonDuplicateData(leaderboard) < maxBoard) {
        const lastData = leaderboard[leaderboard.length - 1];
        return [lastData.rankNo, 0];
      }
      return rankNsquad;
    }
    return rankNsquad;
  };

  // This will return whether the slayer name is already present in the leaderboard or not.
  // And also sets isAlreadyPresent = true, if the slayer already present in the leaderboard
  const isNameAlreadyPresent = function (slayerName, time) {
    const copiedTableData = [...tableData];
    for (let i = 0; i < copiedTableData.length; i += 1) {
      const tableDatum = copiedTableData[i];
      if (tableDatum.slayerName === slayerName) {
        if (time < tableDatum.Time) {
          tableDatum.isAlreadyPresent = true;
          setTableData(copiedTableData);
          return false;
        }
        return true;
      }
    }
    return false;
  };

  // Construction of the leaderboard table row datas (array of json).
  const genData = function (data) {
    const squadData = [];
    const rankNsquad = getrankNsquad(data.Time);
    const rankNo = rankNsquad[0];
    if (rankNo === -1) {
      return false;
    }
    const nextRankSquadId = rankNsquad[1];
    const squadId = Math.random();
    const time = data.Time;
    for (let i = 0; i < data.Slayers.length; i += 1) {
      const slayer = data.Slayers[i];
      // Removing the slayer for possibility of Duos / Trios
      // Solos can also be placed (Its understandable that solo hunt doesn't come to squad leaderboard)
      if (slayer === undefined || slayer.trim().length === 0) {
        continue;
      }
      dataTemplate.squadId = squadId;
      dataTemplate.rankNo = rankNo;
      dataTemplate.slayerName = slayer;
      dataTemplate.isAlreadyPresent = isNameAlreadyPresent(slayer, time);
      dataTemplate.Time = time;
      squadData.push({ ...dataTemplate });
    }
    return [nextRankSquadId, squadData];
  };

  // The current squad data is placed by splicing the current leaderboard in to two (before, after)
  const placeData = function (squadId, data) {
    const localTableData = [...tableData];
    // please read getrankNsquad methods
    if (squadId === 0) {
      const beforeData = localTableData.splice(0);
      let prevRank = 0;
      if (beforeData.length > 0) {
        prevRank = beforeData[beforeData.length - 1].rankNo;
      }
      for (let i = 0; i < data.length; i += 1) {
        const prevData = data[i];
        prevData.rankNo = prevRank + 1;
      }
      return beforeData.concat(data);
    }
    for (let i = 0; i < localTableData.length; i += 1) {
      const curData = localTableData[i];
      if (curData.squadId === squadId) {
        const beforeData = localTableData.splice(0, i);
        const afterData = localTableData;
        // Updating the ranks of the squad behind current squad
        for (let j = 0; j < afterData.length; j += 1) {
          const curAfterData = afterData[j];
          curAfterData.rankNo += 1;
        }
        // Merging the before, current, after datas
        const concatData = beforeData.concat(data).concat(afterData);
        return concatData;
      }
    }
    return localTableData;
  };

  // Will remove the squad (last n numbers) from the leaderboard.
  const removeSquadFrom = function (data, from) {
    while (data.length > from) {
      data.pop();
    }
    return data;
  };

  // Calulation on how many slayers to be removed (from).
  // Gets the squadId of last slayer (maxBoard)
  // Removes the slayers after last slayer (maxBoard) who doesn't hold the same id as last slayer
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
  };

  // One way method to set data
  const setFinalData = function (data) {
    setTableData(data);
  };

  // The main method for updating the data from the data_gen component.
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

  return (
    <div className={style.container}>
      <Leaderboard tableData={tableData} />
      <DataGeneration setMaxBoard={setMaxBoard} updateFunction={updateData} />
    </div>
  );
};

export default Landing;
