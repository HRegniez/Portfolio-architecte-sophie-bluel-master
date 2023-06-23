// modalLoad()

// function modalLoad() {
//     injectWorks()


//     async function injectWorks() {
//         const works = await requestWorks()
//         const gallery = document.querySelector('modal_galerie')

//         for(work of works) {
//             const fig = document.createElement('figure')
//             fig.classList.add('modal_figure')
//             fig.innerHTML = 
//                 `
//                     <div class="modal_options">
//                         <i class="fa-solid fa-arrows-up-down-left-right zoom_off"></i>
//                         <i class="fa-solid fa-trash-can delete"></i>
//                     </div>
//                     <img src="${work.imageUrl}" alt="${work.title}">
//                     <p>éditer</p>
                
//                 `
//             gallery.appendChild(fig)
//         }
//     }


//     async function requestWorks() {
//         try {
//             const response = await fetch('http://localhost:5678/api/works')
//             if (!response.ok) {
//                 throw new Error('works request failed')
//             }

//             const works = await response.json()
//             return works
//         } catch (error) {
//             console.error('error', error)
//         } 
//     }    
// }



