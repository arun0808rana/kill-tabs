// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get(["closedTabData"], (result) => {
//     console.log("--result", result);
//     const dataList = result.closedTabData || [];
//     console.log("--dataList", dataList);
//     const container = document.getElementById("container");

//     dataList.forEach((data) => {
//       const timestamp = document.createElement("h2");
//       timestamp.textContent = `Closed on: ${data.timestamp}`;
//       container.appendChild(timestamp);

//       const urlList = document.createElement("ul");

//       data.tabs.forEach((tabObject) => {
//         const listItem = document.createElement("li");
//         const link = document.createElement("a");
//         link.href = tabObject.url;
//         link.textContent = tabObject?.title || url;
//         link.target = "_blank";
//         listItem.appendChild(link);
//         urlList.appendChild(listItem);
//       });
//       container.appendChild(urlList);
//     });
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["closedTabData"], (result) => {
      console.log("--result", result);
      const dataList = result.closedTabData || [];
      console.log("--dataList", dataList);
      const container = document.getElementById("container");
  
      // Outer fragment for the entire batch
      const fragment = document.createDocumentFragment();
  
      dataList.forEach((data) => {
        const timestamp = document.createElement("h2");
        timestamp.textContent = `Closed on: ${data.timestamp}`;
        fragment.appendChild(timestamp);
  
        const urlList = document.createElement("ul");
  
        // Inner fragment to batch all <li> items
        const urlFragment = document.createDocumentFragment();
  
        data.tabs.forEach((tabObject) => {
          const listItem = document.createElement("li");
          const link = document.createElement("a");
          link.href = tabObject.url;
          link.textContent = tabObject?.title || tabObject.url;
          link.target = "_blank";
          listItem.appendChild(link);
          urlFragment.appendChild(listItem);
        });
  
        // Append all <li> at once
        urlList.appendChild(urlFragment);
        fragment.appendChild(urlList);
      });
  
      // Append everything to the DOM once
      container.appendChild(fragment);
    });
  });
  