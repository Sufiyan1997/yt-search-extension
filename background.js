chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onActivated.addListener(async info => {
    const tab = await chrome.tabs.get(info.tabId);


    const isGithub = tab.url.includes('youtube.com');
    if (isGithub) {
      await chrome.action.enable(info.tabId);
    }
    else {
      await chrome.action.disable(info.tabId);
    }

  });
});
