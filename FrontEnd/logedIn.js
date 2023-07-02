const logInOut = document.querySelector('#login')
const modifier = document.getElementById('modifier')
const modal = document.createElement('div')
const modalParent = document.getElementById('portfolio')

let works
let modalPage = 1
                                        // Is logged in ?

if(localStorage.userId == 1){
    logInOut.innerHTML = 'logout'
    logInOut.addEventListener('click', () => {
        window.localStorage.clear()
        logInOut.innerHTML = ' <a href="./login.html">login</a>'
        modifier.innerHTML = ''
    })
    modifier.innerHTML = `
    <i class="fa-regular fa-pen-to-square edit"></i>
    <p>modifier<p>
    `
    modifier.addEventListener('click', async () => {      // modal launch event listener 
        works = await requestWorks()
        modalInit()  
    }) 
}else{
    logInOut.innerHTML = ' <a href="./login.html">login</a>'

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
                <form class="modal_add-form" method="post" action="push">
                    <fieldset class="modal_add-img">
                        <img class="modal_add-icon" src="./assets/icons/iconImg.png" alt="icon d'une image" >
                        <!-- <label id="add_img-label" for="add_img"> -->
                            <input type="file" id="add_image" class="add_img " accept="image/png, image/jpeg">
                            <!-- + Ajouter photo
                        </label> -->
                        <span class="add_image-span">jpg, png: 4mo max</span>
                    </fieldset>
                    <fieldset class="modal_add-details">
                        <label for="add_titre">Titre</label>
                        <input name="add_titre" id="add_titre" type="text">
                        <label for="add_categorie">Catégorie</label>
                        <select name="add_categorie" id="add_categorie" type="text">
                            <option value="1">Objets</option>
                            <option value="2">Appartements</option>
                            <option value="3">Hotel & restaurants</option>
                        </select>
                    </fieldset>
                    <input class="modal_add-confirm" type="submit" value="Valider"></input> 
                </form>
            </div>
        `
        modalParent.appendChild(modal)
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
            requestDelete(i)
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
function addWork(works) {
    const imgInput = document.querySelector('#add_image')
    const titleInput = document.querySelector('#add_titre')
    const catInput = document.querySelector('#add_categorie')
    const form = document.querySelector('.modal_add-form')
    const imagePreview = document.querySelector('.modal_add-img')

    imgInput.addEventListener('change', () => {
        if(imgInput.files && imgInput.files[0]) {
            let img = new Image()
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                console.log('here')
                img.src = reader.result
                imagePreview.innerHTML = 
                `
                    <img class="preview_img" src="${img.src}" alt="image preview" >
                `
            })
            reader.readAsDataURL(imgInput.files[0])
            return img
        }
    form.addEventListener('submit', () => {
        const newWork = new Work(titleInput, img.src, catInput)
        works.push(JSON.stringify(newWork))
        requestAddWork(newWork)
        modalPage = 1
        modalInit()
        // const input = JSON.stringify(
        //     `
        //         {
        //             "id": 0,
        //             "title": "string",
        //             "imageUrl": "string",
        //             "categoryId": "string",
        //             "userId": 0
        //         }
        //     `
        // )
    })
    class Work {
        constructor(title, imageUrl, categoryId) {
            this.id = works.length
            this.title = title
            this.imageUrl = imageUrl
            this.categoryId = categoryId
        }
    }
})}
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
async function requestDelete(i) {
    try {
        const req = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'content-type': 'application/json'
            }
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        return await req.json()
    } catch (error) {
        console.error(error)
    }   
}
async function requestAddWork(newWork) {
    try {
        const req = await fetch(`'http://localhost:5678/api/works'`, {
            method: 'post',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token"),
                'content-type': 'application/json'
            },
            body: JSON.stringify({newWork})
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        return await req.json()
    } catch (error) {
        console.error(error)
    }   
}
