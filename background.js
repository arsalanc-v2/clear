// background.js

import {
  createTab,
  executeFunction,
  sleep,
  closeTab,
  focusTab,
  clickDeleteAllButton,
  clickConfirmDeleteButton,
  formScript
} from "./helper.js";

const SEARCH_ACTIVITY_URL = "https://myactivity.google.com/privacyadvisor/search";
const SLEEP_DURATION = 1000;

const POS_RESULT_MSG = "Result: your search activity has been deleted.";
const NEG_RESULT_MSG = "Result: your search activity remains with Google.";
const CREATE_TAB_ERR = "Error: failed to create a new tab.";
const DELETE_ERR = "Error: failed to delete.";
const CLOSE_ERR = "Error: failed to close created tab.";
const RETURN_ERR = "Error: failed to switch back to original tab.";

chrome.browserAction.onClicked.addListener(originalTab => {
  let newTabId;

  createTab(SEARCH_ACTIVITY_URL, new Error(CREATE_TAB_ERR + "\n" + NEG_RESULT_MSG))
    .then(newTab => {
      if (!newTab) {
        return Promise.reject(new Error(CREATE_TAB_ERR + "\n" + NEG_RESULT_MSG));
      }
      newTabId = newTab.id;
    })
    .then(() => executeFunction(newTabId, formScript(clickDeleteAllButton),
      new Error(DELETE_ERR + "\n" + NEG_RESULT_MSG)))

    .then(() => executeFunction(newTabId, formScript(clickConfirmDeleteButton),
      new Error(DELETE_ERR + "\n" + NEG_RESULT_MSG)))

    .then(() => sleep(SLEEP_DURATION)) // wait for search activity to be deleted
    .then(() => closeTab(newTabId, new Error(CLOSE_ERR + "\n" + POS_RESULT_MSG)))
    .then(() => focusTab(originalTab.id, new Error(RETURN_ERR + "\n" + POS_RESULT_MSG)))
    .then(() => alert(POS_RESULT_MSG))
    .catch(err => alert(err.message));
});
