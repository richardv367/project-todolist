import {resetUI, projectStorage, action, currentN, currentDirectory} from "../index";
import {editTask, editTaskPopup, getDateFormatted} from "./tasks";
// import {generateProjectListItem} from "./projects";

const todoListContent = document.querySelector("#todos ul");
const projectList = document.querySelector("#project-list");
const taskListHeader = document.querySelector(".list-header h1");
const deleteProjectBtn = document.querySelector("#project-delete-btn");
const addTaskButton = document.querySelector("#button-add-task");
const addTaskPopup = document.querySelector("#add-task-popup");
const taskViewerPopup = document.querySelector("#task-viewer");
const taskViewerContent = document.querySelector("#task-viewer-content");


function generateHomeList(){
    const homeButton = document.querySelector("#home-btn");
    resetUI();
    homeButton.classList.add("current");
    todoListContent.innerHTML = "";
    let length = projectStorage[0].tasks.length;
    currentDirectory = {index: 0, directory: "ToDo's"};
    taskListHeader.textContent = "Testing";
    console.log("List length", length);
    console.log("homeList: ", todoListContent);
    for (let i=0;i<length;i++) {
        todoListContent.appendChild(generateTaskItem(projectStorage[0].tasks[i], i));
    }
    deleteProjectBtn.classList.add("active");
}
function generateTodayWeekList(){
    resetUI();
    if (currentDirectory.directory === "Today"){
        const todayButton = document.querySelector("#today-btn");
        todayButton.classList.add("current");
        todoListContent.innerHTML = "";
        let length = projectStorage[1].tasks.length;
        currentDirectory = {index: 1, directory: "Today"};
        taskListHeader.textContent = "Due Today";
        for (let i=0;i<length;i++) {
            todoListContent.appendChild(generateTaskItem(projectStorage[1].tasks[i], i));
        }
        deleteProjectBtn.classList.add("active");
    }
    else if (currentDirectory.directory === "Week"){
        const weekButton = document.querySelector("#week-btn");
        weekButton.classList.add("current");
        todoListContent.innerHTML = "";
        let length = projectStorage[2].tasks.length;
        currentDirectory = {index: 2, directory: "Week"};
        taskListHeader.textContent = "Due This Week";
        for (let i=0;i<length;i++) {
            todoListContent.appendChild(generateTaskItem(projectStorage[2].tasks[i], i));
        }
        deleteProjectBtn.classList.add("active");
    } else{
        console.log("ERROR NEITHER TODAY OR WEEK");
    }

}

function generateProjectList(){
    projectList.innerHTML = "";
    let length = projectStorage.length - 3;
    let index;
    console.log("Project List Length: ", length);
    console.log("Project List: ", projectStorage[3]);
    for (let i=0; i<length; i++){
        index = i + 3;
        let project = projectStorage[index];
        if (project === null){
            break;
        } else{
            console.log("Check Project Name: ", projectStorage[index].projectName);

            projectList.appendChild(generateProjectListItem(project.projectName, index));
        }
    }
}

function generateProjectContent(projectName, projectIndex, button){
    resetUI();
    console.log("generateProjectContent: ", projectName);
    console.log("generateProjectContent: ", projectIndex);
    console.log("generateProjectContent: ", button);
    let length = projectStorage[projectIndex].tasks.length;
    taskListHeader.textContent = projectName;
    currentDirectory = {index: projectIndex, directory: projectName};
    console.log("currentDirectory: ", currentDirectory);
    button.classList.add("current");
    todoListContent.innerHTML = "";
    for (let i=0;i<length;i++) {
        todoListContent.appendChild(generateTaskItem(projectStorage[projectIndex].tasks[i], i));
    }
    deleteProjectBtn.classList.remove("active");
}

function generateProjectListItem(name, index){
    let li = document.createElement("li");
    let button = document.createElement("button");
    let icon = document.createElement("i");
    let div = document.createElement("div");

    button.setAttribute("class", "button-project");
    button.setAttribute("data-n", index);
    icon.setAttribute("class", "fas fa-list-ul");
    button.appendChild(icon);
    div.textContent = name;
    div.classList.add("active");
    button.addEventListener("click", e=>{
        generateProjectContent(button.children[1].textContent, button.dataset.n, button);
    })
    button.appendChild(div);
    // button.classList.add("active");
    // button.innerHTML += name;
    li.appendChild(button);
    li.classList.add("active");
    return li;
}

