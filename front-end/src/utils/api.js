/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
//import formatReservationDate from "./format-reservation-date";
//import formatReservationTime from "./format-reservation-date";
require("dotenv").config();

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Returns day of the week in which the restaurant is closed.
 * Defined in API, to easily support defining single definition on server
 * in a future refactor if needed.
 * @returns {String containing day of the week}
 */
export function getBlackoutDay() {
  const BLACKOUT_DAY = process.env.BLACKOUT_DAY || "Tuesday";

  return BLACKOUT_DAY;
}

/**
 * Returns starting time for reservations of a given day
 *
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
export function getReservationStartTime() {
  const RESERVATION_START_HOUR = process.env.RESERVATION_START_HOUR || "10";
  const RESERVATION_START_MINUTE = process.env.RESERVATION_START_MINUTE || "30";
  return [RESERVATION_START_HOUR, RESERVATION_START_MINUTE];
}

/**
 * Returns ending time for reservations of a given day
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
export function getReservationEndTime() {
  const RESERVATION_END_HOUR = process.env.RESERVATION_END_HOUR || "21";
  const RESERVATION_END_MINUTE = process.env.RESERVATION_END_MINUTE || "30";
  return [RESERVATION_END_HOUR, RESERVATION_END_MINUTE];
}

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Saves reservation to the database.
 * @param reservation
 *  the reservation to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation, which will now have an `id` property.
 */
export async function createReservation(reservation, signal) {
  const data = reservation;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves the reservation with the specified `reservationId`
 * @param reservationId
 *  the `id` property matching the desired reservation.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<any>}
 *  a promise that resolves to the saved reservation.
 */
export async function readReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  return await fetchJson(url, { signal }, {});
}

/**
 * Updates an existing reservation
 * @param updatedReservation
 *  the reservation to save, which must have an `id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated reservation.
 */
export async function updateReservation(updatedReservation, signal) {
  const data = updatedReservation;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/reservations/${updatedReservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Deletes the reservation with the specified `reservationId`.
 * @param reservationId
 *  the id of the reservation to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function deleteReservation(reservationId, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}

/**
 * Updates an exising reservation with a reservation status (booked, seated, finished, cancelled)
 * @param reservation_id
 *  the row to update in reservations
 * @param updatedReservation
 *  the object containing reservation data to update
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated reservation.
 */
export async function updateReservationStatus(
  reservation_id,
  updatedReservation,
  signal
) {
  const data = updatedReservation;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listTables(params, signal) {

  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Retrieves the table with the specified `tableId`
 * @param tableId
 *  the `id` property matching the desired table.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<any>}
 *  a promise that resolves to the saved table.
 */
export async function readTable(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}`;
  return await fetchJson(url, { signal }, {});
}

/**
 * Saves table to the database.
 * @param table
 *  the table to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved table, which will now have an `id` property.
 */
export async function createTable(table, signal) {
  const data = table;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates an existing table
 * @param updatedTable
 *  the table to save, which must have an `id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated table.
 */
export async function updateTable(updatedTable, signal) {
  const data = updatedTable;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/tables/${updatedTable.table_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates an exising table with a reservation_id
 *  in effect, setting seat to "occupied".
 * @param table_id
 *  the row to update in tables
 * @param updatedTable
 *  the object containing table data to update
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated table.
 */
export async function updateTableSeat(table_id, updatedTable, signal) {
  const data = updatedTable;
  const dataPackage = { data };
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(dataPackage),
    signal,
  };
  return await fetchJson(url, options, {});
}

/**
 * Updates an exising table with a reservation_id
 *  in effect, setting seat to "free"
 * @param table_id
 *  the row to update in tables
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated table.
 */
export async function deleteTableSeat(
  reservation_id,
  table_id,
  status,
  signal
) {
  if (table_id === "null") {
    // delete by calling reservation table
    const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
    const data = {
      reservation_id: reservation_id,
      status: status,
      event: "clear table",
    };

    const dataPackage = { data };
    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify(dataPackage),
      signal,
    };

    return await fetchJson(url, options, {});
  } else {
    // delete by calling delete table
    const url = `${API_BASE_URL}/tables/${table_id}/seat`;
    const data = {
      reservation_id: reservation_id,
      status: status,
      event: "finish table",
    };

    const dataPackage = { data };
    const options = {
      method: "DELETE",
      headers,
      body: JSON.stringify(dataPackage),
      signal,
    };

    return await fetchJson(url, options, {});
  }
}
