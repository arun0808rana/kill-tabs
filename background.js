// Function to handle the collection, storage, and closure of tabs
function handleTabClosure() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const validTabs = tabs.filter(tab => {
      return tab.url.startsWith('http://') || tab.url.startsWith('https://');
    });

    const tabData = validTabs.map(tab => ({
      title: tab.title,
      url: tab.url
    }));
    const tabIds = validTabs.map(tab => tab.id);

    // Store the tab data locally with a timestamp
    const timestamp = new Date().toLocaleString();
    chrome.storage.local.get({ closedTabData: [] }, (result) => {
      const updatedData = result.closedTabData;
      updatedData.unshift({ timestamp, tabs: tabData });
      chrome.storage.local.set({ closedTabData: updatedData }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error storing tab data:', chrome.runtime.lastError);
        } else {
          console.log('Tab data stored successfully');
        }
      });
    });

    // Close all valid tabs in the current window
    chrome.tabs.remove(tabIds);

    // Commented out: Send the URLs to the local server
    /*
    fetch('http://localhost:3000/receive-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ urls: tabData.map(tab => tab.url) })
    }).then(response => {
      if (response.ok) {
        console.log('URLs sent successfully');
      } else {
        console.error('Failed to send URLs');
      }
    }).catch(error => {
      console.error('Error:', error);
    });
    */
  });
}

// Create the context menu item when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'showList',
    title: 'Show List',
    contexts: ['action']
  });
});

// Add a click event listener for the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'showList') {
    chrome.tabs.create({ url: chrome.runtime.getURL('list.html') });
  }
});

// Add a click event listener for the extension icon
chrome.action.onClicked.addListener(() => {
  handleTabClosure();
});
