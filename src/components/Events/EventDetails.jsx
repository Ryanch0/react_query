import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {

  const { id } = useParams()

  const navigate = useNavigate()

  const {
    data: detailData,
    isPending: isQueryPending,
    isError: isQueryError,
    error: queryError
  } = useQuery({
    queryKey: ['events', { eventId: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  })

  const { date, description, image, location, time, title } = detailData || {}
  // 비동기 데이터를 받아오는 과정에서 초기에 undefined로 정의될 경우를 방지
  console.log(detailData)
  const {
    mutate,
    isError: isMutationError,
    isPending: isMutationPending,
    error: mutationError
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',

      })
      navigate('/events')
    }
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure to delete the event?')) {
      return mutate({ id })
    }
  }



  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          {isQueryPending && <p>Fetching event title ...</p>}
          {!isQueryPending && detailData && <h1>{title}</h1>}

          {isMutationError && <ErrorBlock
            message={mutationError.info?.message || 'Failed to fetch event'}
            title='Failed to fetch event'
          />}
          {isMutationPending && <p>Submitting ...</p>}
          {!isMutationPending && (
            <nav>
              <button onClick={handleDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          )}
        </header>
        {isQueryPending && <p>Fetching event ...</p>}
        {isQueryError && <ErrorBlock
          title='Failed to fetch event'
          message={queryError.info?.message || 'Failed to fetch event'} />}
        {!isQueryPending && detailData && (
          <div id="event-details-content">
            <img src={`http://localhost:3000/${image}`} alt={image} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{date} @ {time}</time>
              </div>
              <p id="event-details-description">{description}</p>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
