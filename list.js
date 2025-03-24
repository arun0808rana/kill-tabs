document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
  
    // Function to add a timestamp section to the DOM
    function addTimestamp(data, index) {
      const timestampContainer = document.createElement("div");
      timestampContainer.className = "timestamp-container";
      timestampContainer.dataset.index = index; // Assign index for identification
  
      const timestampHeader = document.createElement("div");
      timestampHeader.className = "timestamp-header";
  
      const timestampTitle = document.createElement("h2");
      timestampTitle.textContent = `${data.tabs.length} ${data.tabs.length > 1 ? 'Tabs' : 'Tab'} closed on: ${data.timestamp}`;
  
      const closeButton = document.createElement("button");
      closeButton.className = "close-btn";
      closeButton.textContent = "×";
      closeButton.title = 'Close tab group'
  
      timestampHeader.appendChild(timestampTitle);
      timestampHeader.appendChild(closeButton);
      timestampContainer.appendChild(timestampHeader);
  
      const urlList = document.createElement("ul");
      data.tabs.forEach((tabObject) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = tabObject.url;
        link.textContent = tabObject.title || tabObject.url;
        link.target = "_blank";
        listItem.appendChild(link);
        urlList.appendChild(listItem);
      });
  
      timestampContainer.appendChild(urlList);
      return timestampContainer;
    }
  
    // Load and display stored data
    chrome.storage.local.get(["closedTabData"], (result) => {
      const dataList = result.closedTabData || [];
      dataList.forEach((data, index) => {
        const timestampElement = addTimestamp(data, index);
        container.appendChild(timestampElement);
      });
    });
  
    // Event delegation for handling close button clicks
    container.addEventListener("click", (event) => {
      if (event.target.classList.contains("close-btn")) {
        const timestampContainer = event.target.closest(".timestamp-container");
        const indexToRemove = parseInt(timestampContainer.dataset.index, 10);
  
        // Remove the corresponding entry from storage
        chrome.storage.local.get(["closedTabData"], (result) => {
          const updatedData = result.closedTabData || [];
          if (indexToRemove >= 0 && indexToRemove < updatedData.length) {
            updatedData.splice(indexToRemove, 1);
            chrome.storage.local.set({ closedTabData: updatedData }, () => {
              if (chrome.runtime.lastError) {
                console.error("Error updating storage:", chrome.runtime.lastError);
              } else {
                // Remove the element from the DOM
                timestampContainer.remove();
                console.log("Entry removed successfully");
              }
            });
          }
        });
      }
    });
  });
  