const formToValidate = document.forms[0];
console.log(formToValidate.elements);


console.log("print");

formToValidate.addEventListener("submit", function(event) {
    console.log(event.target);
    event.preventDefault();
});

/////////// BUTTON EVENT LISTENERS //

document.addEventListener('click', function(event) {
    console.log("button pressed!");
    // console.log(event.target);
    // console.log(event.target.nodeName);
    let tickButton = null;

    if (event.target.nodeName == 'I') {
        event = event.target.parentNode
        console.log("parentNode", event);
        if (event.nodeName == "BUTTON") {
            tickButton = true;
        }
    } else {
        event = event.target;
        tickButton = (event.nodeName == 'BUTTON');
    }
    if (tickButton) {
        const element = event;
        let buttonJob = element.attributes.job.value;
        if (buttonJob == "update") {
            myTaskManager.updateTask(element);
        } else if (buttonJob == "delete") {
            myTaskManager.deleteTask(element);
        } else if (buttonJob == "add") {
            validateForm();
        }
    }


});

//////////// NAME VALIDATION//

function validatingNames(inputN, inputA) {
    let isPassed = false;
    //not empty, over 3 char
    if ((inputN != "" && inputN.length >= 3) && (inputA != "" && inputA.length >= 3)) {
        isPassed = true;
        console.log("namesValid");
        return isPassed;
    } else {
        alert("Name/Assigned To field must be 3 characters or more!");
    }
}

function validatingDescription(input) {
    let isDescriptionPassed = false;
    //not empty, over 10 char
    if (input != "" && input.length >= 10) {
        isDescriptionPassed = true;
        console.log("descriptionValid");
        return isDescriptionPassed;
    } else {
        alert("Description field must be 10 characters or more!")
    }
}

function validDateStatus(date, status) {
    console.log(date, status)
    let isValid = false;
    if (date && status) {
        isValid = true;
        console.log("date status valid");
        return isValid;
    } else {
        alert("Date or Status Field is missing!")
    }
}

// this checks the boolean statements returned from the individual functions.If allValid
// returns true, item can be added.
function checkAllValid(isPassed, isDescriptionPassed, isValid) {
    let allValid = false;
    if (isPassed && isDescriptionPassed && isValid) {
        allValid = true
    }
    return allValid
}


function validateForm() {

    const inputName = document.querySelector('#userName').value;
    const inputDescription = document.querySelector('#taskDescription').value;
    const inputAssignedTo = document.querySelector('#inputAssignedTo').value;
    const inputDueDate = document.querySelector('#DueDate').value;
    const inputStatus = document.querySelector('#inputStatus').value;
    const isNameValid = validatingNames(inputName, inputAssignedTo);
    const isDescriptionValid = validatingDescription(inputDescription);
    const isDateValid = validDateStatus(inputDueDate, inputStatus);
    const isAllValid = checkAllValid(isNameValid, isDescriptionValid, isDateValid);
    console.log(isAllValid);

    if (isAllValid == true) {
        createTaskObj(inputName, inputDescription, inputAssignedTo, inputDueDate, inputStatus);
        let taskIndex = myTaskManager.allTasks.length - 1;
        myTaskManager.addTask(myTaskManager.allTasks[taskIndex]);
    };

    document.querySelector("form").reset();
}


//////////// CREATING OBJECT//
function createTaskObj(inputName, inputDescription, inputAssignedTo, inputDueDate, inputStatus) {
    // MAKING SURE EACH TASK ID IS UNIQUE TO EACH CARD
    let taskID = null;
    let usedTaskID = [];
    let j = null;
    for (let i = 0; i < myTaskManager.allTasks.length; i++) {
        j = parseInt(myTaskManager.allTasks[i].TaskID);
        usedTaskID.push(j);
    }

    let highNum = Math.max(...usedTaskID);
    taskID = highNum + 1;

    myTaskManager.allTasks.push({
        "Name": inputName,
        "Description": inputDescription,
        "AssignedTo": inputAssignedTo,
        "DueDate": inputDueDate,
        "Status": inputStatus,
        "TaskID": `${myTaskManager.allTasks.length < 1 ? 1 : taskID}`
    });
    // PUTTING ARRAY IN LOCAL STORAGE
    localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));


    console.log(myTaskManager.allTasks)
    return myTaskManager.allTasks;


}
// CREATE A CLASS TASK MANAGER TO SET THE FUNCTIONALITY
class TaskManager {
    constructor() {
        this.allTasks = [];
    }

    getAllTasks() {
        return this.allTasks;
    }

