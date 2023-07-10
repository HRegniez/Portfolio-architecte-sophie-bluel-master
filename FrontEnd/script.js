init()

async function init() {
    const works = await requestWorks()
    const gallery = document.querySelector('.gallery')
    const categoryIndex = { value: 0 }
    loadPage(works, gallery, categoryIndex)
    loadCategories(works, gallery, categoryIndex)
    logOut()
}

async function loadPage(works, gallery, categoryIndex) {            // Load main page content
    gallery.innerHTML = ''
    if(categoryIndex.value === 0) {
        for (work of works) {
            const fig = document.createElement('figure')
            fig.dataset.id = work.id
            fig.innerHTML = 
                `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
                `
            gallery.appendChild(fig)
        }
    } else {
        const worksFilter = works.filter((work) => { 
            return work.categoryId === categoryIndex.value
        }) 
        for (workFiltered of worksFilter) {
            const fig = document.createElement("figure")
            fig.innerHTML = 
                `
                <img src="${workFiltered.imageUrl}" alt="${workFiltered.title}">
                <figcaption>${workFiltered.title}</figcaption>
                `
            gallery.appendChild(fig)
        }
    }
}

async function loadCategories(works, gallery, categoryIndex) {
    const navFilters = document.querySelector('.nav_filters')
    if(!localStorage.userId == 1){
        const categories = await requestCategories()
        categories.unshift({id : 0, name : 'Tout'})
        const filtersContain = document.createElement('ul')
        filtersContain.classList.add('filters')
        navFilters.appendChild(filtersContain)
        for (const categorie of categories) {
            const filter = document.createElement('li')
            if(categoryIndex.value === categorie.id) {
                filter.classList.add('filter-selected')
            }else{
                filter.className='filter'
            }
            filter.innerHTML = 
            `
                <a data-set="${categorie.id}"> ${categorie.name} </a>
            `
            filtersContain.appendChild(filter)
            filter.addEventListener('click', () => {
                categoryIndex.value = categorie.id  
                filtersContain.remove()
                loadPage(works, gallery, categoryIndex)
                loadCategories(works, gallery, categoryIndex)
            })    
    }}else{
        navFilters.innerHTML = ''
    }
}

function logOut() {
    const btn = document.querySelector('#login')
    btn.addEventListener('click', () => {
        window.localStorage.clear()
        btn.innerHTML = ' <a href="./login.html">login</a>'
        loadCategories()
    })
}
///////////////////////////////////////// Requests
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