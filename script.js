const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show Modal, Focus on Input
const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

// Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Validate Form
const validate = (nameValue, urlValue) => {
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex) || !urlValue.includes("https://")) {
    alert(`Please provide a valid web address that includes https://.
    An address starting with only www. is invalid.`);
    return false;
  }
  //   Valid
  return true;
};

// Build Bookmarks DOM
const buildBookmarks = () => {
  // Removie all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-trash-alt");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

// Fetch Bookmarks
const fetchBookmarks = () => {
  // Get bookmarks from localStorage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks array in localStorage
    const id = `http://github.com/jedchernandez/bookmark-app`;
    bookmarks[id] = {
      name: "bookmark-app",
      url: "https://github.com/jedchernandez/bookmark-app",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

// Delete Bookmark
const deleteBookmark = (id) => {
  //   Loop through the bookmarks array
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage,
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

// Handle Data from Form
let storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  // Validate
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// General Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();
