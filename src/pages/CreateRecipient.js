import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_RECIPIENT } from "../query/Queries";
import Card from "../components/Card";
import Field from "../components/Field";
import { useNavigate } from "react-router-dom";
import Back from "../components/Back";

export default function CreateRecipient() {
  const navigate = useNavigate();

  const [addRecipient, { loading }] = useMutation(ADD_RECIPIENT, {
    refetchQueries: ["GetPaginatedRecipient"],
    onCompleted: (_) => {
      navigate("/recipients");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { name, amount, description, discount } = data;

    addRecipient({
      variables: {
        name: name,
        amount: Number(amount),
        description: description,
        discount: Number(discount),
      },
    });
  };

  return (
    <div className="flex justify-center mx-auto max-w-screen-md mt-20">
      <div className="sm:w-[80%] md:w=[50%] lg:w-[60%]">
        <Back />
        <Card title="Add Recipient">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-4 flex flex-col gap-4 shadow-lg rounded"
          >
            <Field labelName="Name">
              <div className="flex flex-col">
                <input
                  className="border outline-none p-2 text-sm"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <span className=" text-red-500 text-xs mt-2">
                    This field is required
                  </span>
                )}
              </div>
            </Field>
            <Field labelName="Description">
              <div className="flex flex-col">
                <input
                  className="border outline-none p-2 text-sm"
                  {...register("description", { required: true })}
                />
                {errors.description && (
                  <span className=" text-red-500 text-xs mt-2">
                    This field is required
                  </span>
                )}
              </div>
            </Field>
            <Field labelName="Discount">
              <div className="flex flex-col">
                <input
                  type="number"
                  className="border outline-none p-2 text-sm"
                  {...register("discount", { required: true })}
                />
                {errors.discount && (
                  <span className="text-red-500 text-xs mt-2">
                    This field is required
                  </span>
                )}
              </div>
            </Field>
            <Field labelName="Amount">
              <div className="flex flex-col">
                <input
                  type="number"
                  className="border outline-none p-2 text-sm"
                  {...register("amount", { required: true })}
                />
                {errors.amount && (
                  <span className="text-red-500 text-xs mt-2">
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
