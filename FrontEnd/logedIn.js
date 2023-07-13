const logInOut = document.querySelector('#login')
const modifiers = document.querySelectorAll('#modifier')
const modal = document.createElement('div')
const modalParent = document.getElementById('portfolio')
let imgData = ''
let works
let modalPage = 1
let categories
let imgInputFile = ''
                                        // Is logged in ?

if(localStorage.userId == 1){
    logInOut.innerHTML = 'logout'
    logInOut.addEventListener('click', () => {
        window.localStorage.clear()
        logInOut.innerHTML = ' <a href="./login.html">login</a>'
        modifiers[0].innerHTML = ''
        modifiers[1].innerHTML = ''
    })
    for(modifier of modifiers) {
        modifier.innerHTML = `
        <i class="fa-regular fa-pen-to-square edit"></i>
        <p>modifier<p>
        `
            
    }
    modifiers[1].addEventListener('click', async () => {      // modal launch event listener 
            works = await requestWorks()
            categories = await requestCategories()
             modalInit()  
        }) 
   
}

async function modalInit() {
    modalInitContent()
    
    if(modalPage == 1){
        modalExt()
        injectWorks()
        modalGalery()  
    }else if(modalPage == 2){
        modalExt()
        modalBack()
        imagePreview()
        checkInputToActivateBtn()
        addWork()
    }         
}
function modalInitContent() {
    modal.innerHTML = ''
    modal.classList = ''
    if(modalPage === 1){
        modal.classList.add('modal')
        modal.innerHTML = 
        `
            <div class="modal_contain">
                <i class="fa-solid fa-xmark modal_exit"></i>
                <h3>Galerie photo</h3>
                <form action="post">
                    <fieldset class="modal_galerie"></fieldset>
                    <input class="modal_add" type="submit" value="Ajouter une photo"></input>
                    <p class="delete_all">supprimer la galerie</p>
                </form>
            </div>
        `
    modalParent.appendChild(modal)
    }else if(modalPage === 2) {
        modal.classList.add('modal')
        modal.innerHTML = 
        `
            <div class="modal_contain">
                <i class="fa-solid fa-arrow-left modal_goback"></i>
                <i class="fa-solid fa-xmark modal_exit"></i>
                <h3>Ajout photo</h3>
                <div class="modal_add-form" >
                    <fieldset class="modal_add-img">
                        <img class="modal_add-icon" src="./assets/icons/iconImg.png" alt="icon d'une image" >
                        <label id="add_img-label" for="add_image">
                            + Ajouter photo
                        </label>
                        <input type="file" id="add_image" class="add_img " accept="image/png, image/jpeg">
                        <span class="add_image-span">jpg, png: 4mo max</span>
                    </fieldset>
                    <fieldset class="modal_add-details">
                        <label for="add_titre">Titre</label>
                        <input  class="add_input" name="add_titre" id="add_titre" type="text">
                        <label for="add_categorie">Catégorie</label>
                        <div class="add_categorie-wrap">
                            <select class="add_input"  name="add_categorie" id="add_categorie" type="text">
                            </select>
                            <img src="./assets/icons/arrow-down.svg" >
                        </div>
                    </fieldset>
                    <button class="modal_add-confirm disabled">Confirmer</button> 
                </div>
            </div>
        `
        loadCats()
        modalParent.appendChild(modal)
    }
    
}
function loadCats() {
            const catSelect = document.querySelector('#add_categorie')
            categories.unshift({id: 0, name: ' '})
            for(cat of categories) {
                const categorie = document.createElement('option')
                categorie.value = cat.id 
                categorie.classList.add('modal_cat-option')
                categorie.innerText = cat.name
                catSelect.appendChild(categorie)
            }
        }
function injectWorks() {
    const gallery = document.querySelector('.modal_galerie')
    for(work of works) {
        const fig = document.createElement('figure')
        fig.classList.add('modal_figure')
        fig.innerHTML = 
        `
            <div class="modal_options flex">
                <i class="fa-solid fa-arrows-up-down-left-right zoom_off"></i>
                <i class="fa-solid fa-trash-can modal_delete"></i>
            </div>
            <img class="modal_img" src="${work.imageUrl}" data-id="${work.id}" alt="${work.title}">
            <p class="modal_edit">éditer</p>
        `
        gallery.appendChild(fig)    
    }
    
}  
            //////// close modal
