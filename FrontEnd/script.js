init()

async function init() {
    const works = await requestWorks()
    const gallery = document.querySelector('.gallery')
    const counter = { value: 0 }
    loadPage(works, gallery, counter)
    loadCategories(works, gallery, counter)
}

async function loadPage(works, gallery, counter) {            // Load main page content
    gallery.innerHTML = ''
    if(counter.value === 0) {
        for (work of works) {
            const fig = document.createElement('figure')
            fig.innerHTML = 
                `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
                `
            gallery.appendChild(fig)
        }
    } else {
        const worksFilter = works.filter((work) => { 
            return work.categoryId === counter.value
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

async function loadCategories(works, gallery, counter) {
    const categories = await requestCategories()
    categories.unshift({id : 0, name : 'Tout'})
    const filtersContain = document.querySelector('.filters')
    for (const categorie of categories) {
        const filter = document.createElement('li')
        filter.innerHTML = 
        `
            <li class="filter" data-set="${categorie.id}"> ${categorie.name} </li>
        `
        filtersContain.appendChild(filter)
        filter.addEventListener('click', e => {
            counter.value = categorie.id
            loadPage(works, gallery, counter)
        })
    }
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