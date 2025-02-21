import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import playSound from 'play-sound';

puppeteer.use(StealthPlugin());

const userDataDir = 'C:/Users/donba/AppData/Local/Google/Chrome/User Data/Profile 1';

const openAmazonPage = async () => {
    const browser = await puppeteer.launch({ 
        userDataDir
    });

    const page = await browser.newPage();
    await page.goto('https://hiring.amazon.ca/app#/jobSearch', { waitUntil: 'networkidle2' });

    console.log("Amazon Hiring page opened!");

    // Function to handle interactions
    const interactWithPage = async () => {
        try {
            // Click the "I Consent" button
            await page.waitForSelector('button[data-test-id="consentBtn"]', { visible: true, timeout: 5000 });
            await page.click('button[data-test-id="consentBtn"]');
            console.log('Clicked "I Consent" button.');
        } catch (error) {
            console.log('No "I Consent" button found or it took too long to appear.');
        }

        // await page.screenshot({ path: 'after-consent.png' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

        // Click the "Close Guided Search" button
        try {
            await page.waitForSelector('div.guidedSearchCloseButton', { visible: true, timeout: 5000 });
            await page.click('div.guidedSearchCloseButton');
            console.log('Clicked "Close Guided Search" button.');
        } catch (error) {
            console.log('No "Close Guided Search" button found or it took too long to appear.');
        }

        // await page.screenshot({ path: 'after-guided-search.png' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

        // Click the "Add filter" button
        try {
            await page.waitForSelector('button[data-test-id="openFiltersButton"]', { visible: true, timeout: 5000 });
            await page.click('button[data-test-id="openFiltersButton"]');
            console.log('Clicked "Add filter" button.');
        } catch (error) {
            console.log('No "Add filter" button found or it took too long to appear.');
        }

        // await page.screenshot({ path: 'after-add-filter.png' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

        // Enter "London, ON, CAN" in the postal code input field
        try {
            const inputSelector = 'input#zipcode-nav-filter';
            await page.waitForSelector(inputSelector, { visible: true, timeout: 5000 });
            await page.type(inputSelector, 'London, ON, CAN', { delay: 100 });
            console.log('Entered "London, ON, CAN" in the postal code field.');
        } catch (error) {
            console.log('Postal code input field not found or took too long to appear.');
        }

        // await page.screenshot({ path: 'after-entering-postal-code.png' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay

        try {
            const showResultsButton = 'button#filterPanelShowFiltersButton';
            await page.waitForSelector(showResultsButton, { visible: true, timeout: 5000 });
        
            // Get the text content of the button
            const buttonText = await page.evaluate(selector => {
                return document.querySelector(selector)?.innerText.trim() || 'Button not found';
            }, showResultsButton);
        
            console.log(`Button text: "${buttonText}"`);
        
            // Check if the text is NOT "Show 0 result"
            if (buttonText !== "Show 0 result") {
                playSound().play('./alert.mp3');
                console.log("Job Found");
            }
        
        } catch (error) {
            console.log('Show result button not found or took too long to appear.');
        }
        
        

        // await page.screenshot({ path: 'after-show-results.png' });
    };

    await interactWithPage();

    setInterval(async () => {
        console.log('Refreshing the page...');
        await page.reload({ waitUntil: 'networkidle2' });
        console.log('Page refreshed!');
        await interactWithPage(); // Re-run interactions after refresh
    }, 10000);
};

openAmazonPage();