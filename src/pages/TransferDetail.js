import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import {
  DELETE_RECIPIENT_IN_TRANSFER,
  GET_DETAIL_TRANSFER,
  GET_PAGINATED_RECIPIENTS_IN_TRANSFER_DETAIL,
} from "../query/Queries";
import Table from "../components/Table";
import UnassignedRecipient from "../components/UnassignedRecipient";
import { formatIDR } from "../utils/currencyFormat";
import InfiniteScroll from "react-infinite-scroll-component";
import Back from "../components/Back";

export default function TransferDetail() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const {
    loading: loadingPaginated,
    data: paginatedData,
    fetchMore,
    error,
  } = useQuery(GET_PAGINATED_RECIPIENTS_IN_TRANSFER_DETAIL, {
    variables: {
      transferId: Number(id),
      page: 1,
      pageSize: 10,
      search: search,
    },
  });

  const tableData =
    paginatedData && paginatedData?.paginatedRecipientsInTransferDetail;

  const { data } = useQuery(GET_DETAIL_TRANSFER, {
    variables: {
      id: id,
    },
  });

  const [deleteRecipientInTransfer] = useMutation(
    DELETE_RECIPIENT_IN_TRANSFER,
    {
      refetchQueries: [
        "GetDetailTransfer",
        "GetPaginatedRecipientsInTransferDetail",
      ],
      onCompleted: () => {
        setSelectedRows([]);
      },
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: ({ getToggleAllRowsSelectedProps, rows }) => (
          <input
            type="checkbox"
            className="accent-primary"
            onClick={() => {
              // prevent checkbox when there is no data
              if (rows.length === 0) {
                return;
              }

              // reset array
              if (rows[0].isSelected) {
                setSelectedRows([]);
                return;
              }

              // select all
              const selectedRows = rows.map((row) => Number(row.original.id));
              setSelectedRows(selectedRows);
            }}
            {...getToggleAllRowsSelectedProps()}
          />
        ),
        accessor: "selection",
        width: "10%",
        Cell: ({ row }) => (
          <input
            className="ml-6 accent-primary"
            type="checkbox"
            onClick={() => {
              const id = Number(row.original.id);

              if (row.isSelected) {
                // If the row is already selected, unselect it
                setSelectedRows((prev) =>
                  prev.filter((selectedRow) => selectedRow !== id)
                );
              } else {
                // If the row is not selected, select it
                setSelectedRows((prev) => [...prev, id]);
              }
            }}
            {...row.getToggleRowSelectedProps()}
          />
        ),
      },
      {
        Header: () => {
          return <h3 className="text-left">Recipient name</h3>;
        },
        accessor: "name",
        width: "30%",
      },
      {
        Header: () => {
          return <h3 className="text-left">Description</h3>;
        },
        accessor: "description",
        width: "30%",
      },
      {
        Header: () => {
          return <h3 className="text-left">Discount</h3>;
        },
        accessor: "discount",
        width: "15%",
        Cell: ({ value }) => {
          return <p>{value}%</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-right mr-4">Amount</h3>;
        },
        accessor: "amount",
        width: "20%",
        Cell: ({ value }) => {
          return <p className="text-right mr-4">{formatIDR(value)}</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-right mr-4">Total</h3>;
        },
        accessor: "total",
        width: "20%",
        Cell: ({ row: { original } }) => {
          const total =
            original?.amount - (original?.discount / 100) * original?.amount;

          return <p className="text-right mr-4">{formatIDR(total)}</p>;
        },
      },
    ],
    []
  );

  const deleteRecipients = () => {
    deleteRecipientInTransfer({
      variables: {
        transferId: id,
        ids: selectedRows,
      },
    });
  };

  const loadMore = () => {
    if (!loadingPaginated && tableData?.hasMore) {
      fetchMore({
        variables: {
          page: tableData?.page + 1,
          pageSize: 10,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            setHasMore(false);
            return prev;
          }

          return {
            paginatedRecipientsInTransferDetail: {
              ...fetchMoreResult?.paginatedRecipientsInTransferDetail,
              items: [
                ...(prev?.paginatedRecipientsInTransferDetail?.items || []),
                ...(fetchMoreResult?.paginatedRecipientsInTransferDetail
                  ?.items || []),
              ],
            },
          };
        },
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  if (error) return <p className="text-center">Oops.. something's wrong</p>;

  return (
    <div className="flex flex-col mx-auto max-w-screen-md mt-20">
      <Back />
      <p className="text-xl text-primary font-bold">
        Transfer name: {data?.detailTransfer?.transfer_name}
      </p>

      <div className="flex flex-row justify-between mt-6">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="outline-none border border-primary px-2 py-1 rounded placeholder:text-primary"
          />
          {selectedRows.length !== 0 && (
            <button
              className="ml-4 bg-red-600 rounded px-2 py-1 text-white"
              onClick={() => deleteRecipients()}
            >
              Delete
            </button>
          )}
        </div>
        <button
          className="self-end bg-primary text-white rounded px-4 py-1"
          onClick={() => setIsModalOpen(true)}
        >
          Assign recipient
        </button>
      </div>

      {!loadingPaginated && (
        <InfiniteScroll
          dataLength={tableData?.items?.length}
          next={loadMore}
          hasMore={hasMore}
          scrollableTarget="table-transfer-detail"
          className="shadow-lg"
        >
          <Table
            columns={columns}
            data={tableData?.items || []}
            scrollId="table-transfer-detail"
          />
        </InfiniteScroll>
      )}

      <div className="flex flex-col self-end mt-4">
        <div className="flex flex-row justify-between gap-6 text-gray-400 text-sm">
          <p>Recipient</p>
          <p>{data?.detailTransfer?.totalRecipients} recipient(s)</p>
        </div>
        <div className="flex flex-row justify-between gap-6 text-primary text-lg">
          <p>Total transfer</p>
          <p>{formatIDR(data?.detailTransfer?.total)}</p>
        </div>
      </div>

      {isModalOpen && (
        <UnassignedRecipient
          id={id}
          open={isModalOpen}
          close={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