function modalExt() {
    const modalExit = document.querySelector('.modal_exit')
    modal.addEventListener('click', (e) => {
        e.stopPropagation()
        if( e.target === modal ) {
            modalClose()
        } else {
            return
        }        
    })
    modalExit.addEventListener('click', (e) => {
        e.stopPropagation()
        modalClose()
    })
    if(modalPage == 2) {
        modalPage = 1
    }
}
function modalBack() {
    const backBtn = document.querySelector('.modal_goback')
    backBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        modalPage = 1
        modalInit()
    })
}
            //////// Works in gallery options ( zoom-icon/delete/edit )
function modalGalery() {
    const modalFigures = document.querySelectorAll('.modal_figure')
    const modalImgs = document.querySelectorAll('.modal_img')
    const zoomIcons = document.querySelectorAll('.fa-arrows-up-down-left-right')
    const deleteBtns = document.querySelectorAll('.modal_delete')
    const editBtns = document.querySelectorAll('.modal_edit')
                // zoom_on icon on hover
    for ( let i = 0; i < modalFigures.length; i++) {
        modalImgs[i].addEventListener('mouseover', e => {
            zoomIcons[i].classList.toggle('zoom_off')
        })
        modalImgs[i].addEventListener('mouseout', e => {
            zoomIcons[i].classList.toggle('zoom_off')
        })
                // delete work
        deleteBtns[i].addEventListener('click', async () => {
            const deleteWorks = document.querySelectorAll(`[data-id="${works[i].id}"]`)
            for (deleteWork of deleteWorks) {
                deleteWork.remove()
            }
            requestDelete(works[i].id)
            works.splice(i, 1)
            modalInit()
        })
                // edit function
        editBtns[i].addEventListener('click', () => {
            return
        })
    }
            ///////// Add works button
    const modalAdd = document.querySelector('.modal_add')
    modalAdd.addEventListener('click', (e) => {
        modalPage = 2
        modalInit()
    })
}

////// ?? need to do the delete all option ??
function modalClose() {
    modal.classList.remove('modal')
    modal.innerHTML = ''    
}
function addWork() {
    // Get all datas
    const button = document.querySelector('.modal_add-confirm')
    button.addEventListener('click', async () => {
        const title = document.querySelector('#add_titre')
        const category = document.querySelector('#add_categorie')
        const newWork = new FormData();
        newWork.append('title', title.value);
        newWork.append('category', category.value);
        if(!imgInputFile == ''){
            newWork.append('image', imgInputFile);
        }
        const req = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
                // content-type is automatically set to multipart/form-data when using FormData
            },
            body: newWork
        })
        const resp = await req.json() // use .json() method to get response as json 
        reloadPage(resp)        
    })
}
function reloadPage (resp) {
    works.push(resp)
    const gallery = document.querySelector('.gallery')
    const fig = document.createElement('figure')
    fig.dataset.id = resp.id
    fig.innerHTML = 
        `
        <img src="${resp.imageUrl}" alt="${resp.title}">
        <figcaption>${resp.title}</figcaption>
        `
    gallery.appendChild(fig)
    modalPage = 1
    modalInit()
}
function imagePreview() {
    const imgInput = document.querySelector('#add_image')
    imgInput.addEventListener('change', () => {
        if(imgInput.files[0]){
            imgInputFile = imgInput.files[0]
            let img = new Image()
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                img.src = reader.result
                document.querySelector('.modal_add-img').innerHTML = 
                `
                    <img class="preview_img" src="${img.src}" alt="image preview" >
                `
            })    
            reader.readAsDataURL(imgInput.files[0])
        }
    })  
}

function checkInputToActivateBtn() {
    const datas = []
    const title = document.querySelector('#add_titre')
    const category = document.querySelector('#add_categorie')
    const imgInput = document.querySelector('#add_image')
    datas.push(title, category, imgInput)
    let modalCheck = 0
    for(data of datas) {
        data.addEventListener('change', () => {
            modalCheck += 1
            if(modalCheck === 3) {
            document.querySelector('.modal_add-confirm').disabled = false
            document.querySelector('.modal_add-confirm').classList.toggle('disabled')
            }else {
                document.querySelector('.modal_add-confirm').disabled = true
            }
        })
    }
    
}

////// Requests
async function requestWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works')
        if (!response.ok) {
            throw new Error('works request failed')
        }
        works = await response.json()
        return works
    } catch (error) {
        console.error('error', error)
    } 
}   
async function requestDelete(index) {
    try {
        const req = await fetch(`http://localhost:5678/api/works/${index}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'content-type': 'application/json'
            }
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        const resp = await req 
        return resp
    } catch (error) {
        console.error(error)
    }   
}
async function requestCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories')
        if (!response.ok) {
            throw new Error('categories request failed')
        }
        const categories = await response.json()
        return categories
    } catch (error) {
        console.error('error', error)
    } 
}
