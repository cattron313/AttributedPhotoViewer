# Slack Coding Challenge

For this challenge, I will be implementing a photo viewer in a grid layout. To enlarge each image, I will create my own UI similar to [Lightbox][http://lokeshdhakar.com/projects/lightbox2/].

### Program Setup
Start the program in 3 simple steps!
1.    Run ```npm install```.
2.		Run ```npm run build```.
3.    Run ```npm start```.
4.    Visit http://localhost:8080.
    *(8080 should be default port but check terminal in case it's different on your machine)*

To run tests run ```npm test``` in the root of your project.

### Approach to Testing
My approach to testing revolves around:
* testing what the core functionality that needs to be delivered (aka what functionality is in the stories or specs)
* gaining an understanding from product (or the rest of the team) what things would be a catastrophe if it broke
* testing the features are difficult to debug
    * For example, I probably wouldn't test whether the top-level component is appended to the DOM since that will be pretty easy to identify.

### Code Organization

### Performance
I spent some time thinking about the placeholder image and what format I wanted to store the image in. A placeholder image must render very fast otherwise, it loses its purpose and value. I was debating between base64 and a png. I eventually decided on png after a few comparisons loading a page with each. Png was slightly faster (I think because the size of html was pretty large with 20 base64 images in there) and had the added bonus of allowing an easier to read index.html file. I also compressed the png with [ImageOptim][https://imageoptim.com/] to optimize for a faster download.

### What I Would Do Differently
