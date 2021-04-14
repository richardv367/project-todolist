import {taskFactory} from "./tasks";
import {currentDate, projectStorage} from "../index";
import {addTask, generateTaskItem, generateProjectListItem} from "./init";
import { addDays, format,isToday, isThisWeek, isSameWeek, parseISO, parse } from "date-fns";


// FACTORY FUNCTIONS
const projectFactory = (name) => {
    let projectName = name;
    let tasks = [];
    return {projectName, tasks};
}

let projectList = document.querySelector("#project-list");




// CONTINUE HERE
function addProject() {
    const projectInput = document.querySelector("#input-add-project-popup");
    console.log("logging input value:", projectInput.value);
    let n = projectStorage.length;
    console.log(n);
    console.log("HERE");
    projectStorage[n] = projectFactory(projectInput.value);
    window.localStorage.setItem("projectStorage", JSON.stringify(projectStorage));
    console.log("Check project storage values: ",projectStorage);
    projectList.appendChild(generateProjectListItem(projectInput.value, n));
}

function checkToday(){
    console.log("checkToday function");
    // console.log(projectStorage[1]);
    // console.log(currentDate);
    let length = projectStorage.length;
    for (let i=0; i<length; i++){
        if (i === 1 || i === 2){
            console.log("Skipped today and week projectStorage");
            continue;
        }
        let taskLength = projectStorage[i].tasks.length;
        for (let j=0; j<taskLength; j++){
            let testDate = parse(`${projectStorage[i].tasks[j].dueDate}`, 'dd/MM/yyyy', new Date());
            let result = isToday(testDate);
            if (result === true){
                // console.log("Found matching date: ", projectStorage[i].tasks[j]);
                let todayTask = projectStorage[i].tasks[j];
                todayTask.location = [i, j];
                console.log("todayTask: ", todayTask);
                projectStorage[1].tasks.push(todayTask);
            }
        }
    }
    
}
// function checkWeek(){
//     console.log("checkWeek function");
//     console.log(projectStorage[2]);
//     console.log(currentDate);
//     // let testDate;
//     let weekDates = [];
//     weekDates[0] = currentDate.fullDate;
//     let loopDate;
//     let testDate = `${currentDate.month}/${currentDate.day}/${currentDate.year}`;
//     let length = projectStorage.length;
//     // ${currentDate.fullDate}
//     // tempDate = format(new Date(tempDate), "yyyy-MM-dd");
//     // testDate = new Date(testDate);
//     // tempDate = parseISO(tempDate);
//     // testDate = parseISO(`${currentDate.year}-${currentDate.month}-${currentDate.day}`);
//     console.log("Check testDate: ", testDate);
//     for (let i=0; i<6; i++){
//         testDate = new Date(testDate);
//         testDate = addDays(testDate, 1);
//         // console.log("New testDate before: ", testDate);
//         // let day = testDate.getDate();
//         // let month = testDate.getMonth();
//         // let year = testDate.getFullYear();
//         // testDate = `${month}/${day}/${year}`;
//         loopDate = format(new Date(testDate), "dd/MM/yyyy");
//         weekDates.push(loopDate);
//         // console.log("New testDate after: ", loopDate);
//         // console.log("New testDate: ", format(testDate, "dd/MM/yyyy"));
//     }
//     console.log("Check weekDates: ", weekDates);

//     for (let i=0; i<length; i++){
//         if (i === 1 || i === 2){
//             console.log("Skipped today and week projectStorage");
//             continue;
//         }
//         let taskLength = projectStorage[i].tasks.length;
//         for (let j=0; j<taskLength; j++){
//             for (let k=0; k<6; k++){
//                 if (projectStorage[i].tasks[j].dueDate === weekDates[k]){
//                 console.log("Found matching date: ", projectStorage[i].tasks[j]);
//                 let weekTask = projectStorage[i].tasks[j];
//                 weekTask.location = [i, j];
//                 // `projectStorage[${i}].tasks[${j}]`
//                 console.log("weekTask: ", weekTask);
//                 projectStorage[2].tasks.push(weekTask);
//             }
//         }
//             // console.log("HERE");
//         }
//     }

// }
function checkWeek(){
    // console.log("checkWeek function");
    // console.log(projectStorage[2]);
    // console.log(currentDate);
    let length = projectStorage.length;
    for (let i=0; i<length; i++){
        if (i === 1 || i === 2){
            console.log("Skipped today and week projectStorage");
            continue;
        }
        let taskLength = projectStorage[i].tasks.length;
        for (let j=0; j<taskLength; j++){
            let testDate = parse(`${projectStorage[i].tasks[j].dueDate}`, 'dd/MM/yyyy', new Date());
            // testDate = format(testDate, "dd/MM/yyyy");
            // console.log("testDate HERE: ", testDate);
            let result = isThisWeek(testDate);
            // console.log("Check result: ", result);
            if (result === true){
                let weekTask = projectStorage[i].tasks[j];
                weekTask.location = [i, j];
                console.log("weekTask: ", weekTask);
                projectStorage[2].tasks.push(weekTask);
            }
        }
    }
}

export {addProject, projectFactory, checkToday, checkWeek};