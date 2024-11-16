"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Users from "../database/models/user.model";
import { addOrdertoOrderBookParams } from "@/types";
import { string } from "zod";

export const getUserByUserID = async (userID: string) => {
  try {
    await connectToDatabase();

    const user = await Users.findOne({ userID: userID });

    if (user) {
      console.log("User found");
      return JSON.parse(JSON.stringify(user));
    } else {
      console.log("User not found");
      throw new Error("User not found");
    }
  } catch (error) {
    try {
      const user = await createUser(userID);
      return user;
    } catch (error) {
      console.log("Error fetching user");
      console.error("Error fetching user:", error);
      handleError(error);
    }
  }
};

export const createUser = async (userID: string) => {
  try {
    await connectToDatabase();

    console.log("Creating circle user");
    const createdCircleUser = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/circle/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrivateAddress: userID,
          userPreference: 0.5,
        }),
      }
    );

    const data = await createdCircleUser.json();

    const user = await Users.create({
      userID: userID,
      circleWalletAddress: data.circleWalletAddress,
      entitySecret: "",
      orderBook: [],
      userPreference: 0.5,
    });

    console.log("User created");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error creating user:", error);
    handleError(error);
  }
};

export const addOrdertoOrderBook = async ({
  userID,
  newOrder,
}: addOrdertoOrderBookParams) => {
  try {
    await connectToDatabase();

    const user = await Users.findOne({ userID: userID });

    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      {
        $push: { orderBook: newOrder },
      },
      {
        new: true,
      }
    );

    if (updatedUser) {
      console.log("Order added added");
      return JSON.parse(JSON.stringify(updatedUser));
    }
  } catch (error) {
    handleError(error);
  }
};

export const reduceTransactionCount = async ({
  userID,
  orderID,
}: {
  userID: string;
  orderID: string;
}) => {
  try {
    await connectToDatabase();

    const user = await getUserByUserID(userID);

    const orderIndex = user.orderBook.findIndex(
      (order: any) => order._id === orderID
    );

    if (orderIndex === -1) {
      throw new Error("Order not found");
    }

    const updatedOrder = user.orderBook[orderIndex];
    updatedOrder.transactionCount -= 1;

    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      {
        $set: { orderBook: user.orderBook },
      },
      {
        new: true,
      }
    );

    if (updatedUser) {
      console.log("Transaction count reduced");
      return JSON.parse(JSON.stringify(updatedUser));
    }
  } catch (error) {
    handleError(error);
  }
};
