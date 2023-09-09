
// ms to time, "00:00:00"
export const msToTime = (milliseconds) => {
  var seconds = Math.floor((milliseconds / 1000) % 60);
  var minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  var hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return (
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2)
  );
}

// set number minimum fraction digits format
export const setMinimumFractionFormat = (number = 1, minimumFractionNum = 1) => {
  return (number).toLocaleString(
    undefined, // leave undefined to use the visitor's browser 
              // locale or a string like 'en-US' to override it.
    { minimumFractionDigits: minimumFractionNum }
  );
}

// Send data between components
export const EventBus = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};
