const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)
const setFocus = (selector) => $(selector).focus()
const cleanContainer = (selector) => $(selector).innerHTML = ''

const hideElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add("hidden")
    }
}
const showElements = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove("hidden")
    }
}
const addingBlur = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("blur(1px)")
    }
}
const removingBlur = (selectors) => {
    for (const selector of selectors) {
        $(selector).style.filter = ("blur(0px)")
    }
}

const StringToArray = (string) => string.split('.')
const arrayToString = (array) =>  array.join('.\n')

const URL_BASE = "https://64876527beba62972790912f.mockapi.io/jobs/"
let isSubmit = false
let filterJobs = []

const getJobs = (jobId = "") => {
    fetch(`${URL_BASE}${jobId}`)
        .then(res => res.json())
        .then(jobs => {
            if (jobId === "") {
                filterJobs = jobs
                renderJobs(jobs)
                initializeFilters(jobs)
            } else {
                populateForm(jobs)
            }
        })
}

const getJobDetails = (jobId) => {
    fetch(`${URL_BASE}${jobId}`)
        .then(res => res.json())
        .then(jobs => renderDetailJob(jobs))
}

const registerJob = () => {
    fetch(`${URL_BASE}`, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    })
}

const editJob = (jobId) => {
    fetch(`${URL_BASE}${jobId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveJob())
    })
}

const deleteJob = (jobId) => {
    fetch(`${URL_BASE}${jobId}`, {
        method: "DELETE"
    }).finally(() => window.location.reload())
}

const saveJob = () => {
    return {
    "job": {
        "area": $("#job-area").value,
        "position": $("#job-position").value
        },
        "gameInfo": {
            "gameName": $("#game-name").value,
            "gameLogo": $("#game-logo").value
        },
        "salary": $("#job-salary").value,
        "description": $("#job-description").value,
        "responsabilities": $("#job-responsabilities").value,
        "image": $("#job-image").value,
        "modality": $("#job-modality").value,
        "workload": $("#job-workload").value,
        "officeLocation": $("#job-location").value,
        "requiredQualifications": StringToArray($("#job-qualifications").value),
        "perks": StringToArray($("#job-perks").value)
    }
}

const populateForm = ({ job: { area, position }, gameInfo: { gameName, gameLogo }, salary, description, responsabilities, requiredQualifications, image, modality, workload, officeLocation, perks }) => {
    $("#job-area").value = area
    $("#job-image").value = image
    $("#job-position").value = position
    $("#job-salary").value = salary
    $("#job-modality").value = modality
    $("#job-location").value = officeLocation
    $("#job-workload").value = workload
    $("#game-name").value = gameName
    $("#game-logo").value = gameLogo
    $("#job-description").value = description
    $("#job-responsabilities").value = responsabilities
    $("#job-perks").value = arrayToString(perks)
    $("#job-qualifications").value = arrayToString(requiredQualifications)
}

const editingJob = (jobId) => {
    hideElements(["#filters", ".section-jobs", "#banner", "#details-job"])
    showElements(["#section-form", ".alert-qualifications", ".alert-perks"])
    window.scrollTo(0, 0)
    isSubmit = false
    setFocus("#job-area")
    getJobs(jobId)
}

/* RENDERS */
const renderJobs = (jobs) => {
    cleanContainer("#jobs-container")
    showElements([".loader"])
    if (jobs) {
        setTimeout(() => {
            hideElements([".loader"])
            for (const { gameInfo: { gameName, gameLogo }, image, job: { position }, description, modality, workload, officeLocation, id } of jobs) {
                $("#jobs-container").innerHTML += `
                <div class="card w-[290px] lg:w-[300px] bg-white border border-slate-500 rounded-lg p-2 m-4 lg:mb-2.5 shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:transition hover:duration-300 hover:-translate-y-[10px]">
                    <div class="flex items-center border-b border-black pb-2.5">
                        <span class="w-[30px] h-[30px] mr-2"><img src="${gameLogo}" onError="this.onerror=null;this.src='./assets/default-logo.png'" alt=" ${gameName} logo" class="h-full rounded-full"></span>
                        <h3 class="font-bold">${gameName}</h3>
                    </div>
                    <div class="my-2.5 mt-2.5 shadow-[2px_6px_8px_rgba(0,0,10,59%)]">
                        <img src="${image}" onError="this.onerror=null;this.src='./assets/default-photo.jpg'" alt="concept art" class="h-[160px] w-full">
                    </div>
                    <div class="truncationText">
                        <h4 class="font-bold text-lg my-1"><i class="fa-solid fa-briefcase mr-2"></i>${position}</h4>
                        <p>${description}</p>
                    </div>
                    <div class="flex flex-wrap items-center py-5 border-b border-black mb-2.5">
                        <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs m-0.5 p-1">#${officeLocation}</span>
                        <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs m-0.5 p-1">#${workload}</span>
                        <span class="rounded text-[#eedada] bg-[#b90606ed] text-xs m-0.5 p-1">#${modality}</span>
                    </div>
                    <button class="details-btn border border-transparent bg-[#0d0c0cf7] text-white py-1.5 px-4 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:bg-gradient-to-r hover:from-[#9c0a0a] hover:to-[#dc2626]" data-id="${id}" onclick="getJobDetails('${id}')">Details<i class="fa-solid fa-angles-right text-xs ml-1"></i></button>
                </div>
                `
            }
        },1000)
    }
}

const renderDetailJob = (job) => {
    hideElements(["#banner", "#filters", ".section-jobs"])
    showElements(["#details-job", ".spinner-container"])
    window.scrollTo(0, 0)
    setTimeout(() => {
        hideElements([".spinner-container"])
    const { job: { area, position }, gameInfo: { gameName }, salary, description, responsabilities, requiredQualifications, image, modality, workload, officeLocation, perks, id } = job

    let requiredQualificationsHTML = ''
    requiredQualifications.forEach(req => {
        requiredQualificationsHTML += `<li>${req}</li>`
    })

    let perksHTML = ''
    perks.forEach(perk => {
        perksHTML += `<li>${perk}</li>`
    })

    $("#details-job-container").innerHTML = `
    <article class="flex flex-col justify-center items-center pt-[50px] pb-[30px] px-[30px] sm:w-[70%] lg:w-[60%] sm:self-center sm:border-l sm:border-black bg-transparent">
        <div class="self-start sm:flex sm:flex-wrap sm:items-center">
            <div class="w-[260px] sm:w-[300px] mb-2 sm:pr-2.5 sm:border-r sm:border-black">
                <img class="" src="${image}" onError="this.onerror=null;this.src='./assets/default-photo.jpg'" alt="">
            </div>
            <ul class="sm:ml-2.5">
                <li class="font-bold text-black mb-2.5">Area: <span class="text-[#b90606ed] mr-2">${area}</span></li>
                <li class="font-bold text-black mb-2.5">Position: <span class="text-[#b90606ed] mr-2">${position}</span></li>
                <li class="font-bold text-black mb-2.5">Game: <span class="text-[#b90606ed] mr-2">${gameName}</span></li>
            </ul>
        </div>
        <div class="flex flex-col justify-center py-2.5">
            <span class="font-bold text-black">Description:</span>
            <p class="pb-2.5 mb-2.5 border-b border-black text-justify">${description}</p>
            <span class="font-bold text-black">Responsabilities:</span>
            <p class="pb-2.5 mb-2.5 border-b border-black text-justify">${responsabilities}</p>
            <span class="font-bold text-black">Required qualifications:</span>
            <ul class="border-b border-black pb-2.5 mb-2.5 px-[25px] list-disc">
            ${requiredQualificationsHTML}
            </ul>
            <span class="font-bold text-black">Our perks:</span>
            <ul class="border-b border-black pb-2.5 mb-2.5 px-[25px] list-disc">
                ${perksHTML}
            </ul>
            <div class="sm:flex sm:flex-wrap border-b border-black pb-2.5">
                <div class="mb-2.5 sm:mr-[80px] sm:mb-0">
                    <div class="mb-2.5">
                        <span><i class="fa-solid fa-house-laptop mr-1"></i>${modality}</span>
                    </div>
                    <div class="mb-2.5 sm:mb-0">
                        <span><i class="fa-solid fa-dollar-sign mr-1"></i>${salary}</span>
                    </div>
                </div>
                <div class="mb-2.5 sm:mr-[80px] sm:mb-0">
                    <div class="mb-2.5">
                        <span><i class="fa-regular fa-clock mr-1"></i>${workload}</span>
                    </div>
                    <div class="mb-2.5 sm:mb-0">
                        <span><i class="fa-solid fa-location-dot mr-1"></i>${officeLocation}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between flex-wrap">
                <div class="w-[260px] mt-[30px] mr-2.5 flex justify-between">
                    <button data-id="${id}" id="edit-job-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-12 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:from-[#1a7780] hover:to-[#0a9907] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]" onclick="editingJob('${id}')">Edit</button>
                    <button data-id="${id}" id="modal-delete-job-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-12 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:from-[#9c0a0a] hover:to-[#dc2626] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]" onclick="openDeleteModal('${id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="mt-[30px]">
                    <a href="./index.html" id="back-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-10 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:bg-[#252423] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]"><i class="fa-solid fa-chevron-left mr-2"></i>Back</a>
                </div>
            </div>
        </div>
    </article>
    `},2000)
}



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


window.addEventListener("load", () => {
    getJobs()
})