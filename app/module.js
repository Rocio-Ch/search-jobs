export const $ = (selector) => document.querySelector(selector)
export const $$ = (selector) => document.querySelectorAll(selector)
export const URL_BASE = "https://64876527beba62972790912f.mockapi.io/jobs/"
export let filterJobs = []
export let filters = {}
globalThis.isSubmit = false

export const Selectors = {
    openBurguerMenu: "#open-menu",
    closeBurguerMenu: "#close-menu",
    headerMenu: "#nav-menu",
    hideFilters: "#hide-filters",
    filtersContainer: ".filter-box",
    heightFiltersBox: ".filer-box-height",
    btnAddJob: "#add-job",
    sectionFilters: "#filters",
    sectionJobsContainer: ".section-jobs",
    banner: "#banner",
    sectionDetailsJob: "#details-job",
    sectionJobForm: "#section-form",
    inputArea: "#job-area",
    addJobForm: "#form-job",
    btnEditJob: "#edit-job-btn",
    inputSalary: "#job-salary",
    btnDeleteJob: "#delete-job-btn",
    cancelDeleteJob: "#cancel-delete-job-btn",
    header: "header",
    main: "main",
    footer: "footer",
    openModalDeleteJob: "#delete-job",
    selectFilterCategory: "#filter-category",
    selectFilterOption: "#category-options",
    btnClearFilters: "#clear-btn",
    errorMsjValidateArea: "#invalid-area",
    inputPosition: "#job-position",
    jobDescription: "#job-description",
    inputGameName: "#game-name",
    inputLogoImg: "#game-logo",
    jobResponsabilities: "#job-responsabilities",
    inputJobImage: "#job-image",
    jobModality: "#job-modality",
    jobWorkload : "#job-workload",
    jobLocation: "#job-location",
    jobQualifications : "#job-qualifications",
    jobPerks: "#job-perks",
    spinnerContainer: ".spinner-container",
    modalAddedSuccesffuly : "#modal-added-job",
    renderJobsContainer: "#jobs-container",
    sectionJobsLoader: ".loader",
    modalEditedSuccesffuly: "#modal-edited-job",
}

export const Utils = {
    setFocus: (selector) => $(selector).focus(),
    cleanContainer: (selector) => $(selector).innerHTML = '',
    scrollTop: () =>  window.scrollTo({
        top: 0,
        behavior: 'smooth',
    }),
    addClass: (selectors) => {
        for (const selector of selectors) {
            $(selector).classList.add("invisible")  
        }
    },
    removeClass: (selectors) => {
        for (const selector of selectors) {
            $(selector).classList.remove("invisible")  
        }
    },
    hideElements: (selectors) => {
        for (const selector of selectors) {
            $(selector).classList.add("hidden")
        }
    },
    showElements: (selectors) => {
        for (const selector of selectors) {
            $(selector).classList.remove("hidden")
        }
    },
    addingBlur: (selectors) => {
        for (const selector of selectors) {
            $(selector).style.filter = ("blur(1px)")
        }
    },
    removingBlur: (selectors) => {
        for (const selector of selectors) {
            $(selector).style.filter = ("blur(0px)")
        }
    },
    stringToArray: (string) => string.replaceAll('\n','').split('.'),
    arrayToString: (array) =>  array.join('.\n')
}

