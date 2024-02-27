import axios from 'axios';
import {API_URL} from "./config";
import dayjs from "dayjs";

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api/`,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true,
    withXSRFToken: true,
});

export function checkAuthenticated(callback, errorCallback = console.error) {
    console.log("Sending request to 'whoami/' endpoint...");
    axiosInstance.get("whoami/")
        .then((res) => {
            console.log("Received response from 'whoami/' endpoint:", res);
            const data = res.data;
            if (data && typeof data.isAuthenticated !== 'undefined') {
                console.log("Authentication successful. isAuthenticated:", data.isAuthenticated);
                callback(data.isAuthenticated, data);
            } else {
                console.error("Invalid data format:", data);
                errorCallback("Invalid data format");
            }
        })
        .catch((err) => {
            console.error("Error fetching data from 'whoami/' endpoint:", err);
            errorCallback(err);
        });
}

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}