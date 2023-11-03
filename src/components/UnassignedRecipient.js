import React from "react";
import Modal from "./Modal";
import { ASSIGN_RECIPIENT, GET_UNASSIGNED_RECIPIENTS } from "../query/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

export default function UnassignedRecipient({ id, open, close }) {
  const { data } = useQuery(GET_UNASSIGNED_RECIPIENTS, {
    variables: {
      transferId: id,
    },
  });
  const [assignRecipient, { loading: loadingAssign }] = useMutation(
    ASSIGN_RECIPIENT,
    {
      refetchQueries: [
        "GetDetailTransfer",
        "GetPaginatedTransfer",
        "GetPaginatedRecipientsInTransferDetail",
        "GetUnassignedRecipients",
      ],
      onCompleted: () => {
        close();
      },
    }
  );

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    assignRecipient({
      variables: {
        transferId: Number(id),
        recipientId: Number(data.unassignUserId),
      },
    });
  };

  return (
    <div>
      <Modal title="Assign recipient" open={open} close={close}>
        <div className="flex flex-col items-center">
          {data?.unassignedRecipients?.length > 0 ? (
            <div className="w-full border border-primary rounded pr-4 pl-2 py-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <select
                  {...register("unassignUserId")}
                  className="w-full outline-none cursor-pointer"
                >
                  {data?.unassignedRecipients?.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="absolute bottom-6 right-10 bg-primary text-white px-4 py-1 rounded"
                  disabled={loadingAssign}
                >
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <p className="mt-6">All recipients have been assigned</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
