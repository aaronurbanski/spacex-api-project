const baseURL = "https://api.spacexdata.com/v3/launches/past";
const startOverBtn = document.getElementById("startOver");
const getLaunches = document.getElementById("getLaunches");
const launchesDiv = document.querySelector(".launches");

startOverBtn.addEventListener("click", startOver);
getLaunches.addEventListener("click", fetchLaunches);
document.getElementById("numOfLaunches").addEventListener("click", updateText);
document.getElementById("numOfLaunches").addEventListener("keyup", updateText);

let count = 0;

function updateText() {
  getLaunches.innerText =
    count == 0
      ? "Get " + document.getElementById("numOfLaunches").value + " Launches"
      : "Next " + document.getElementById("numOfLaunches").value + " Launches";
}

async function fetchLaunches() {
  let url = baseURL;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;
  let numOfLaunches = parseInt(document.getElementById("numOfLaunches").value);
  let launchSuccess = document.getElementById("launchSuccess").checked;
  let landSuccess = document.getElementById("landSuccess").checked;
  url = baseURL + "?offset=" + count + "&limit=" + numOfLaunches;
  url = startDate ? url + "&start=" + startDate : url;
  url = endDate ? url + "&end=" + endDate : url;
  url = launchSuccess ? url + "&launch_success=true" : url;
  url = landSuccess ? url + "&land_success=true" : url;
  //console.log(url);
  let launches = await fetch(url);
  let jsonLaunches = await launches.json();
  if (jsonLaunches.length > 0) {
    displayLaunches(jsonLaunches);
    startOverBtn.style.display = "inline-block";
  } else {
    startOver();
    alert("No further results");
  }
  count += numOfLaunches;
  updateText();
}

function displayLaunches(launches) {
//  console.log(launches);
  for (let launch of launches) {
 //   console.log(launch);
    let launchName = launch.mission_name;
    let launchDate = new Date(launch.launch_date_utc);
    let launchDesc = launch.details;
    let launchImg = launch.links.flickr_images[0];
    let launchYoutube = launch.links.video_link;
    let name = document.createElement("span");
    let date = document.createElement("p")
    let desc = document.createElement("p");
    let youtube = document.createElement("a");
    let launchDiv = document.createElement("div");
    launchDiv.className = "launch";
    name.style.color = "white";
    name.style.fontWeight = "bold";
    name.innerText = launchName;
    date.style.color = "white";
    date.style.fontWeight = "bold";
    date.innerText = launchDate.toDateString(); 
    desc.innerText = launchDesc;
    launchDiv.style.backgroundImage = `url('${launchImg}')`;
    youtube.href = launchYoutube;
    youtube.target = "_blank";
    youtube.innerText = "Watch on YouTube";
    launchDiv.appendChild(name);
    launchDiv.appendChild(date);
    launchDiv.appendChild(desc);
    launchDiv.appendChild(youtube);
    launchesDiv.appendChild(launchDiv);
  }
}

function startOver() {
  startOverBtn.style.display = "none";
  while (launchesDiv.firstChild) {
    launchesDiv.removeChild(launchesDiv.lastChild);
  }
  count = 0;
  updateText();
}
