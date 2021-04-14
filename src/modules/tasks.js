import {format, isBefore, toDate, parse} from "date-fns";
import {projectStorage, currentN, taskNameInput, taskDescriptionInput, taskDueDateInput, taskPriorityInput, currentDirectory} from "../index";
import {generateTaskItem, generateProjectContent, editReplaceTaskLi, generateHomeList, generateTodayWeekList} from "./init";


// format(new Date(dueDate))

// FACTORY FUNCTIONS
const taskFactory = (name, date, description, priority, directory) => {
    let taskName = name;
    let dueDate = format(new Date(date), "dd/MM/yyyy");
    // let description = description;
    // let priority = priority;
    let completed = false;
    let project = directory;
    return {taskName, dueDate, description, priority, completed, project};
}

function addTask(taskName, dueDate){
    let newTask = taskFactory(taskName, dueDate);
    return newTask;
}
// CONTINUE HERE
function addTaskTest(taskList, taskNameInput, taskDueDateInput, taskDescriptionInput, taskPriorityInput){
    console.log("PROJECT STORAGE: ", projectStorage);
    console.log("currentDirectory to add task: ", currentDirectory);
    let N = currentDirectory.index;
    let projectName = currentDirectory.directory;
    let tasksLength = projectStorage[N].tasks.length;
    let taskName = taskNameInput.value;
    let dueDate = taskDueDateInput.value;
    let description = taskDescriptionInput.value;
    let priority = taskPriorityInput.value;
    console.log("TASK LENGTH: ", tasksLength);
    console.log("taskName: ", taskName);
    console.log("dueDate: ", dueDate);
    projectStorage[N].tasks[tasksLength] = taskFactory(taskName, dueDate,description, priority, projectName);
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    console.log("Checking localStorage: ", JSON.parse(window.localStorage.getItem('projectStorage')));
    // console.log("projectStorage: ", projectStorage);
    taskList.appendChild(generateTaskItem(projectStorage[currentDirectory.index].tasks[tasksLength], tasksLength));
    console.log("I AM HERE")
}

function resetInput(input1, input2, input3, input4){
    input1.value = "";
    input2.value = "";
    input3.value = "";
    input4.value = "";
    currentN = "";
}
function editTaskPopup(editIcon){
    console.log("Edit task function here");
    console.log("Check e.target:", editIcon);
    console.log("Check e.target:", editIcon.parentElement);
    let N = currentDirectory.index;
    let arrayN = editIcon.parentElement.parentElement.dataset.n;
    currentN = arrayN;
    console.log("Check currentN: ", currentN);
    let date = editIcon.parentElement.children[2].children[0].textContent;
    let dateSplit = getDateFormatted(date);
    taskNameInput.value = editIcon.parentElement.children[1].children[0].textContent;
    console.log("date check: ", date);
    console.log("date check format 1: ", dateSplit);
    taskDueDateInput.value = dateSplit;
    // console.log("Finding task value1: ", projectStorage[0].tasks[arrayN].description);
    // console.log("Finding task value1: ", projectStorage[0].tasks[arrayN].priority);
    // console.log("Finding dataset-n: ", editIcon.parentElement.parentElement.dataset.n);
    taskDescriptionInput.value = projectStorage[N].tasks[arrayN].description;
    taskPriorityInput.value = projectStorage[N].tasks[arrayN].priority;
 }
function editTask(taskList, input1, input2, input3, input4){
    console.log("currentDirectory to add task: ", currentDirectory);
    console.log("I AM HERE");
    let taskName = taskNameInput.value;
    let dueDate = taskDueDateInput.value;
    let description = taskDescriptionInput.value;
    let priority = taskPriorityInput.value;
    let editDirectory;
    let replaceLocation;
    let N;
    console.log("NO ERROR YET");
    if ((currentDirectory.directory === "today") || (currentDirectory.directory === "week")){
        console.log("I AM HERE 1");
        N = projectStorage[currentDirectory.index].tasks[currentN].location[0];
        let N2 = projectStorage[currentDirectory.index].tasks[currentN].location[1];
        editDirectory = projectStorage[N].tasks[N2].project;
        console.log("editdirectory: ", editDirectory);
        projectStorage[N].tasks[N2] = taskFactory(taskName, dueDate,description, priority,editDirectory);
        console.log("today or week HERE");
    } else{
        console.log("I AM HERE 2");
        N = currentDirectory.index;
        console.log("I AM HERE checking N: ", N);
        editDirectory = projectStorage[N].projectName;
    }
    N = currentDirectory.index;
    console.log("currentN: ", currentN);
    projectStorage[N].tasks[currentN] = taskFactory(taskName, dueDate,description, priority,editDirectory);
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    editReplaceTaskLi();
}

function sortDate(list, direction){
    let sortedList;
    if (direction === "ascending"){
        sortedList = list.sort((a, b) => {
        if (!isBefore(parse(`${a.dueDate}`, 'dd/MM/yyyy', new Date()), parse(`${b.dueDate}`, 'dd/MM/yyyy', new Date())))
            return 1;
        else return -1;
        });
    } else if (direction === "descending"){
        sortedList = list.sort((a, b) => {
        if (isBefore(parse(`${a.dueDate}`, 'dd/MM/yyyy', new Date()), parse(`${b.dueDate}`, 'dd/MM/yyyy', new Date())))
            return 1;
        else return -1;
        });
    } else{
        console.log("ERROR SORTING DATE, INVALID ARGUMENTS");
    }
    console.log("Check sortedList: ", sortedList);
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    
}
function toggleSortDate(direction){
    let indexn = currentDirectory.index;
    console.log("Check index: ", indexn);
    console.log("Check projectstorage: ", projectStorage);
    sortDate(projectStorage[indexn].tasks, direction);
    if (indexn === 0){
        generateHomeList();
    } else if((indexn === 1) || (indexn === 2)){
        generateTodayWeekList();
    } else {
        generateProjectContent(currentDirectory.directory, currentDirectory.index);
    }
}
function getDateFormatted(date) {
    let array = date.split('/');
    console.log("check date split: ", array);
    let day = array[0];
    let month = array[1];
    let year = array[2];
    return `${year}-${month}-${day}`;
}



export {addTask, editTask, addTaskTest, editTaskPopup,resetInput, taskFactory, sortDate, toggleSortDate, getDateFormatted};