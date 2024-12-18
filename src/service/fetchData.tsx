// This is the function to fetch the data from the api call

// Define the structure of the Artwork object
interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

export async function fetchData(
  page: number = 1,
  rlimit: number = 12
): Promise<Artwork[] | null> {
  // Establishing the API Url specifing the page number and the limit
  const url = `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rlimit}`;

  try {
    // Make an HTTP GET request to fetch data
    const res = await fetch(url);

    // Error check
    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

    // making the artworks array which contains the fields of interest of an artwork ,
    // and discard rest of the fetched data

    const artworks: Artwork[] = data.data.map((item: any) => ({
      id: item.id,
      title: item.title, // Artwork title
      place_of_origin: item.place_of_origin || "Unknown",
      artist_display: item.artist_display || "Unknown",
      inscriptions: item.inscriptions || "Unknown",
      date_start: item.date_start || "Unknown",
      date_end: item.date_end || "Unknown",
    }));

    return artworks;
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error("Failed to fetch artworks:", error);
    return null;
  }
}
