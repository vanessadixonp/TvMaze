async function searchShows(query) {
  try {
    const res = await axios.get(`http://api.tvmaze.com/search/shows?`,{params:{q: query}});
  
    let shows = res.data.map(movie => {
      console.log(movie.show.image)
      let movieShow = movie.show;
      return {
        id: movieShow.id,
        name: movieShow.name,
        summary: movieShow.summary,
        image: movieShow.image ? movieShow.image.original : NO_PICTURE,
      }

    })
    return shows;
  }catch(e) {
    alert("NO ITEMS!")
  }
  
}


function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="card-btn">Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

function populateEpisode(id) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for(let ids of id) {
    let $epos =$(
      `<li>
         ${ids.name}
         (season ${ids.season}, episode ${ids.number})
       </li>
      `);

    $episodesList.append($epos)
  }
  $("#episodes-area").show()
 
}

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();
  
  let shows =  await searchShows(query);


  searchShows(query);
 

  populateShows(shows);
  
});


async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)

  const esp = res.data.map(episodes => ({
      id: episodes.id,
      name: episodes.name,
      season: episodes.season,
      number:episodes.number
   
  }))
  return esp;

}

$("#shows-list").on('click', ".card-btn", async function(evt){
    let shows = $(evt.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(shows)
    populateEpisode(episodes);
})