const fs = require('fs');

const data = fs.readFileSync("./problem1.json", "utf8");


const obj = JSON.parse(data);
console.log("Old name:" + obj.name);


obj.name = 'Fluffyy';
obj.height = "20cm";
obj.weight = "10kg";

console.log("updated name: " + obj.name);
console.log("Height: " + obj.height);
console.log("Weight: " + obj.weight);




obj.catFriends.forEach(cat => {
    console.log(cat.name + "'s activities: " + cat.activities);
});



obj.catFriends.forEach(cat => {
    console.log(cat.name);
});



let totalWeight = 0;
obj.catFriends.forEach(cat => {
    totalWeight += cat.weight;
});


console.log("Total weight of catFriends: " + totalWeight);


const activities = () =>{
    let totalActivities = obj.activities.length;
obj.catFriends.forEach(cat => {
    totalActivities += cat.activities.length;
});
return totalActivities
} 


console.log("Total activities of all cats: " + activities());

obj.catFriends[0].activities.push("incessant meowing");
obj.catFriends[0].activities.push("Scratching furniture");
obj.catFriends[1].activities.push("zooming around the house");
obj.catFriends[1].activities.push("sinisterly staring at humans");

console.log("New total activities of all cats: " + activities());


obj.catFriends.forEach(cat => {
    console.log(cat.name + "'s updated activities: " + cat.activities);
});


obj.catFriends[0].furcolor = "green!";

console.log("Bar's fur color: " + obj.catFriends[0].furcolor);