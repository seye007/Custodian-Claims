export const Api = (() => {

  async function SendAsync(url, httpMethod, data = null, handleErrorCallback) {
    try {
     
      const headers = {
        'Content-Type': 'application/json',
        'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val(),
      };

      const requestOptions = {
        method: httpMethod,
        headers: headers,
      };

      if (data) {
        requestOptions.body = JSON.stringify(data);
      }

      const apiResponse = await fetch(url, requestOptions);

      if (apiResponse.ok) {
        const result = await apiResponse.json();

        if (result.isSuccessful) {
          return result;
        } else {
          handleErrorCallback(result);
        }
      }
    } catch (error) {
      handleErrorCallback(null, 'An error occurred while processing your request.');
    } 

    return null;
  }

  return {
    SendAsync: SendAsync
  };
})();
