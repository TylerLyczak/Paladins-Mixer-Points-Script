/*
    Tyler Lyczak
    5/14/20

Values for all the HTML elements that the script uses, Reference

sigin button -                      class="mdsButton_Kaw7D contained_2JbA5 signInButton_3fCKe"
microsoft button -                  class="mdsButton_Kaw7D showFocus_2wbiS signInBtn_1WMJ-"
microsoft email input -             type="email"
microsoft input button -            type="submit"
microsoft password input -          type="password"
microsoft signin button -           type="submit"
    wait    -                       value="Sign in"
div of all Paladins games -         class="contentGridGroup_1iaee"
div for the first Paladin game -    class="container_ZqIuE cardStyle_8PoHy"

*/

const puppeteer = require('puppeteer');

(async () => {

    // Get the username and password for STDIN
    var cliArgs = process.argv.slice(2);
    
    if (cliArgs.length == 0)   {
        console.log('Please enter Microsoft email and Microsoft password');
        process.exit(1);
    }
    else if (cliArgs.length == 1) {
        console.log('Please enter Microsoft password');
        process.exit(1);
    }
    const email_address = cliArgs[0];
    const password = cliArgs[1];

    // Makes the browser for puppeteer to run on
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
    });

    // Makes a page to load the mixer screen
    const page = await browser.newPage();

    // Makes a cookie to view mature streams
    const cookie = {
        'name': '_sde_allowedInSession',
        'value': '1',
        'domain': 'mixer.com',
        'path': '/',
        'Expires / Max-Age': 'Session',
        'size': '22',
        'priority': 'Medium',
    };

    await page.setCookie(cookie);

    await page.setRequestInterception(true);
    page.on('request', request => {
        request.continue();
    });

    // Goes to the mixer page
    await page.goto('https://mixer.com/',)
        .catch((e) => {console.log(e)});
    page.on('load', () => console.log('=====Page loaded!====='));

    // Click on the sign-in button
    await page.waitForSelector('[class="mdsButton_Kaw7D contained_2JbA5 signInButton_3fCKe"]');
    await page.click ('[class="mdsButton_Kaw7D contained_2JbA5 signInButton_3fCKe"]');

    // Click on the sign-in with microsoft button
    await page.waitForSelector('[class="mdsButton_Kaw7D showFocus_2wbiS signInBtn_1WMJ-"]');
    const newPagePromise = new Promise(x => page.once('popup', x));
    await page.click ('[class="mdsButton_Kaw7D showFocus_2wbiS signInBtn_1WMJ-"]');

    // Pop-up window opens
    const newPage = await newPagePromise;

    // Enter email address into field
    await newPage.waitForSelector('[type="email"]');
    await newPage.$eval('input[type="email"]', (el, value) => el.value = value, email_address);

    // Click the submit button
    await newPage.click('input[type="submit"]');

    // Type in the password
    await newPage.waitForSelector('[value="Sign in"]');
    await newPage.$eval('input[type="password"]', (el, value) => el.value = value, password);

    // Click the signin button
    await newPage.click('input[type="submit"]');

    // Now we are signed-in, go to the paladins stream
    await page.goto('https://mixer.com/browse/categories/1386',)
        .catch((e) => {console.log(e)});

    // Load the page of all Paladin games
    await page.waitForSelector('[class="contentGridGroup_1iaee"]');

    // Click on the first page on the streams list
    await page.click('[class="container_ZqIuE cardStyle_8PoHy"]');

    // Interval function to keep refreshing every 10 minutes
    setInterval( async () => {
        // Now we are signed-in, go to the paladins stream
        await page.goto('https://mixer.com/browse/categories/1386',)
            .catch((e) => {console.log(e)});

        // Load the page of all Paladin games
        await page.waitForSelector('[class="contentGridGroup_1iaee"]');

        // Click on the first page on the streams list
        await page.click('[class="container_ZqIuE cardStyle_8PoHy"]');
    }, 600000);
    
})();