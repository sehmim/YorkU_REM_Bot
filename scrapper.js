const puppeteer = require('puppeteer');

const BASE_URL = "https://wrem.sis.yorku.ca/Apps/WebObjects/REM.woa/wa/DirectAction/rem"

scrapper = {
    browser: null,
    page: null,

    initialize: async () => {
        scrapper.browser = await puppeteer.launch({ headless: false });
        scrapper.page = await scrapper.browser.newPage();

        await scrapper.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    },

    login: async (username, password) => {

        await scrapper.page.waitFor(500)

        await scrapper.page.type("input[name='mli']", username, { delay: 100 })

        await scrapper.page.waitFor(500)

        await scrapper.page.type("input[name='password']", password, { delay: 100 })

        await scrapper.page.click("input[name='dologin']", { delay: 100 })

        await scrapper.page.waitForNavigation({
            waitUntil: 'networkidle0',
        });

        // Select Summer Term
        await scrapper.page.select("select", process.env.ACADEMIC_SECTION)

        // Press Continue
        await scrapper.page.click("input[name='5.5.1.27.1.13']", { delay: 2000 })
    },

    selectCourse: async (course) => {
        // Click on Add Course button 
        await scrapper.page.click("input[name='5.1.27.1.23']", { delay: 3000 })

        // Fill in text area
        await scrapper.page.type("input[name='5.1.27.7.7']", course, { delay: 3000 })
        // await scrapper.page.$eval("input[name='5.1.27.7.7']", el => el.value = course);

        // press Add course
        await scrapper.page.click("input[name='5.1.27.7.9']", { delay: 2300 })

        // press yes
        await scrapper.page.click("input[value='Yes']", { delay: 3000 })

        // find table where it says result
        const result = await scrapper.page.evaluate(() => {
            return document.getElementsByTagName("td")[25].innerText
        })

        // wait 
        await scrapper.page.waitFor(500)

        // Click continue 
        await scrapper.page.click("input[value='Continue']", { delay: 3000 })

        // return if it says "The course has not been added." || "The course has been added."
        return result;
    }
}

module.exports = scrapper;


