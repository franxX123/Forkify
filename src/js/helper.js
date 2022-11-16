import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    if (!response.ok) {
      throw new Error('Problem getting the recipe.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const setJSON = async function (url, newData) {
  try {
    const fetchRecipe = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });

    const response = await Promise.race([
      fetchRecipe,
      timeout(TIMEOUT_SECONDS),
    ]);

    if (!response.ok) {
      throw new Error('Problem getting the recipe.');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
