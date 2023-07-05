const logInOut = document.querySelector('#login')
const modifier = document.getElementById('modifier')
const modal = document.createElement('div')
const modalParent = document.getElementById('portfolio')

let works
let modalPage = 1
let categories
                                        // Is logged in ?

if(localStorage.userId == 1){
    logInOut.innerHTML = 'logout'
    logInOut.addEventListener('click', () => {
        window.localStorage.clear()
        // logInOut.innerHTML = ' <a href="./login.html">login</a>'
        modifier.innerHTML = ''
    })
    modifier.innerHTML = `
    <i class="fa-regular fa-pen-to-square edit"></i>
    <p>modifier<p>
    `
    modifier.addEventListener('click', async () => {      // modal launch event listener 
        works = await requestWorks()
        categories = await requestCategories()
        console.log(categories)
        modalInit()  
    }) 
} // else{
//     logInOut.innerHTML = ' <a href="./login.html">login</a>'
    
// }

async function modalInit() {
    modalInitContent()
    
    if(modalPage == 1){
        modalExt()
        injectWorks()
        modalGalery()  
    }else if(modalPage == 2){
        modalExt()
        modalBack()
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
                    <button class="modal_add-confirm">Confirmer</button> 
                </div>
            </div>
        `
        loadCats()
        modalParent.appendChild(modal)
    }
    
}
function loadCats() {
            const catSelect = document.querySelector('#add_categorie')
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
    console.log()
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
    const imgInput = document.querySelector('#add_image')
    const titleInput = document.querySelector('#add_titre')
    // const catInputs = document.querySelectorAll('.modal_cat-option')
    const catInputs = document.querySelector('#add_categorie')
    const formBtn = document.querySelector('.modal_add-confirm')
    const imagePreview = document.querySelector('.modal_add-img')
    let img
    let catId = 1
    imgInput.addEventListener('change', () => {
        
        if(imgInput.files && imgInput.files[0]) {
            img = new Image()
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                img.src = reader.result
                console.log(img.src)
                imagePreview.innerHTML = 
                `
                    <img class="preview_img" src="${img.src}" alt="image preview" >
                `

            })
            reader.readAsDataURL(imgInput.files[0])
            }
        
        })
    catInputs.addEventListener('change', (event) => {
        catId = event.target.value
    })
    // for(catInput of catInputs) {
    //     console.log(catInput)
    //     catInput.addEventListener('select', () => {
    //         console.log(catInput.dataset.id)
    //         catId = catInput.dataset.id
    //     })
    // }
    formBtn.addEventListener('click', (e) => {
        console.log('click')
        e.preventDefault()
        const newWork = new Work(works.length, titleInput.value, img.src, JSON.stringify(catId))
        console.log(newWork)
        works.push(JSON.stringify(newWork))
        console.log(JSON.stringify(newWork))
        requestAddWork(JSON.stringify(newWork))
        modalPage = 1
        modalInit()
    })
    class Work {
        constructor(index, title, imageUrl, catId) {
            this.id = index
            this.title = title
            this.imageUrl = imageUrl
            this.categoryId = catId
            this.userId = localStorage.getItem('userId')
        }
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
        return works                                // ?? do i need to create a const or replace existing variable ??
    } catch (error) {
        console.error('error', error)
    } 
}   
async function requestDelete(index) {
    try {
        const req = await fetch(`http://localhost:5678/api/works/{${index}}`, {
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
async function requestAddWork(newWork) {
    try {
        const req = await fetch(`'http://localhost:5678/api/works'`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({newWork})
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        let resp = await req  
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
