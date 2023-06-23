
const logInOut = document.querySelector('#login')
const modifier = document.getElementById('modifier')
const modal = document.createElement('div')
const modalParent = document.getElementById('portfolio')
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
    modifier.addEventListener('click', () => {      // modal launch event listener 
        modalInit()  
    }) 
}else{
    logInOut.innerHTML = ' <a href="./login.html">login</a>'
}

async function modalInit() {
    console.log(modalPage)
    const works = await requestWorks()
    modalInitContent()
    injectWorks(works)
    loadModalOptions(works)      
}
function modalInitContent() {
    modal.innerHTML= ''
    modal.classList.remove('modal')// ????
    modal.classList.add('modal')
    if(modalPage === 1){
        modal.innerHTML = `
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
        modal.innerHTML = `
            <div class="modal_contain">
                <i class="fa-solid fa-xmark"></i>
                <i class="fa-solid fa-xmark modal_exit"></i>
                <h3>Rajouter potos photo</h3>
                <form action="">
                    <fieldset class="modal_galerie"></fieldset>
                    <input class="modal_add" type="submit" value="Ajouter une photo"></input>
                    <p class="delete_all">suprimer la galerie</p>
                </form>
            </div>
        `
        modalParent.appendChild(modal)
    }
    
}
function injectWorks(works) {
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
function loadModalOptions(works) {

            //////// close modal
    const modalExit = document.querySelector('.modal_exit')
    console.log(works)
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

            //////// Works in gallery options ( zoom-icon/delete/edit )
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
    
    
    // delete all works

}
function modalClose() {
    modal.classList.remove('modal')
    modal.innerHTML = ''    
}

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
                userId: localStorage[0],
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