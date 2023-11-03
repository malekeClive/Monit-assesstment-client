import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSFER, GET_PAGINATED_TRANSFERS } from "../query/Queries.js";
import Table from "../components/Table.js";
import { useNavigate } from "react-router-dom";
import { formatIDR } from "../utils/currencyFormat.js";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const navigate = useNavigate();
  const [hasMore, setHasMore] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const {
    loading: loadingPaginated,
    data: paginatedData,
    fetchMore,
    error,
  } = useQuery(GET_PAGINATED_TRANSFERS, {
    variables: {
      page: 1,
      pageSize: 10,
      search: search,
    },
  });

  const [deleteTransfer] = useMutation(DELETE_TRANSFER, {
    refetchQueries: ["GetPaginatedTransfer"],
  });

  const tableData = paginatedData && paginatedData?.paginatedTransfer;

  const columns = React.useMemo(
    () => [
      {
        Header: () => {
          return <h3 className="text-left ml-4">ID</h3>;
        },
        accessor: "id",
        width: "10%",
        Cell: ({ value }) => {
          return <p className="ml-4">{value}</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-left">Transfer name</h3>;
        },
        accessor: "transfer_name",
        width: "30%",
      },
      {
        Header: () => {
          return <h3 className="text-left">Recipients</h3>;
        },
        accessor: "recipients",
        width: "20%",
        Cell: ({ value }) => {
          return <p>{value?.length} recipient(s)</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-left">Total</h3>;
        },
        accessor: "total",
        width: "20%",
        Cell: ({ value }) => {
          return <p>{formatIDR(value)}</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-right mr-4">Action</h3>;
        },
        accessor: "action",
        width: "20%",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex justify-end gap-2 mr-4">
              <button
                className="bg-red-600 rounded px-2 py-1 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTransfer({
                    variables: {
                      id: Number(original.id),
                    },
                  });
                }}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [deleteTransfer]
  );

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
            paginatedTransfer: {
              ...fetchMoreResult?.paginatedTransfer,
              items: [
                ...prev?.paginatedTransfer?.items,
                ...fetchMoreResult?.paginatedTransfer?.items,
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

  if (error) return <p>Oops.. something's wrong</p>;

  return (
    <div className="flex flex-col mx-auto max-w-screen-md">
      <div className="flex flex-row justify-between">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="outline-none border border-primary px-2 py-1 rounded placeholder:text-primary"
        />
        <button
          className="self-end bg-primary text-white rounded px-4 py-1"
          onClick={() => {
            navigate("/transfer/create");
          }}
        >
          Create transfer
        </button>
      </div>
      {!loadingPaginated && (
        <InfiniteScroll
          dataLength={tableData?.items?.length}
          next={loadMore}
          hasMore={hasMore}
          scrollableTarget="table-recipients"
          className="shadow-lg"
        >
          <Table
            columns={columns}
            data={tableData?.items || []}
            scrollId="table-recipients"
            onRowClick={(id) => {
              navigate(`/transfer/detail/${id}`);
            }}
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
