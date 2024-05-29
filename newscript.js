 console.log("hello world")
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
 async function main() {
    let songs = await getSongs();
    console.log(songs);
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let songsHTML = ''; // Accumulator for song list HTML

    for (const song of songs) {
        songsHTML += `<li>${song.replaceAll("%20", " ")}</li>`;
    }

    // Set the HTML content of the <ul> element once after the loop
    songUL.innerHTML = songsHTML;
    
    if (songs.length > 0) {
        var audio = new Audio(songs[0]);
        audio.play();

        audio.addEventListener("loadeddata", () => {
            
            console.log(audio.duration, audio.currentSrc, audio.currentTime);
        });
    } else {
        console.error("No songs available.");
    }
 }

main();