 console.log("hello world")
 let currentsong = new Audio();
 let songs;
 let currFolder;
 const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
 async function getSongs(folder)
 {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    console.log(response)
    let div= document.createElement("div")
    div.innerHTML= response;
    let as = div.getElementsByTagName("a")
    let songs = []
     for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
            {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        
     }
      //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML += `<li><img src="music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Siddhi</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="play.svg" alt="">
        </div></li>`;
    }
      // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", ()=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            let track = e.querySelector(".info").firstElementChild.innerHTML.trim()
            playmusic(track)
        })
        
        
    })
     
     return songs;

 }
 const playmusic =(track, pause = false)=>{
    currentsong.src = `/${currFolder}/${track}`;
    // let audio = new Audio("/songs/"+track)
    if(!pause){
     currentsong.play()
     play.src = "pause.svg"
    }
     document.querySelector(".songinfo").innerHTML = decodeURI(track)
     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
 }
 async function displayAlbums(){
    
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response= await a.text();
    console.log(response)
    let div= document.createElement("div")
    div.innerHTML= response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 2; index < array.length; index++) {
        const e= array[index];
        console.log(e)
        
    
   // Array.from(anchors).forEach(async e=>{
      //  console.log(e.href)
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-1)[0]
            console.log(folder)
            //get the meta data
           let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
           if (!a.ok) {
            throw new Error(`Failed to fetch: ${a.status} ${a.statusText}`);
        }
           let response= await a.json();
           console.log(response)
             
           cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
           <div class="play">
               <svg width="44px" height="44px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2bd455"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(1.5600000000000005,1.5600000000000005), scale(0.87)"><rect x="0" y="0" width="24.00" height="24.00" rx="12" fill="#121212" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#3ac81e" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.528-4.882a1 1 0 0 1 1.027.05l6 4a1 1 0 0 1 0 1.664l-6 4A1 1 0 0 1 9 16V8a1 1 0 0 1 .528-.882z" clip-rule="evenodd"></path></g></svg>
           </div>
           <img src="https://i.scdn.co/image/ab67706f00000002a6a35d85da2b230f63a0005a" alt="">
           <h2>${response.title}</h2>
           <p>${response.description}</p>
       </div>`
       }
    }
        //load the playlist whenever card is clicked
      Array.from(document.getElementsByClassName("card")).forEach(e =>{
        console.log(e)
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
      })
    }
 
 async function main() {
    
    //get all the songs from the playlist
     songs = await getSongs("songs/retro");
    console.log(songs);
    playmusic(songs[0], true)

    // display all the albums on the page
   await displayAlbums()
   
   
   
    //play the first song
    //    if (songs.length > 0) {
    //      let audioSrc = `http://127.0.0.1:5500/songs/${songs[0]}`;
    //      console.log("Audio source:", audioSrc);
    //     var audio = new Audio(audioSrc);
    //    // var audio = new Audio(songs[0]);
    //    audio.play();
    //     audio.addEventListener("loadeddata", () => {
            
    //      console.log(audio.duration, audio.currentSrc, audio.currentTime);
    //  });
    // } else {
    //     console.error("No songs available.");
    // }
   
    // attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentsong.paused)
            {
                currentsong.play()
                play.src = "pause.svg"
            }
            else{
               currentsong.pause()
               play.src = "play.svg"
            }
    })
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate", ()=>{
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration)*100 + "%";
    })
    // add an event listener to seekbar
    document.querySelector(".circle").parentElement.addEventListener("click", e => {
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newTime = (offsetX / rect.width) * currentsong.duration;
        currentsong.currentTime = newTime;
    });
    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () =>{
      document.querySelector(".left").style.left = "0"
    })
     // add an event listener for close button
     document.querySelector(".close").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "-120%"
      })
      //add an event listener to previous and next
      previous.addEventListener("click", () =>{
        console.log(" Previous clicked")
        console.log(currentsong)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if((index-1) >= 0){
         playmusic(songs[index-1])
        }
      })
      next.addEventListener("click", () =>{
        console.log(" Next clicked")
         
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if((index+1) < songs.length){
         playmusic(songs[index+1])
        }
      })
      // add an event to volume 
      document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting volume to", e.target.value)
        currentsong.volume = parseInt(e.target.value)/100
      })
      // add an event listener to mute the track
      document.querySelector(".volume>img").addEventListener("click",e=>{
          console.log(e.target)
          if(e.target.src.includes("volume.svg")){
            e.target.src =  e.target.src.replace("volume.svg","mute.svg") 
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
          }
          else{
            e.target.src =  e.target.src.replace("mute.svg","volume.svg") 
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
          }
      })
     
 }

main();