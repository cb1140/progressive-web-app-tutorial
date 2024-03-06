// < We create consts of our key sections in the HTML, in this case the form
// , the input field and the section where we want our reminders to go


const newReminderForm = document.getElementsByTagName("form")[0];
const reminderContent = document.getElementById("reminderContent");
const reminderList = document.getElementById("myReminders");

// < This is our storage key, for JSON (helps to keep it relevant to the app)
const STORAGE_KEY="reminder-time";

// < We listen for the Submit button >
newReminderForm.addEventListener("submit", (event)=>{
    

    // < This is a local client-side app, so we have to stop
    //   the system default of submitting our data to the server >
    event.preventDefault();

    // < We use our homemade function to check that the form isn't empty >
    validateReminder();

    // < Now, we see what the user has written as their reminder and turn them into their own
    //   consts >
    const newReminder = reminderContent.value;

    // < We store the new reminder data using our function >
    storeNewReminder(newReminder);

    // < We render our new reminder list >
    renderReminders();

    // < We reset the form >
    newReminderForm.reset();

});

// < Re-render reminders, just in case! >
renderReminders();



//< Our function to validate the input box to catch any blank reminders >
function validateReminder(){
    // < Turns the data in the input box to a constant >
    const content = reminderContent.value;
    if (content == "") {
        alert("Please do not leave the reminder blank!");
        return false;

    }
    else{
        alert("Reminder Saved!");
    }
}

// < Our function to store new reminders >
function storeNewReminder(newReminder) {
    // < Create a const that stores all the reminders we have in storage >
    const reminders = getAllReminders();
    //< And pushes those reminders >
    reminders.push(newReminder);
    // < We store those reminders in JSON by turning it into a string it can remember >
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

// < Our function to fetch those reminders from JSON >
function getAllReminders(){
    // < Data is our keyword to fetch individual reminders from JSON with our storage key, which we set earlier>
    const data = window.localStorage.getItem(STORAGE_KEY);
    // < We parse the new data, which means essentially just resorting/checking it as data we can read
    const reminders = data ? JSON.parse(data) : [];
    // < DIR displays a list of all the properties of the object, check the MDN for a better explaination >
    console.dir(reminders);
    // < LOG sends a message to the console, and is apart of the Web Workers spec
    console.log(reminders);
    // < We return all of our reminders
    return reminders;
}

function renderReminders() {
    const reminders = getAllReminders();
    
    // < Clear existing content
    reminderList.innerHTML = "";

    // < To make sure we don't render empty reminders
    if (reminders.length === 0) {
        return;
    }

    // < Here we're creating our Reminder section, with a H2 tag 
    const currentRemindersHeader = document.createElement("h2");
    currentRemindersHeader.textContent = "Your Reminders: ";
    reminderList.appendChild(currentRemindersHeader);

    // > And creating an unordered list for each reminder, which in turn all get turned into their own list item within the ul
    const currentRemindersList = document.createElement("ul");
    reminders.forEach((reminder) => {
        const reminderItem = document.createElement("li");
        reminderItem.textContent = reminder;
        currentRemindersList.appendChild(reminderItem);
    });

    reminderList.appendChild(currentRemindersList);
}

// < Our delete all reminders simply removes the storage key we made earlier
//   from the local storage, which in turn wipes our data
function deleteAllReminders() {
    window.localStorage.removeItem(STORAGE_KEY);
}



