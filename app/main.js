import { $, filters, Utils, Method, Render, filterJobs, Functions, Selectors } from './modules.js'

/* EVENTS */
$(Selectors.openBurguerMenu).addEventListener("click", () => {
    Utils.hideElements([Selectors.openBurguerMenu])
    Utils.showElements([Selectors.headerMenu, Selectors.closeBurguerMenu])
})

$(Selectors.closeBurguerMenu).addEventListener("click", () => {
    Utils.hideElements([Selectors.headerMenu, Selectors.closeBurguerMenu])
    Utils.showElements([Selectors.openBurguerMenu])
})

$(Selectors.hideFilters).addEventListener("click", () => {
    $(Selectors.filtersContainer).classList.toggle("hidden")
    $(Selectors.heightFiltersBox).classList.toggle("lg:h-[100px]")
})

$(Selectors.btnAddJob).addEventListener("click", () => {
    Utils.hideElements([Selectors.sectionFilters, Selectors.sectionJobsContainer, Selectors.banner, Selectors.sectionDetailsJob, Selectors.headerMenu, Selectors.closeBurguerMenu])
    Utils.showElements([Selectors.sectionJobForm, Selectors.openBurguerMenu])
    isSubmit = true
    Utils.setFocus(Selectors.inputArea)
})

$(Selectors.addJobForm).addEventListener("submit", (e) => {
    e.preventDefault()
    if (Functions.validateForm()) {
        if (isSubmit) {        
            Functions.openCreatedJobModal()
            Method.registerJob()
        } else {
            Functions.editedJobModal()
            const jobId = $(Selectors.btnEditJob).getAttribute("data-id")
            Method.editJob(jobId)
        }
        $(Selectors.addJobForm).reset()
    } else {
        Utils.scrollTop()
    }
})

$(Selectors.inputSalary).addEventListener("input", (e) => {
    const salaryValue = e.target.valueAsNumber
    if (isNaN(salaryValue)) {
        $(Selectors.inputSalary).value = ""
    }
})

$(Selectors.btnDeleteJob).addEventListener("click", () => {
    Utils.removingBlur([Selectors.header, Selectors.main, Selectors.footer])
    const jobId = $(Selectors.btnDeleteJob).getAttribute("data-id")
    Method.deleteJob(jobId)
})

$(Selectors.cancelDeleteJob).addEventListener("click", () => {
    Utils.removingBlur([Selectors.header, Selectors.main, Selectors.footer])
    Utils.hideElements([Selectors.openModalDeleteJob])
})

$(Selectors.selectFilterCategory).addEventListener("change", () => {
    Utils.cleanContainer(Selectors.selectFilterOption)
    let selectedCategory = $(Selectors.selectFilterCategory).value
    let options = filters[selectedCategory]
    $(Selectors.selectFilterOption).innerHTML += `
        <option value="">Select an option</option>
    `  
    for (const option of options) {
        $(Selectors.selectFilterOption).innerHTML += `
            <option value="${option}">${option}</option>
        `        
    }
})

$(Selectors.selectFilterOption).addEventListener("change", () => {
    let option = $(Selectors.selectFilterOption).value
    let selectedCategory = $(Selectors.selectFilterCategory).value
    if (selectedCategory == "area") {
        const result = filterJobs.filter(job => job.job.area == option)
        Render.renderJobs(result)
        return
    }

    if (selectedCategory == "position") {
        const result = filterJobs.filter(job => job.job.position == option)
        Render.renderJobs(result)
        return
    }  

    if (selectedCategory == "gameName") {
        const result = filterJobs.filter(job => job.gameInfo.gameName == option)
        Render.renderJobs(result)
        return
    }

    if (selectedCategory == "modality") {
        const result = filterJobs.filter(job => job.modality == option)
        Render.renderJobs(result)
        return
    }

    if (selectedCategory == "officeLocation") {
        const result = filterJobs.filter(job => job.officeLocation == option)
        Render.renderJobs(result)
        return
    }

    if (selectedCategory == "workload") {
        const result = filterJobs.filter(job => job.workload == option)
        Render.renderJobs(result)
        return
    }
})

$(Selectors.btnClearFilters).addEventListener("click", () => {
    $(Selectors.selectFilterCategory).value = ""
    $(Selectors.selectFilterOption).value = ""
    Utils.cleanContainer(Selectors.selectFilterOption)
    Method.getJobs()
})

window.addEventListener("load", () => {
    Method.getJobs()
})