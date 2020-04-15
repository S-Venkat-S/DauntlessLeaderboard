import React, { useState } from "react";
import PropTypes from "prop-types";
import style from "./index.css";

const DataGeneration = function (props) {
  const [slayer1, setSlayer1] = useState("");
  const [slayer2, setSlayer2] = useState("");
  const [slayer3, setSlayer3] = useState("");
  const [slayer4, setSlayer4] = useState("");
  const [time, setTime] = useState(0);

  let numOfSlayer = 10;

  const nameList = [
    "Gnasher",
    "Shrike",
    "Quillshot",
    "Charrogg",
    "Embermane",
    "Hellion",
    "Torgadoro",
    "Skraev",
    "Boreus",
    "Pangar",
    "Drask",
    "Nayzaga",
    "Stormclaw",
    "Malkarion",
    "Skarn",
    "Kharabak",
    "Koshai",
    "Valomyr",
    "Rezakiri",
    "Riftstalker",
    "Shrowd",
    "Styxian",
    "Gruk Gruk",
    "Assassins Vigour",
    "Bloodless",
    "Fireproof",
    "Fortress",
    "Guardian",
    "Iceborne",
    "Insulated",
    "Nine Lives",
    "Shellshock Resist",
    "Strategist",
    "Sturdy",
    "Tough",
    "Warmth",
    "Agility",
    "Conditioning",
    "Endurance",
    "Evasion",
    "Fleet Footed",
    "Grace",
    "Nimble",
    "Sprinter",
    "Swift",
    "Aetherhunter",
    "Deconstruction",
    "Discipline",
    "Knockout King",
    "Overpower",
    "Pacifier",
    "Rage",
    "Ragehunter",
    "Sharpened",
    "Acidic",
    "Adrenaline",
    "Barbed",
    "Berserker",
    "Bladestorm",
    "Cunning",
    "Evasive Fury",
    "Merciless",
    "Molten",
    "Predator",
    "Savagery",
    "Weighted Strikes",
    "Wild Frenzy",
    "Aetherborne",
    "Aetheric Attunement",
    "Aetheric Frenzy",
    "Conduit",
    "Energized",
    "Engineer",
    "Lucent",
    "Medic",
    "Mender",
    "Stunning Vigour",
    "Vampiric",
    "Zeal",
  ];

  const getRandomName = function () {
    const randomNumber = Math.floor(Math.random() * nameList.length);
    return nameList[randomNumber];
  };

  const randomizedData = function () {
    const randomNames = [];
    while (randomNames.length < 4) {
      const randomName = getRandomName();
      if (randomNames.indexOf(randomName) === -1) {
        randomNames.push(randomName);
      }
    }
    setSlayer1(randomNames[0]);
    setSlayer2(randomNames[1]);
    setSlayer3(randomNames[2]);
    setSlayer4(randomNames[3]);
    setTime(parseFloat((Math.random() * 3).toFixed(3)));
  };

  const updateData = function () {
    const data = { Slayers: [slayer1, slayer2, slayer3, slayer4], Time: time };
    props.updateFunction(data);
  };

  return (
    <div className={style.container}>
      <div className={style.inner_container}>
        <tbody>
          <tr>
            <td>Slayer 1 :</td>
            <td>
              <input type="text" onInput = {(obj)=>{setSlayer1(obj.target.value)}} value={slayer1}/>
            </td>
            <td>
              <button onClick = {()=>{setSlayer1("")}}>X</button>
            </td>
          </tr>
          <tr>
            <td>Slayer 2 :</td>
            <td>
              <input type="text" onInput = {(obj)=>{setSlayer2(obj.target.value)}} value={slayer2}/>
            </td>
            <td>
              <button onClick = {()=>{setSlayer2("")}}>X</button>
            </td>
          </tr>
          <tr>
            <td>Slayer 3 :</td>
            <td>
              <input type="text" onInput = {(obj)=>{setSlayer3(obj.target.value)}} value={slayer3}/>
            </td>
            <td>
              <button onClick = {()=>{setSlayer3("")}}>X</button>
            </td>
          </tr>
          <tr>
            <td>Slayer 4 :</td>
            <td>
              <input type="text" onInput = {(obj)=>{setSlayer4(obj.target.value)}} value={slayer4}/>
            </td>
            <td>
              <button onClick = {()=>{setSlayer4("")}}>X</button>
            </td>
          </tr>
          <tr>
            <td>Time :</td>
            <td>
              <input type="number" onInput = {(obj)=>{setTime(obj.target.value)}} value={time} />
            </td>
          </tr>
          <tr>
            <td><button onClick = {()=>{randomizedData()}}>Randomize</button></td>
            <td><button onClick = {()=>{updateData()}}>Update</button></td>
          </tr>
        </tbody>
      </div>
      <br />
      <div className={style.maxBoard}>
        Maximum number of slayers in leaderboard :
        <input type="number" onInput = {(obj)=>{numOfSlayer = obj.target.value}} defaultValue="10" />
        <button onClick = {()=>{props.setMaxBoard(numOfSlayer)}}>Update</button>
      </div>
    </div>
  );
};

DataGeneration.propType = {
  updateFunction: PropTypes.func.isRequired,
};

export default DataGeneration;