export const Method = {
    getJobs: (jobId = "") => {
        fetch(`${URL_BASE}${jobId}`)
            .then(res => res.json())
            .then(jobs => {
                if (jobId === "") {
                    filterJobs = jobs
                    Render.renderJobs(jobs)
                    Functions.initializeFilters(jobs)
                } else {
                    Render.populateForm(jobs)
                }
            })
    }, 
    getJobDetails: (jobId) => {
        fetch(`${URL_BASE}${jobId}`)
            .then(res => res.json())
            .then(jobs => Render.renderDetailJob(jobs))
    }, 
    registerJob: () => {
        fetch(`${URL_BASE}`, {
            method: "POST",
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(Method.saveJob())
        })
    },
    editJob: (jobId) => {
        fetch(`${URL_BASE}${jobId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(Method.saveJob())
        })
    },
    deleteJob: (jobId) => {
        fetch(`${URL_BASE}${jobId}`, {
            method: "DELETE"
        }).finally(() => window.location.reload())
    },
    saveJob: () => {
        return {
        "job": {
            "area": $(Selectors.inputArea).value[0].toUpperCase() + $(Selectors.inputArea).value.substring(1),
            "position": $(Selectors.inputPosition).value[0].toUpperCase() + $(Selectors.inputPosition).value.substring(1)
            },
            "gameInfo": {
                "gameName": $(Selectors.inputGameName).value[0].toUpperCase() + $(Selectors.inputGameName).value.substring(1),
                "gameLogo": $(Selectors.inputLogoImg).value
            },
            "salary": $(Selectors.inputSalary).value,
            "description": $(Selectors.jobDescription).value[0].toUpperCase() + $(Selectors.jobDescription).value.substring(1),
            "responsabilities": $(Selectors.jobResponsabilities).value[0].toUpperCase() + $(Selectors.jobResponsabilities).value.substring(1),
            "image": $(Selectors.inputJobImage).value,
            "modality": $(Selectors.jobModality).value[0].toUpperCase() + $(Selectors.jobModality).value.substring(1),
            "workload": $(Selectors.jobWorkload).value[0].toUpperCase() + $(Selectors.jobWorkload).value.substring(1),
            "officeLocation": $(Selectors.jobLocation).value[0].toUpperCase() + $(Selectors.jobLocation).value.substring(1),
            "requiredQualifications": Utils.stringToArray($(Selectors.jobQualifications).value),
            "perks": Utils.stringToArray($(Selectors.jobPerks).value)
        }
    }
}

export const Render = {
    populateForm: ({ job: { area, position }, gameInfo: { gameName, gameLogo }, salary, description, responsabilities, requiredQualifications, image, modality, workload, officeLocation, perks }) => {
        $(Selectors.inputArea).value = area
        $(Selectors.inputJobImage).value = image
        $(Selectors.inputPosition).value = position
        $(Selectors.inputSalary).value = salary
        $(Selectors.jobModality).value = modality
        $(Selectors.jobLocation).value = officeLocation
        $(Selectors.jobWorkload).value = workload
        $(Selectors.inputGameName).value = gameName
        $(Selectors.inputLogoImg).value = gameLogo
        $(Selectors.jobDescription).value = description
        $(Selectors.jobResponsabilities).value = responsabilities
        $(Selectors.jobPerks).value = Utils.arrayToString(perks)
        $(Selectors.jobQualifications).value = Utils.arrayToString(requiredQualifications)
    }, 
    renderJobs: (jobs) => {
        Utils.cleanContainer(Selectors.renderJobsContainer)
        Utils.showElements([Selectors.sectionJobsLoader])
        if (jobs) {
            setTimeout(() => {
                Utils.hideElements([Selectors.sectionJobsLoader])
                for (const { gameInfo: { gameName, gameLogo }, image, job: { position }, description, modality, workload, officeLocation, id } of jobs) {
                    $(Selectors.renderJobsContainer).innerHTML += `
                    <div class="card w-[290px] lg:w-[300px] bg-white border border-slate-500 rounded-lg p-2 m-2 lg:mb-2.5 shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:transition hover:duration-300 hover:-translate-y-[10px]">
                        <div class="flex items-center border-b border-black pb-2.5">
                            <span class="w-[30px] h-[30px] mr-2"><img src="${gameLogo}" onError="this.onerror=null;this.src='./assets/default-logo.svg'" alt=" ${gameName} logo" class="h-full rounded-full"></span>
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
                        <button class="details-btn border border-transparent bg-[#0d0c0cf7] text-white py-1.5 px-4 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)] hover:bg-gradient-to-r hover:from-[#9c0a0a] hover:to-[#dc2626]" data-id="${id}">Details<i class="fa-solid fa-angles-right text-xs ml-1"></i></button>
                    </div>
                    `
                }
            },1000)
        }
    
        setTimeout(() => {
            for (const btn of $$(".details-btn")) {
                btn.addEventListener("click", () => {
                    const jobId = btn.getAttribute("data-id")
                    Method.getJobDetails(jobId)
                })
            }
        },1000)
    },
    renderDetailJob: (job) => {
        Utils.hideElements([Selectors.banner, Selectors.sectionFilters, Selectors.sectionJobsContainer])
        Utils.showElements([Selectors.sectionDetailsJob, Selectors.spinnerContainer])
        setTimeout(() => {
            Utils.hideElements([Selectors.spinnerContainer])
        const { job: { area, position }, gameInfo: { gameName }, salary, description, responsabilities, requiredQualifications, image, modality, workload, officeLocation, perks, id } = job
    
        let requiredQualificationsHTML = ''
        if (requiredQualifications[0] === '') {
            requiredQualificationsHTML += `<li>No required qualifications</li>`
        } else {
            requiredQualifications.forEach(req => {
                requiredQualificationsHTML += `<li>${req}</li>`
            })
        }
    
        let perksHTML = ''
        if (perks[0] === '') {
            perksHTML += `<li>No benefits</li>`
        } else {
            perks.forEach(perk => {
                perksHTML += `<li>${perk}</li>`
            })
        }
    
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
                        <button data-id="${id}" id="edit-job-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-12 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:from-[#1a7780] hover:to-[#0a9907] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]">Edit</button>
                        <button data-id="${id}" id="modal-delete-job-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-12 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:from-[#9c0a0a] hover:to-[#dc2626] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div class="mt-[30px]">
                        <a href="./index.html" id="back-btn" class="border border-transparent bg-[#0d0c0cf7] text-white py-2.5 px-10 rounded mt-2.5 mb-[11px] hover:cursor-[url(./assets/mouse3.png),_pointer] hover:bg-gradient-to-r hover:bg-[#252423] hover:shadow-[-1px_7px_11px_-4px_rgba(0,0,0,75%)]"><i class="fa-solid fa-chevron-left mr-2"></i>Back</a>
                    </div>
                </div>
            </div>
        </article>
        `},2000)
    
        setTimeout(() => {
            $("#edit-job-btn").addEventListener("click", () => {
                const jobId = $("#edit-job-btn").getAttribute("data-id")
                Utils.hideElements([Selectors.sectionFilters, Selectors.sectionJobsContainer, Selectors.banner, Selectors.sectionDetailsJob])
                Utils.showElements([Selectors.sectionJobForm])
                Utils.scrollTop()
                isSubmit = false
                Utils.setFocus(Selectors.inputArea)
                Method.getJobs(jobId)
            })
        
            $("#modal-delete-job-btn").addEventListener("click", () => {
                const jobId = $("#modal-delete-job-btn").getAttribute("data-id")
                $("#delete-job-btn").setAttribute("data-id", jobId)
                Utils.showElements([Selectors.openModalDeleteJob])
                Utils.addingBlur([Selectors.header, Selectors.main, Selectors.footer])
            })
        }, 2000)
    }
}

