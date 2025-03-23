chrome.action.onClicked.addListener(() => {
    chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
      const tabUrls = currentWindow.tabs.map(tab => tab.url);
      const tabIds = currentWindow.tabs.map(tab => tab.id);
  
      // Close all tabs in the current window
    //   chrome.tabs.remove(tabIds);

    console.log('--tab urls', tabUrls);
  
      // Send the URLs to the local server
      fetch('http://localhost:3000/receive-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls: tabUrls })
      }).then(response => {
        if (response.ok) {
          console.log('URLs sent successfully');
        } else {
          console.error('Failed to send URLs');
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    });
  });
  