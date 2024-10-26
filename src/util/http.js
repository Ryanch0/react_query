export async function fetchEvents({searchTerm, signal}) {
    // console.log('signal',signal)
    // console.log(queryKey)
    
    let url = 'http://localhost:3000/events'
    
    // const [_, {search}={}] = queryKey

    // if(/^[\s]*$/.test(searchTerm)){ // 정규식 입력 검색어가 공백포함 아무것도 없을때
    //   return []
    // }

    if(searchTerm){
        url = `http://localhost:3000/events?search=${searchTerm}`
    }
    const response = await fetch(url,{signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
  }