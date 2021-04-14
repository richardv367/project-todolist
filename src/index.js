console.log("I AM HERE");
import {format} from "date-fns";
import {addProject, projectFactory, checkToday, checkWeek} from "./modules/projects";
import {addTaskTest, editTask, editTaskPopup, resetInput, sortDate, toggleSortDate} from "./modules/tasks";
import {generateHomeList, generateTodayWeekList, generateProjectList, generateProjectListItem, deleteTaskTest, toggleComplete} from "./modules/init";

const homeButton = document.querySelector("#home-btn");
const todayButton = document.querySelector("#today-btn");
const weekButton = document.querySelector("#week-btn");
const addProjectButton = document.querySelector("#button-add-project");
const addProjectPopup = document.querySelector("#add-project-popup");
const addProjectPopupButtons = document.querySelectorAll("#add-project-popup button");
const addProjectConfirm = document.querySelector("#button-add-project-popup");
const projectInputSubmit = document.querySelector("#submit-input-add-project");
const deleteProjectBtn = document.querySelector("#project-delete-btn");
const addTaskButton = document.querySelector("#button-add-task");
const addTaskPopup = document.querySelector("#add-task-popup");
const addTaskButtons = document.querySelectorAll(".add-task-buttons");
const addTaskSubmit = document.querySelector("#add-task-submit");
const addTaskCancel = document.querySelector("#add-task-cancel");
// const taskDeleteButtons = document.querySelectorAll("img.task-delete");
// const taskEditButtons = document.querySelectorAll("img.fa-pen");
const taskCompleteButtons = document.querySelectorAll(".taskcontent input");
const taskNameInput = document.querySelector("#task-name-input");
const taskDueDateInput = document.querySelector("#due-date-input");
const taskDescriptionInput = document.querySelector("#task-description-input");
const taskPriorityInput = document.querySelector("#priority-select");
const taskViewer = document.querySelector("#task-viewer");
const taskViewerCloseBtn = document.querySelector(".fa-times");
const dateArrow = document.querySelector(".date-arrow");

let taskList = document.querySelector("#todos ul");
let currentDirectory = {index: 0, directory: "ToDo's"};
let action;
let currentN;
let currentDate;


homeButton.addEventListener("click", ()=>{
    generateHomeList();
});
todayButton.addEventListener("click", ()=>{
    currentDirectory = {index: 1, directory: "Today"};
    sortDate(projectStorage[1].tasks, "ascending");
    generateTodayWeekList();
    addTaskButton.classList.add("hidden");
});
weekButton.addEventListener("click", ()=>{
    currentDirectory = {index: 2, directory: "Week"};
    sortDate(projectStorage[2].tasks, "ascending");
    generateTodayWeekList();
    addTaskButton.classList.add("hidden");
})
addProjectButton.addEventListener("click", ()=>{
    addProjectButton.classList.add("active");
    addProjectPopup.classList.remove("active");
});
addProjectPopupButtons.forEach(button => {
    button.addEventListener("click", ()=>{
        addProjectButton.classList.remove("active");
        addProjectPopup.classList.add("active");
    });
});
addProjectConfirm.addEventListener("click", ()=>{
    addProject();
});
projectInputSubmit.addEventListener("submit", ()=>{
    // e.preventDefault();
    addProject();
    console.log("projectInput event listener activated");
});
deleteProjectBtn.addEventListener("click", ()=>{
    let deleteConfirm = confirm("Are you sure you want to delete the current project directory?");
    if (deleteConfirm === true){
        projectStorage.splice(currentDirectory.index, 1);
        console.log("Project storage new: ", projectStorage);
        window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
        generateHomeList();
        generateProjectList();
    }
})
addTaskButton.addEventListener("click", () => {
    action = "add task";
    addTaskButton.classList.add("active");
    taskViewer.classList.add("active");
    addTaskPopup.classList.remove("active");
    deleteProjectBtn.classList.add("hidden");
    console.log("Check action variable: ", action);
    // addEditTaskPopup(action);
});
addTaskButtons.forEach(button => {
    button.addEventListener("click", () => {
        addTaskButton.classList.remove("active");
        addTaskPopup.classList.add("active");
        deleteProjectBtn.classList.remove("hidden");
    });
});
addTaskSubmit.addEventListener("click", ()=>{
    if (action === "add task"){
        addTaskTest(taskList, taskNameInput, taskDueDateInput, taskDescriptionInput, taskPriorityInput, currentDirectory);
    } else if (action === "edit task"){
        console.log("EDIT SUBMIT");
        console.log("Check currentN: ", currentN);
        editTask(taskList, taskNameInput, taskDueDateInput, taskDescriptionInput, taskPriorityInput);
    } else {
        alert("ERROR: action does not match add or edit");
    }
    resetInput(taskNameInput, taskDueDateInput, taskDescriptionInput, taskPriorityInput);
});
addTaskCancel.addEventListener("click", ()=>{
    resetInput(taskNameInput, taskDueDateInput, taskDescriptionInput, taskPriorityInput);
})
taskViewerCloseBtn.addEventListener("click", ()=>{
    taskViewer.classList.add("active");
})