function generateTaskItem(input, number){
    let li = document.createElement("li");
    let div = document.createElement("div");
    li.classList.add("task-item");
    div.classList.add("task-content");
    let div2 = document.createElement("div");
    let div2h3 = document.createElement("h3");
    let div3h3 = document.createElement("h3");
    let div3 = document.createElement("div");
    let img = document.createElement("img");
    let img2 = document.createElement("i");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    if (input.completed === true){
        checkbox.checked = true;
        li.classList.add("completed");
    } else{
        checkbox.checked = false;
        li.classList.remove("completed");
    }
    checkbox.addEventListener("click", e =>{
        console.log("Check e.target: ", e.target);
        toggleComplete(e.target);
    })
    div2.classList.add("task-name");
    div3.classList.add("task-duedate");
    div2h3.textContent = input.taskName;
    div3h3.textContent = input.dueDate;
    div2h3.addEventListener("click", e=>{
        taskViewer(e.target);
    })
    div3h3.addEventListener("click", e=>{
        taskViewer(e.target);
    })
    img.classList.add("task-delete");
    img.setAttribute("src", "./icons/delete.svg");
    img.addEventListener("click", e => {
        console.log("Check e.target: ", e.target);
        deleteTaskTest(e.target);
    })
    img2.classList.add("fas");
    img2.classList.add("fa-pen");
    img2.addEventListener("click", e => {
        action = "edit task";
        addTaskButton.classList.add("active");
        addTaskPopup.classList.remove("active");
        taskViewerPopup.classList.add("active");
        console.log("Check edit e.target: ", e.target);
        console.log("Check action variable: ", action);
        editTaskPopup(e.target);
    })
    div2.appendChild(div2h3);
    div3.appendChild(div3h3);
    div.appendChild(checkbox);
    div.appendChild(div2);
    div.appendChild(div3);
    div.appendChild(img);
    div.appendChild(img2);
    li.appendChild(div);
    li.setAttribute("data-n", `${number}`);
    li.classList.add(input.priority);
    li.classList.add("blink");
    return li;
}

// function generateEditTaskItem{
    
// }

// function addEditTaskPopup(action){
//     // addTaskButton.classList.add("active");
//     // addTaskPopup.classList.remove("active");
//     console.log(action);
// }

function toggleComplete(checkbox){
    let li = checkbox.parentElement.parentElement;
    let arrayN = checkbox.parentElement.parentElement.dataset.n;
    if (li.classList.contains("completed")){
        li.classList.remove("completed");
        // li.classList.add("blink");
        checkbox.checked = false;
        projectStorage[currentDirectory.index].tasks[arrayN].completed = false;
    } else {
        li.classList.add("completed");
        // li.classList.remove("blink");
        checkbox.checked = true;
        projectStorage[currentDirectory.index].tasks[arrayN].completed = true;
    }
    console.log("Check arrayN: ", arrayN);
    console.log("Check completed status: ", projectStorage[currentDirectory.index].tasks[arrayN].completed);
    console.log("toggleComplete clicked");
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
}

function deleteTaskTest(button){
    // console.log("PROJECT STORAGE: ", projectStorage);
    // let tasksLength = projectStorage[0].tasks.length;
    // console.log("TASK LENGTH: ", tasksLength);
    // let taskName = taskNameInput.value;
    // let dueDate = taskDueDateInput.value;
    // console.log("taskName: ", taskName);
    // console.log("dueDate: ", dueDate);
    // projectStorage[0].tasks[tasksLength] = taskFactory(taskName, dueDate);
    // window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    // console.log("Checking localStorage: ", JSON.parse(window.localStorage.getItem('projectStorage')));
    // // console.log("projectStorage: ", projectStorage);
    // appendList.appendChild(generateTaskItem(projectStorage[0].tasks[tasksLength]));
    taskViewerPopup.classList.add("active");
    console.log("button: ", button.parentElement.parentElement);
    let arrayN = button.parentElement.parentElement.dataset.n;
    console.log("arrayN: ", arrayN);
    button.parentElement.parentElement.remove();
    projectStorage[currentDirectory.index].tasks.splice(arrayN, 1);
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    updateArrayN();
}

function taskViewer(e){
    // console.log("Check e.target dataset-n: ", e.parentElement.parentElement.parentElement.dataset.n);
    taskViewerPopup.classList.remove("active");
    let li = e.parentElement.parentElement.parentElement;
    let index = currentDirectory.index;
    currentN = e.parentElement.parentElement.parentElement.dataset.n;
    console.log("Check currentN: ", currentN);
    let name = li.children[0].children[1].textContent;
    let date = li.children[0].children[2].textContent;
    let dateSplit = getDateFormatted(date);
    let prio = projectStorage[currentDirectory.index].tasks[currentN].priority;
    console.log("name:", name);
    console.log("name: ", dateSplit);
    console.log("name: ", date);
    // console.log("name:", )
    taskViewerContent.innerHTML = `<h3>Task Name: ${name}</h3>
                                    <h3>Due Date: ${date}</h3>
                                    <h3>Priority: ${prio}</h3>
                                    <h3>Description: ${projectStorage[index].tasks[currentN].description}</h3>
                                    <h3>Directory: ${projectStorage[index].tasks[currentN].project}</h3>`;

}

function updateArrayN(){
    let listItems = document.querySelectorAll(".tasks li");
    let iterationN = 0;
    listItems.forEach(listItem => {
        listItem.setAttribute("data-n", iterationN);
        iterationN += 1;
    })
}
function editReplaceTaskLi(){
    let listItems = document.querySelectorAll(".tasks li");
    let iterationN = 0;
    let listItemToReplace;
    listItemToReplace = document.getElementsByClassName("task-item")[currentN];
    console.log("currentN value: ", currentN);
    console.log("Check listItems: ", listItems.NodeList);
    console.log("Check listItemToReplace: ", listItemToReplace);
    let newListItem = generateTaskItem(projectStorage[currentDirectory.index].tasks[currentN], currentN);
    listItemToReplace.parentNode.replaceChild(newListItem, listItemToReplace);
    // listItemToReplace.innerHTML = "<h2>TEST</h2>";
    console.log("Check listItemToReplace: ", listItemToReplace);
}



export {generateHomeList, generateTodayWeekList, generateProjectList, generateProjectListItem, generateTaskItem, deleteTaskTest, toggleComplete, editReplaceTaskLi};