    addTask(taskObj) {


        let cardHTML = `<div class="col-md-3" taskID="${taskObj.TaskID}">
                        <div class="card cardStyle">
                            <div class="card-header" id="cardhead">
                            <strong><h5>Task</h5></strong>
                            </div>
                            <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Name:</strong> ${taskObj.Name} </li>
                            <li class="list-group-item"><strong>Assigned To:</strong> ${taskObj.AssignedTo} </li>
                            <li class="list-group-item"><strong>Description:</strong> ${taskObj.Description} </li>
                            <li class="list-group-item"><strong>Due Date:</strong> ${taskObj.DueDate}</li> 
                            <li class="list-group-item"><strong>Status:</strong> ${taskObj.Status} </li>
                            </ul>
                            <div class="relative">
                            <button type="button" class="btn btn-light" id="tickbtn" job="delete" deletedID="${taskObj.TaskID}"><i class="fas fa-check" deletedID="${taskObj.TaskID}"></i></button>
                            <a href="#form"> <button type="button" class="btn btn-light" id="rfrshbtn" job="update" updateID="${taskObj.TaskID}"><i class="fas fa-edit" updateID="${taskObj.TaskID}"></i></button></a>  
                            </div>   
                            </div>   
                                       
                    </div>`

        let cardsHTMLrow = document.querySelector('#cardDisplay');
        cardsHTMLrow.innerHTML += cardHTML;

        let listHTML = `<a href="#" id="listItems" class="list-group-item list-group-item-action flex-column align-items-start" taskID="${taskObj.ID}">
        <div class="d-flex w-80 justify-content-between">
        <p><strong>Assigned To:</strong> ${taskObj.AssignedTo} </p>
        <p><strong>Task:</strong> ${taskObj.Description} </p>
        </div>
        <div id="statdate"><small><strong>Status:</strong> ${taskObj.Status}   <strong>Due Date:</strong> ${taskObj.DueDate}</small></div>
        </a>`

        let listHTMLrow = document.querySelector('#listDisplay');
        listHTMLrow.innerHTML += listHTML;
        localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));


    }

    deleteTask(element) {
        console.log("testing run");
        let taskID = element.attributes.deletedID.value
        for (let i = 0; i < this.allTasks.length; i++) {
            if (this.allTasks[i].TaskID == taskID) {
                this.allTasks.splice(i, 1)
                localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));
                console.log("removed from array");
            }
        }
        location.reload();

        // element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);

        // document.querySelector('#tickbtn').addEventListener('click', function() {
        //     deleteTask();

        // });

    }

    updateTask(element) {
        let currentTask = [];
        let currentTaskID = element.attributes.updateID.value;

        for (let i = 0; i < this.allTasks.length; i++) {
            if (this.allTasks[i].TaskID == currentTaskID) {
                currentTask = this.allTasks[i];
            }
        }

        document.querySelector('#userName').value = currentTask.Name;
        document.querySelector('#taskDescription').value = currentTask.Description;
        document.querySelector('#inputAssignedTo').value = currentTask.AssignedTo;

        document.querySelector('#addItemButton').outerHTML = `<button type="button" class="btn btn-primary" id="saveUpdate">Save</button>`

        document.querySelector('#saveUpdate').addEventListener('click', function() {
            const inputName = document.querySelector('#userName').value;
            const inputDescription = document.querySelector('#taskDescription').value;
            const inputAssignedTo = document.querySelector('#inputAssignedTo').value;
            const inputDueDate = document.querySelector('#DueDate').value;
            const inputStatus = document.querySelector('#inputStatus').value;
            const isNameValid = validatingNames(inputName, inputAssignedTo);
            const isDescriptionValid = validatingDescription(inputDescription);
            const isDateValid = validDateStatus(inputDueDate, inputStatus);
            const isAllValid = checkAllValid(isNameValid, isDescriptionValid, isDateValid);

            if (isAllValid == true) {
                currentTask.Name = inputName;
                currentTask.Description = inputDescription;
                currentTask.AssignedTo = inputAssignedTo;
                currentTask.DueDate = inputDueDate;
                currentTask.Status = inputStatus;
                localStorage.setItem("taskArray", JSON.stringify(myTaskManager.allTasks));
                location.reload();
            }

        })

    }

}

////////////POPULATE PAGE TO KEEP ITEMS ON THE PAGE
let myTaskManager = new TaskManager();
let dataReturned = localStorage.getItem("taskArray");

if (dataReturned) {
    myTaskManager.allTasks = JSON.parse(dataReturned);
    populatePage(myTaskManager.allTasks);
} else {
    myTaskManager.taskArray = [];
}

function populatePage(array) {
    for (let i = 0; i < array.length; i++) {
        myTaskManager.addTask(array[i]);
    }
}