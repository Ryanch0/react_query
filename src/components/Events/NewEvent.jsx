import { Link, useNavigate } from 'react-router-dom';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => { // mutataionFn이 성공할 경우에만 실행
      queryClient.invalidateQueries({queryKey: ['events']}) // 이 키가 '포함된' 모든 쿼리키를 무효화시킴.
      //  mutate할때 매우 매우 중요한 개념. 모든 쿼리가 최신 데이터를 사용하도록 보장
      navigate('/events') // 여기까진 좋지만 성공해도 새로고침해야 data를 다시 불러옴
    }
  })

  function handleSubmit(formData) {
    mutate({
      event: formData
    })
    // navigate('/events') // 이것도 가능, 하지만 mutate가 실패해도 실행됨
    // redirect('/events') // 이거는 리액트 라우터의 loader or action에서만 사용

  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && <p>Submitting...</p>}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && <ErrorBlock title='Failed to create event' message={error.info?.message || 'Failed to create event'} />}
    </Modal>
  );
}