dateArrow.addEventListener("click", ()=>{
    // let index = currentDirectory.index;
    console.log("dateArrow clicked");
    console.log("Check currentDirectory: ", currentDirectory);
    if (dateArrow.classList.contains("ascend")){
        dateArrow.classList.remove("ascend");
        toggleSortDate("descending");
    }else{
        dateArrow.classList.add("ascend");
        toggleSortDate("ascending");
    }
    // sortDate(projectStorage[index].tasks);
})

// , taskName, dueDate,description,priority
let projectStorage = JSON.parse(window.localStorage.getItem('projectStorage'));
currentDate = getCurrentDate();
console.log("Check currentDate: ", currentDate);
if(projectStorage === null){
    console.log("ERROR: projectStorage === NULL, initialised projectStorage to default");
    projectStorage = [];
    projectStorage[0] = projectFactory("ToDo's");
    projectStorage[1] = projectFactory("Today");
    projectStorage[2] = projectFactory("Week");
    console.log(projectStorage);
    // projectStorage[0].tasks[0] = addTask("Example task 01", "1/1/2021");
    // projectStorage[0].tasks[1] = addTask("Example task 02", "1/1/2021");
    // projectStorage[0].tasks[2] = addTask("Example task 03", "1/1/2021");
    generateHomeList();
    generateProjectList();
    // console.log("Logging Todos tasks: ", projectStorage[0].tasks);
} else{
    projectStorage[1] = projectFactory("Today");
    projectStorage[2] = projectFactory("Week");
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    console.log(projectStorage);
    console.log(currentDirectory);
    // CONTINUE HERE
    checkToday();
    checkWeek();
    // console.log("check list input sort SSSS: ", projectStorage[0].tasks);
    sortDate(projectStorage[0].tasks, "ascending");
    generateHomeList();
    generateProjectList();
}
// continue
function getCurrentDate(){
    let dateVariable = new Date;
    // console.log("dateVariable: ", dateVariable);
    let day = dateVariable.getDate();
    let month = dateVariable.getMonth() + 1;
    let year = dateVariable.getFullYear();
    let tempDate = `${month}/${day}/${year}`;
    tempDate = format(new Date(tempDate), "dd/MM/yyyy");
    return { day, month, year, fullDate: tempDate};
    // format(new Date(date), "dd/MM/yyyy")
}

function resetUI(){
    let btnCheck = document.querySelectorAll("li button");
    btnCheck.forEach(button => {
        if (button.classList.contains("current")) {
            button.classList.remove("current");
        }
    })
    
    addTaskButton.classList.remove("hidden");
    addTaskButton.classList.remove("active");
    taskViewer.classList.add("active");
    addTaskPopup.classList.add("active");
}

export {projectStorage, action, currentN, currentDirectory, currentDate, resetUI, taskNameInput, taskDescriptionInput,taskDueDateInput,taskPriorityInput};