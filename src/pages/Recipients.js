import React from "react";
import { useQuery } from "@apollo/client";
import Table from "../components/Table";
import { GET_PAGINATED_RECIPIENTS } from "../query/Queries";
import { useNavigate } from "react-router-dom";
import { formatIDR } from "../utils/currencyFormat";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Recipients() {
  const navigate = useNavigate();
  const [hasMore, setHasMore] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const {
    loading: loadingPaginated,
    data: paginatedData,
    fetchMore,
    error,
  } = useQuery(GET_PAGINATED_RECIPIENTS, {
    variables: {
      page: 1,
      pageSize: 10,
      search: search,
    },
  });

  const tableData = paginatedData && paginatedData?.paginatedRecipient;

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
          return <h3 className="text-left">Recipient name</h3>;
        },
        accessor: "name",
        width: "20%",
      },
      {
        Header: () => {
          return <h3 className="text-left">Description</h3>;
        },
        accessor: "description",
        width: "20%",
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
          return <h3 className="text-left">Amount</h3>;
        },
        accessor: "amount",
        width: "15%",
        Cell: ({ value }) => {
          return <p className="text-left">{formatIDR(value)}</p>;
        },
      },
      {
        Header: () => {
          return <h3 className="text-right mr-4">Total</h3>;
        },
        accessor: "total",
        width: "20%",
        Cell: ({ value }) => {
          return <p className="text-right mr-4">{formatIDR(value)}</p>;
        },
      },
    ],
    []
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
            paginatedRecipient: {
              ...fetchMoreResult?.paginatedRecipient,
              items: [
                ...prev?.paginatedRecipient?.items,
                ...fetchMoreResult?.paginatedRecipient?.items,
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
            navigate("/recipient/create");
          }}
        >
          Create recipient
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
          />
        </InfiniteScroll>
      )}
    </div>
  );
}
