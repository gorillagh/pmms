import { async } from "@firebase/util";
import axios from "axios";

export const createPocket = async (authtoken, data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/pocket`, data, {
    headers: {
      authtoken,
    },
  });
};

export const getPockets = async (authtoken, data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/pockets`, {
    headers: {
      authtoken,
    },
  });
};

export const getUserPockets = async (authtoken, slug) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/user-pockets/${slug}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getUserPocket = async (authtoken, id, slug) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/get-user-pocket/${id}`,
    { slug },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const editPocket = async (authtoken, id, pocketSlug, update) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/edit-pocket/${id}/${pocketSlug}`,
    update,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const deleteUserPocket = async (authtoken, id, pocketSlug) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/delete-pocket/${id}/${pocketSlug}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getPocketActivities = async (authtoken, id, slug) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/get-user-pocket-activities/${id}`,
    { slug },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const createUserPocket = async (authtoken, id, pocket) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/user-pocket/${id}`,
    pocket,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const addMoney = async (authtoken, id, transaction) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/add-money/${id}`,
    transaction,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const cashout = async (authtoken, id, transaction) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/cashout/${id}`,
    transaction,
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const p2pTransfer = async (authtoken, id, transaction) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/p2p-transfer/${id}`,
    transaction,
    {
      headers: {
        authtoken,
      },
    }
  );
};
