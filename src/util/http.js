import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient()


export async function fetchEvents({ search, signal, max }) {
    // console.log('signal',signal)
    // console.log(queryKey)
    let url = 'http://localhost:3000/events'

    // const [_, {search}={}] = queryKey

    // if(/^[\s]*$/.test(search)){ // 정규식 입력 검색어가 공백포함 아무것도 없을때
    //   return []
    // }
    if(search && max) {
        url = `http://localhost:3000/events?search=${search}&max=${max}`
    } else if (search) {
        url = `http://localhost:3000/events?search=${search}`
    } else if (max) {
        url = `http://localhost:3000/events?max=${max}`
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { events } = await response.json();

    return events;
}

export async function createNewEvent(eventData) {
    const response = await fetch(`http://localhost:3000/events`, {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = new Error('An error occurred while creating the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { event } = await response.json();

    return event;
}

export async function fetchSelectableImages({ signal }) {
    const response = await fetch(`http://localhost:3000/events/images`, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the images');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { images } = await response.json();

    return images;
}

// 추가
export async function fetchEvent({ id, signal }) {
    const response = await fetch(`http://localhost:3000/events/${id}`, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { event } = await response.json();

    return event;
}


export async function deleteEvent({id}) {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = new Error('An error occurred while deleting the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json();
}

export async function updateEvent(eventData) {
    const {id} = eventData
    const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
        
    })

    if(!response.ok){
        const error = new Error('An error occured while editing the event')
        error.code = response.status
        error.info = await response.json()
        throw error
    }
    return response.json()
}