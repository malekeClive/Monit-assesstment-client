import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_TRANSFER } from "../query/Queries";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import Field from "../components/Field";
import Back from "../components/Back";

export default function CreateTransfer() {
  const navigate = useNavigate();
  const [addTransfer, { loading }] = useMutation(ADD_TRANSFER, {
    refetchQueries: ["GetTransfers"],
    onCompleted: (data) => {
      navigate(`/transfer/detail/${data?.addTransfer?.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { transfer_name } = data;

    addTransfer({
      variables: {
        transfer_name: transfer_name,
      },
    });
  };

  return (
    <div className="flex justify-center mx-auto max-w-screen-md mt-20">
      <div className="sm:w-[80%] md:w=[50%] lg:w-[60%]">
        <Back />
        <Card title="Create Transfer">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 flex flex-col gap-4"
          >
            <Field labelName="Transfer name">
              <div className="flex flex-col">
                <input
                  className="border outline-none p-2 text-sm"
                  {...register("transfer_name", { required: true })}
                />
                {errors.transfer_name && (
                  <span className=" text-red-500 text-xs mt-2">
                    This field is required
                  </span>
                )}
              </div>
            </Field>
            <input
              type="submit"
              className="self-end cursor-pointer mt-4 bg-primary px-5 py-1 rounded text-sm text-white"
              value={loading ? "Creating" : "Create"}
              disabled={loading}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}
