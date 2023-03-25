let myLeads = [];
const inputText = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const delBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log("chromextension")
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputText.value);
  inputText.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

delBtn.addEventListener("click", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    // listItems += "<li><a href='"+myLeads[i]+"' target='_blank'>" + myLeads[i] + "</a></li>";
    listItems += `<li>
        <a href=${myLeads[i]} target='_blank'> 
            ${myLeads[i]}
        </a>
    </li>`;
  }
  ulEl.innerHTML = listItems;
  // similar Way
  // const li=document.createElement("li");
  // li.textContent = myLeads[i]
  // ulEl.append(li);
}
