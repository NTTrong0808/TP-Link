'use client'
import InfinityScroll from '@/components/ui/infinite-scroller'
import { useInfiniteTicketHistories } from '@/lib/api/queries/ticket/get-ticket-histories'
import { cn } from '@/lib/tw'
import HistoryTicketItem from '../components/history-ticket-item'

const HistoryTicket = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteTicketHistories({
    select: (data) => {
      return data?.pages?.flatMap((page) => page?.data) || []
    },
  })

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div>
        <h2 className="text-lg font-semibold">Lịch sử</h2>
      </div>

      {data && data?.length > 0 ? (
        <InfinityScroll
          className="flex flex-col gap-1"
          loading={isFetchingNextPage}
          hasMore={hasNextPage ?? false}
          onScrollEnd={() => {
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage()
            }
          }}
        >
          {data?.map((item, index) => (
            <HistoryTicketItem
              key={item._id}
              createdAt={item?.createdAt}
              issuedCode={item?.issuedCode}
              status={item?.status}
              reason={item?.reason}
            />
          ))}
        </InfinityScroll>
      ) : (
        <div className={cn('text-sm font-normal text-[#606060] flex flex-col justify-center items-center flex-1')}>
          <div>{'Ở đây hơi trống...'}</div>
        </div>
      )}
    </div>
  )
}

export default HistoryTicket
