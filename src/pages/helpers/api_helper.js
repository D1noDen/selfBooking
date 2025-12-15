import axios from "axios";


export function APIClient() {
  
  /**
   * Fetches data from given url
   */
  const get = (url, params, responseType = "json") => {
    return axios.get(url, { params, responseType });
  };

  const deleteInURL = (url, params) => {
    let response;
    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.delete(`${url}?${queryString}`, params);
    } else {
      response = axios.delete(`${url}`, params);
    }

    return response;
  };
  const deleteRequestBodyAndUrl = (url, queryParams = {}, requestBody = {}) => {
    let queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join("&");

    return axios.delete(`${url}${queryString ? `?${queryString}` : ""}`, { data: requestBody });
  };
  /**
   * post given data to url
   */
  const create = (url, data) => {
    return axios.post(url, data);
  };
  const createFormData = (url, data) => {
    return axios.post(url, data ,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
  };
  /**
   * Updates data
   */
  const update = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  const deleteRequest = (url, config) => {
    return axios.delete(url, { ...config });
  };
  return { get, deleteInURL, create, update, deleteRequest , createFormData , deleteRequestBodyAndUrl };
}