export const Functions = {
    editingJob: (jobId) => {
        Utils.hideElements([Selectors.sectionFilters, Selectors.sectionJobsContainer, Selectors.banner, Selectors.sectionDetailsJob])
        Utils.showElements([Selectors.sectionJobForm])
        Utils.scrollTop()
        isSubmit = false
        Utils.setFocus(Selectors.inputArea)
        Method.getJobs(jobId)
    },
    openDeleteModal: (id) => {
        Utils.showElements([Selectors.openModalDeleteJob])
        $(Selectors.btnDeleteJob).setAttribute("data-id", id)
        Utils.addingBlur([Selectors.header, Selectors.main, Selectors.footer])
    },
    initializeFilters: (jobs) => {
        filters = {
            "area": [],
            "position": [],
            "gameName": [],
            "modality": [],
            "officeLocation": [],
            "workload": []
        }
        for (const { gameInfo: { gameName }, job: { position, area }, modality, workload, officeLocation } of jobs) {
            Object.keys(filters).forEach((key) => {
                if (!filters[key].includes(eval(key))) {
                    filters[key].push(eval(key))
                }    
             })
        }
    },
    openCreatedJobModal: () => {
        Utils.showElements([Selectors.modalAddedSuccesffuly])
        setTimeout(() => {
            Utils.hideElements([Selectors.modalAddedSuccesffuly])
            window.location.reload()
        }, 2000)
    },
    editedJobModal: () => {
        Utils.showElements([Selectors.modalEditedSuccesffuly])
        setTimeout(() => {
            Utils.hideElements([Selectors.modalEditedSuccesffuly])
            window.location.reload()
        }, 2000)
    },
    validateStrField: (selector, minLength, invalidSelector) => {
        const selectorValue = selector.value
        if (selectorValue.length < minLength) {
          Utils.removeClass([invalidSelector])
          return false
        } else {
          Utils.addClass([invalidSelector])
          return true
        }
    },
    validateNumberField: (selector, minLength, invalidSelector) => {
        const selectorValue = selector.value
        if (selectorValue < minLength) {
          Utils.removeClass([invalidSelector])
          return false
        } else {
          Utils.addClass([invalidSelector])
          return true
        }
    },
    validateForm: () => {
        let fields = [
            {'selector':$(Selectors.inputArea), 'invalidSelector':Selectors.errorMsjValidateArea, 'minLenght':2, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.inputPosition), 'invalidSelector':"#invalid-position", 'minLenght':3, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.inputSalary), 'invalidSelector':"#invalid-salary", 'minLenght':1, 'validationFunction': Functions.validateNumberField},
            {'selector':$(Selectors.jobModality), 'invalidSelector':"#invalid-modality", 'minLenght':6, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.jobLocation), 'invalidSelector':"#invalid-location", 'minLenght':3, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.jobWorkload), 'invalidSelector':"#invalid-workload", 'minLenght':9, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.inputGameName), 'invalidSelector':"#invalid-gameName", 'minLenght':4, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.jobDescription), 'invalidSelector':"#invalid-description", 'minLenght':125, 'validationFunction': Functions.validateStrField},
            {'selector':$(Selectors.jobResponsabilities), 'invalidSelector':"#invalid-responsabilities", 'minLenght':50, 'validationFunction': Functions.validateStrField}
        ]
    
        let isValid = true
        
        for (const field of fields) {
            let ok = field.validationFunction(field.selector, field.minLenght, field.invalidSelector)        
            isValid = isValid && ok
        }
        return isValid
    }
}