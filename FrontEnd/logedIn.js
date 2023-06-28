const logInOut = document.querySelector('#login')
const modifier = document.getElementById('modifier')
const modal = document.createElement('div')
const modalParent = document.getElementById('portfolio')
var works
var modalPage = 1
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
                <form action="">
                    <fieldset class="modal_galerie"></fieldset>
                    <input class="modal_add" type="submit" value="Ajouter une photo"></input>
                    <p class="delete_all">suprimer la galerie</p>
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
                        <i class="fa-sharp fa-regular fa-image"></i>
                        <input type="file"
                            id="add_image" name="add_image"
                            accept="image/png, image/jpeg">
                        <label for="add_image">jpg, png: 4mo max</label>
                    </fieldset>
                    <fieldset class="modal_add-details">
                        <label for="add_titre">Titre</label>
                        <input name="add_titre" id="add_titre" type="text">
                        <label for="add_categorie">Categorie</label>
                        <input name="add_categorie" id="add_categorie" type="text">
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
            <img class="modal_img" src="${work.imageUrl}" alt="${work.title}">
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
        deleteBtns[i].addEventListener('click', async (e) => {
            const response = await requestDelete(i)          //// !!! API request, body ? 
            works.splice([i], 1)
            modalInit()
        })
                // edit function
        editBtns[i].addEventListener('click', (e) => {
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

////// need to do the delete all option
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
            
            const reader = new FileReader()
            console.log(reader)
            reader.addEventListener('load', () => {
                console.log('here')
                var img = new Image()
                img.src = reader.result
                imagePreview.innerHTML = 
                `
                    <img src="${img.src}" alt="image preview" >
                `
            })
            reader.readAsDataURL(imgInput.files[0])
        }
    form.addEventListener('submit', () => {
        const newWork = new Work(titleInput, url, catInput)
        works.push(JSON.stringify(newWork))
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
})
////// Requests
async function requestWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works')
        if (!response.ok) {
            throw new Error('works request failed')
        }
        const works = await response.json()
        return works
    } catch (error) {
        console.error('error', error)
    } 
}   
async function requestDelete(i){
    try {
        const req = await fetch(`'http://localhost:5678/api/works/${i}'`, {
            method: 'delete',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                // userId: localStorage[0]
                token: localStorage[1]
            })
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        resp = await req.json()    
        return resp
    } catch (error) {
        console.error(error)
    }   
}