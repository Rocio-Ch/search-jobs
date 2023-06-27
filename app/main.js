// selectores universales
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

//hide elements 
const hideElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}
//show elements
const showElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}
// adding brightness 
const addingBrigthness = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("brightness(0.5)")
    }
}
// removing brightness 
const removingBrigthness = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("brightness()")
    }
}
//apply autofocus
const setFocus = (selector) => $(selector).focus()


$("#open-menu").addEventListener("click", () => {
    hideElements(["#open-menu"])
    showElements(["#nav-menu", "#close-menu"])
})

$("#close-menu").addEventListener("click", () => {
    hideElements(["#nav-menu", "#close-menu"])
    showElements(["#open-menu"])
})

$("#hide-filters").addEventListener("click", () => {
    $(".filter-box").classList.toggle("hidden")
    $(".filer-box-height").classList.toggle("lg:h-[100px]")
    $(".section-jobs").classList.toggle("lg:pt-[200px]")
})

$("#add-job").addEventListener("click", () => {
    hideElements(["#filters", ".section-jobs", "#banner"])
    showElements(["#section-form"])
    window.scrollTo(0, 0)
    setFocus("#job-area")
})



const URL_BASE = "https://64876527beba62972790912f.mockapi.io/jobs"


const getJobs = () => {
    fetch(`${URL_BASE}`)
        .then(res => res.json())
        .then(jobs => renderJobs(jobs))
}

/* ${} */

const renderJobs = (jobs) => {
    if (jobs) {
        for (const { gameInfo: { gameName, gameLogo }, image, job: { position }, description, modality, workload, officeLocation, id } of jobs) {
            $("#jobs-container").innerHTML += `
            <div class="card min-w-[280px] w-[300px] bg-white border border-slate-950 rounded-lg p-2.5 m-5 lg:mb-2.5 shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:transition hover:duration-300 hover:-translate-y-[10px]">
                <div class="flex items-center border-b border-black pb-2.5">
                    <span class="w-[35px] mr-2"><img src="${gameLogo}" alt=" ${gameName} logo"></span>
                    <h3 class="font-bold">${gameName}</h3>
                </div>
                <div class="my-2.5 mt-2.5 shadow-[2px_6px_8px_rgba(0,0,10,59%)]">
                    <img src="${image}" alt="concept art" class="h-[160px] w-full">
                </div>
                <div class="truncationText">
                    <h4 class="font-bold text-lg my-1"><i class="fa-solid fa-briefcase mr-2"></i>${position}</h4>
                    <p>${description}</p>
                </div>
                <div class="py-5 border-b border-black mb-2.5">
                    <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs mr-0.5 p-1">#${officeLocation}</span>
                    <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs mr-0.5 p-1">#${workload}</span>
                    <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs mr-0.5 p-1">#${modality}</span>
                </div>
                <button id="details-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-1.5 px-4 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:bg-gradient-to-r hover:from-[#9c0a0a] hover:to-[#dc2626]" data-id="${id}">Details<i class="fa-solid fa-angles-right text-xs ml-1"></i></button>
            </div>
            `
        }
    }
}





window.addEventListener("load", () => {
    getJobs()
})