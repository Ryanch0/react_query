import { Link, redirect, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams()
  console.log(id)
  // 1. id로 데이터를 먼저 가져와서 폼을 채운다
  const {
    data: detailData,
    isError: isQueryError,
    error: queryError
  } = useQuery({
    queryKey: ['events', { eventId: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  })

  // 2. update버튼을 트리거로 put요청을 보내서 내용을 수정하고 페이지 이동과 쿼리 무효화
  const {
    mutate,
    // isPending: isMutationPending,
    // isError: isMutationError,
    // error: mutationError
  } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => { // mutate를 호출하는 즉시 실행
      await queryClient.cancelQueries({ queryKey: ['events', { eventId: id }] }) // 특정 키의 모든 활성 쿼리 취소 (낙관적 업데이트의 데이터와 충돌하지 않기위해)
      const previousEvent = queryClient.getQueryData(['events', { eventId: id }]) //롤백용 이전 데이터
      queryClient.setQueryData(['events', { eventId: id }], data.event)
      // 첫번째인자 : 가져오려는 쿼리 키, 두번째 인자: 변경하려는 새 데이터
      // mutate로 전달한 데이터는 즉시 onMutate에 전달됨

      return { previousEvent } // onError에서 context에 해당함
    },
    onError: (error, data, context) => { // mutate가 실패할경우 실행되는 함수
      queryClient.setQueryData(['events', { eventId: id }], context.previousEvent) // 롤백

    },
    onSettled: () => { // mutation이 완료될때마다 호출(실패,성공 상관없이)
      queryClient.invalidateQueries(['events', { eventId: id }]) //성공하든, 실패해서 롤백되던 최신데이터를 가져옴
    }
  })


  function handleSubmit(formData) {
    mutate({
      event: formData,
      id
    })
    navigate('../')

  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      {isQueryError && <ErrorBlock
        title='Failed to fetch event'
        message={queryError.info?.message || 'Failed to fetch event'}
      />}
      {detailData && (
        <EventForm inputData={detailData || {}} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            {/* {isMutationPending ? 'Editing...' : 'Update'} */}
            Update
          </button>
        </EventForm>
      )}
      {/* {isMutationError && <ErrorBlock
        title='Failed to update event'
        message={mutationError.info?.message || 'Failed to update event'}
      />} */}
    </Modal>
  );
}

export function loader({ params }) {
  const { id } = params
  return queryClient.fetchQuery({
    queryKey: ['events', { eventId: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  })
}

export async function action({request, params}) {
  const formData = await request.formData()
  const updatedEventData = Object.fromEntries(formData)
  await updateEvent({id: params.id, event : updatedEventData})
  await queryClient.invalidateQueries(['events'])
  return redirect('../')
}