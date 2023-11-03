import { gql } from "@apollo/client";

export const GET_PAGINATED_RECIPIENTS = gql`
  query GetPaginatedRecipient($page: Int!, $pageSize: Int!, $search: String) {
    paginatedRecipient(page: $page, pageSize: $pageSize, search: $search) {
      page
      pageSize
      items {
        id
        name
        description
        discount
        amount
        total
      }
      hasMore
    }
  }
`;

export const GET_PAGINATED_TRANSFERS = gql`
  query GetPaginatedTransfer($page: Int!, $pageSize: Int!, $search: String) {
    paginatedTransfer(page: $page, pageSize: $pageSize, search: $search) {
      page
      pageSize
      items {
        id
        transfer_name
        recipients {
          id
          name
          description
          discount
          amount
        }
        total
      }
      hasMore
    }
  }
`;

export const GET_PAGINATED_RECIPIENTS_IN_TRANSFER_DETAIL = gql`
  query GetPaginatedRecipientsInTransferDetail(
    $transferId: Int!
    $page: Int!
    $pageSize: Int!
    $search: String
  ) {
    paginatedRecipientsInTransferDetail(
      transferId: $transferId
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      page
      pageSize
      items {
        id
        name
        description
        discount
        amount
      }
      hasMore
    }
  }
`;

export const GET_TRANSFERS = gql`
  query GetTransfers {
    transfers {
      id
      transfer_name
      recipients {
        id
        name
        description
      }
      total
    }
  }
`;

export const GET_DETAIL_TRANSFER = gql`
  query GetDetailTransfer($id: ID!) {
    detailTransfer(id: $id) {
      id
      transfer_name
      totalRecipients
      total
    }
  }
`;

export const GET_RECIPIENTS = gql`
  query GetRecipients {
    recipients {
      id
      name
      description
      discount
      amount
      total
    }
  }
`;

export const GET_UNASSIGNED_RECIPIENTS = gql`
  query GetUnassignedRecipients($transferId: ID!) {
    unassignedRecipients(transferId: $transferId) {
      id
      name
      description
      discount
      amount
    }
  }
`;

export const ADD_RECIPIENT = gql`
  mutation AddRecipient(
    $name: String!
    $description: String!
    $discount: Int!
    $amount: Int!
  ) {
    addRecipient(
      recipient: {
        name: $name
        description: $description
        discount: $discount
        amount: $amount
      }
    ) {
      name
      description
    }
  }
`;

export const ADD_TRANSFER = gql`
  mutation AddTransfer($transfer_name: String!) {
    addTransfer(transfer: { transfer_name: $transfer_name }) {
      id
      transfer_name
      total
    }
  }
`;

export const DELETE_TRANSFER = gql`
  mutation DeleteTransfer($id: ID!) {
    deleteTransfer(id: $id) {
      transfer_name
    }
  }
`;

export const DELETE_RECIPIENT_IN_TRANSFER = gql`
  mutation DeleteRecipientInTransfer($transferId: ID!, $ids: [ID!]) {
    deleteRecipientInTransfer(transferId: $transferId, ids: $ids) {
      transfer_name
      recipients {
        name
      }
    }
  }
`;

export const ASSIGN_RECIPIENT = gql`
  mutation AssignRecipient($transferId: Int!, $recipientId: Int!) {
    assignRecipient(
      ids: { transferId: $transferId, recipientId: $recipientId }
    ) {
      transfer_name
      recipients {
        name
        description
      }
      total
    }
  }
`;
