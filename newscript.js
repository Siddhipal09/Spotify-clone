 console.log("hello world")
 let currentsong = new Audio();
 const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
 async function getSongs()
 {
    let a = await fetch("http://127.0.0.1:5500/songs/")
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
                songs.push(element.href.split("/songs/")[1])
            }
        
     }
     return songs

 }
 const playmusic =(track)=>{
    currentsong.src = "/songs/"+ track
    // let audio = new Audio("/songs/"+track)
     currentsong.play()
     play.src = "pause.svg"
     document.querySelector(".songinfo").innerHTML = track
     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
 }
 async function main() {
    
    //get all the songs from the playlist
    let songs = await getSongs();
    console.log(songs);
    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    

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
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
        
    })
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
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}: ${formatTime(currentsong.duration)}`
    })
 }

main();