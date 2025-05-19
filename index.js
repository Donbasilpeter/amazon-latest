import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import playSound from 'play-sound';

puppeteer.use(StealthPlugin());
let userDataDir = 'C:/Users/donba/AppData/Local/Google/Chrome/User Data/Profile 5';

function getRandomNumber() {
    return Math.floor(Math.random() * 4001) + 2000;
}

const openAmazonPage = async () => {

    const browser = await puppeteer.launch({
        headless: false,

        userDataDir
    });


    const page = await browser.newPage();
    await page.goto('https://hiring.amazon.ca/app#/jobSearch', { waitUntil: 'networkidle2' });

    console.log("Amazon Hiring page opened!");

    // Function to handle interactions
    const interactWithPage = async () => {
        try {
            // Click the "I Consent" button
            await page.waitForSelector('button[data-test-id="consentBtn"]', { visible: true, timeout: 200 });
            await page.click('button[data-test-id="consentBtn"]');
            console.log('Clicked "I Consent" button.');
        } catch (error) {
            console.log('No "I Consent" button found or it took too long to appear.');
        }

        // Click the "Close Guided Search" button
        try {
            await page.waitForSelector('div.guidedSearchCloseButton', { visible: true, timeout: 200 });
            await page.click('div.guidedSearchCloseButton');
            console.log('Clicked "Close Guided Search" button.');
        } catch (error) {
            console.log('No "Close Guided Search" button found or it took too long to appear.');
        }
        try {

            while (true) {
                // Try clicking "Expand your search" if it appears
                try {
                    const expandLink = await page.$('a[data-test-id="expand-your-search-link"]');
                    if (expandLink) {
                        console.log('Clicking "Expand your search"...');
                        await expandLink.click();
                        console.log('Page refreshed after clicking "Expand your search".');
                    }
                } catch (err) {
                    console.log('Error clicking "Expand your search":', err.message);
                }
            
                // Wait a bit before checking for job availability
                await page.waitForTimeout(getRandomNumber());
            
                let pageText = await page.evaluate(() => document.body.innerText);
                
                if (!pageText.includes("Sorry, there are no jobs available that match your search.")) {
                    playSound().play('./alert.mp3');
                    console.log('✅ Job available!');
                    break
                } else {
                    console.log("❌ No jobs found.");
                }
            }

        } catch (error) {
            console.log("Error checking for 'No jobs' message:", error);
        }
    };

    await interactWithPage();




};

openAmazonPage();
