# Slack Coding Challenge

For this challenge, I will be implementing a photo viewer in a grid layout. To enlarge each image, I will create my own UI similar to [Lightbox][http://lokeshdhakar.com/projects/lightbox2/]. I decided to create a photo viewer of Unsplash's currated list of photos with attribution to the photographers who took these photos.

### Program Setup
Start the program in 3 simple steps!
1.    Run ```npm install```.
2.    Run ```npm start```.
3.    Visit http://localhost:8080.
    *(8080 should be default port but check terminal in case it's different on your machine)*

To run tests run ```npm test``` in the root of your project.

### Code Organization
I decided to keep this app very simple (based on the instructions) and not use any build processes. Separate files are loaded into the global object. I namespaced those object instances to avoid collisions. If I were using tools like webpack, I could avoid this.

I loaded as much content initially in index.html so that the user would see content as soon as possible.

I separated most of the app functionality into two parts: app.js and view-manager.js. Since most of the view content is already loaded in the html. ViewManager just manipulates the DOM to show and hide necessary items. App makes API calls for images and sets up the event handlers.

### Performance
I spent some time thinking about the placeholder image and what format I wanted to store the image in. A placeholder image must render very fast otherwise, it loses its purpose and value. I was debating between base64 and a png. I eventually decided on png after a few comparisons loading a page with each. Png was slightly faster (I think because the size of html was pretty large with 20 base64 images in there) and had the added bonus of allowing an easier to read index.html file. I also compressed the png with [ImageOptim][https://imageoptim.com/] to optimize for a faster download.

On mobile, I opted to use smaller sized images so they would load faster but kept most of the other functionality the same.

I tested out how loading a base64  background img instead of a hosted img. On a slow network, it took a lot longer to get anything render in the browser with base64 so I opted for a hosted background img.

### What I Would Do Differently

I didn't get an opportunity to write tests. I ran out of time. I was having trouble getting the test environment working since I decided to go for a much simpler setup. I usually use webpack and karma to load all the tests and enviornments but ran into trouble trying to get them to load without babel. I did manually test the code pretty thouroughly on different browsers, devices, and different states (like slow network, error states, etc.).

I would have also spent time writing tests first since I ran into some pretty insidious bugs. Normally, my approach to testing revolves around:
* testing what the core functionality that needs to be delivered (aka what functionality is in the stories or specs)
* gaining an understanding from product (or the rest of the team) what things would be a catastrophe if it broke
* testing the features are difficult to debug
    * For example, I probably wouldn't test whether the top-level component is appended to the DOM since that will be pretty easy to identify.
