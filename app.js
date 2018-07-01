let dataTable = document.querySelector('.data-table');
let disElement = document.querySelector('.datatr');
let loader = document.querySelector('.loader');
let addDataBtn = document.querySelector('.add-databtn');
let addForm = document.querySelector('.myform');
let addFormClose = document.querySelector('.addclose');
let dataAdded = document.querySelector('.data-added');
let formAddData = document.querySelector('#addForm');
let orderByNameBtn = document.querySelector('.order-by .name');
let orderByYearBtn = document.querySelector('.order-by .year');

// RENDER DATA
function renderData(doc) {
    if (loader !== undefined) {
        loader.style.cssText = "display: none;";
    }
    dataTable.style.cssText = "display: block;"
    if (dataTable !== undefined) {
        if (disElement !== undefined) {
            disElement.innerHTML += `<tr data-id="${doc.id}">
                        <td> ${doc.data().name} </td>
                        <td> ${doc.data().year} </td>
                        <td class="deletebtn"> <button onclick="deleteData('${doc.id}')">Delete</button> </td>
                    </tr>`;
        }
    }
}

// ADD DATA FORM OPEN FUNCTION
function addFormf(param) {
    if (param == "remove") {
        addForm.classList.remove('remove');
    }
    else if (param == "add") {
        addForm.classList.add('remove');
    } else {
        console.log("Please use add or remove as a parameter");
    }
}

// ADD DATA FORM OPEN
if (addDataBtn !== undefined) {
    addDataBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addFormf("remove");
    });
}

// ADD DATA FORM CLOSE
if (addFormClose !== undefined) {
    addFormClose.addEventListener('click', (e) => {
        e.preventDefault();
        addFormf("add");
    });
}

// DATA ADDED SUCCESSFULLY FUNCTION
function dataInfo(action) {
    if (dataAdded !== undefined) {

        if (action == "success") {
            dataAdded.style.display = "block";
            dataAdded.textContent = "Data Added Successfully";
            dataAdded.classList.add('success');
            dataAdded.classList.remove('error');
        } else if (action == "error") {
            dataAdded.style.display = "block";
            dataAdded.textContent = "Some error occured";
            dataAdded.classList.remove('success');
            dataAdded.classList.add('error');
        } else if (action == "delete") {
            dataAdded.style.display = "block";
            dataAdded.textContent = "Deleted Successfully";
            dataAdded.classList.add('success');
            dataAdded.classList.remove('error');
        } else {
            console.log("Please use defined actions 'success', 'error' or 'delete'.");
        }

        setInterval(() => {
            dataAdded.style.display = "none";
        }, 2000);

    }
}

// GETTING DATA
// db.collection('games').where('year', '==', '2016').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach((element) => {
//         renderData(element);
//     })
// }).catch((err) => {
//     console.log(`Some error occures :--  ${err}`);
// });
db.collection('games').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
        if (change.type == "added") {
            // console.log();
            renderData(change.doc);
        } else if (change.type == "removed") {
            let tr = disElement.querySelector('[data-id="' + change.doc.id + ']');
            disElement.removeChild(tr);
        }

    })

});


// ADDING DATA
if (formAddData !== undefined) {
    formAddData.addEventListener('submit', (e) => {
        e.preventDefault();
        if (formAddData.name.value !== "" && formAddData.year.value !== "") {
            db.collection('games').add({
                name: formAddData.name.value,
                year: formAddData.year.value
            });
            // EMPTY INPUT FIELDS
            formAddData.name.value = "";
            formAddData.year.value = "";

            addFormf("add");
            dataInfo('success');
        } else {
            alert("Please fill all fields");
        }
    });
}

// DELETING DATA
function deleteData(id) {
    let confirmation = confirm("Do you really want to delete");
    if (confirmation) {
        db.collection('games').doc(id).delete();
        dataInfo('delete');
    } else {
        return false;
    }
}

// ORDERING DATA BY NAME
if (orderByNameBtn !== undefined) {
    orderByNameBtn.addEventListener('click', () => {
        if (loader !== undefined) {
            loader.style.cssText = "display: block;";
        }
        disElement.innerHTML = "";
        dataTable.style.cssText = "display: none;"
        db.collection('games').orderBy('name').get().then((snapshot) => {
            snapshot.docs.forEach((element) => {
                renderData(element);
            })
        }).catch((err) => {
            console.log(`Some error occures :--  ${err}`);
        });
    });
}
if (orderByYearBtn !== undefined) {
    orderByYearBtn.addEventListener('click', () => {
        if (loader !== undefined) {
            loader.style.cssText = "display: block;";
        }
        disElement.innerHTML = "";
        dataTable.style.cssText = "display: none;"
        db.collection('games').orderBy('year').get().then((snapshot) => {
            snapshot.docs.forEach((element) => {
                renderData(element);
            })
        }).catch((err) => {
            console.log(`Some error occures :--  ${err}`);
        });
    });
}