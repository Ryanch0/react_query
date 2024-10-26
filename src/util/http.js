export async function fetchEvents({queryKey}) {
    console.log(queryKey)
    
    let url = 'http://localhost:3000/events'
    
    const [_, {search}={}] = queryKey

    if(/^[\s]*$/.test(search)){
      return []
    }

    if(search){
        url = `http://localhost:3000/events?search=${search}`
    }
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
  }