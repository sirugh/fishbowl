#I made a game. Here's what I learned in 2 weeks.

<SLIDE>
There's a game called Fishbowl that my friends and I play when we get together that involes mechanics from the trivia games Taboo, Password and Charades.

Basically, it's team based and involves players getting their team to guess a word without saying the word.

<SLIDE>
But when making something like this...

* How/when should you make decisions regarding architecture/design?
* How do you turn it into a phone app?
* Once it's a phone app, how do you optimize it?

These are the things I learned in about two weeks of working on this in my spare time.

# Architecture/Design Choices

## Client-Server vs Static Client

Originally, the application was to be run from multiple clients (phones) that would each connect via socket.io to a room hosted by my "server". The server would be the source of truth for score, timing, active client -- non-presentation layer stuff. That worked great in local testing until I hosted the server on heroku and tried playing. I found out that relying on precise timings (you have **exactly** 30 seconds to score!) is not a simple task when working with an unreliable connection/latency.

<FRAGMENT>
I even tried to solve this problem by periodically determining the latency between the client and server.

That was fun, but in the end I decided to refactor the server out, making the app entirely client based.

## Using Apache Cordova

I learned about Cordova at an austinjs talk last year and have been wanting to use it to build something. Cordova is a framework that lets you wrap a web app and deploy it on the various mobile platforms using native web browsers. If you are a web developer and want to make something for the app/play store, well I can't say enough about Cordova. I wrote some grunt tasks and now in one command `grunt build-cordova-release` I have an .apk I can install to my phone or deploy to the Play Store.

If you are interested in Cordova, reach out to me and I can help you get started!

### Rearchitecting for Mobile

Once I had an application that I could test using the native android webview, I found that my app was burning through battery. The following list are things you should definitely be aware of when developing on mobile where you don't have the relatively limitless resources of a desktop:

<DOWN>
+ DONT query/update DOM every 10 milliseconds
+ DO minimize number of DOM queries
    * or just reduce overhead by 100x by querying every second instead of every 100th

+ DONT have your view re-render on ALL model changes
+ DO re-render as little as possible
    * by using granular event definitions or even a cool framework like React that has better control over component rendering)

+ DONT using jquery animations on mobile
+ DO use css transitions or mobile optimized jquery replacement - zepto.js
    * jquery animations use javascript (setInterval); css transitions are hardware accelerated and use the GPU

#Main Takeaways

##1. Pick a project *you* want.

You probably already knew this, but I just have to say it again -- It's so much more enjoyable to work on a project that you find interesting and have real ties to. Even if this game flops on the app store, it won't matter because I've made it easier to play this game with my group of friends.

##2. Architect (loosely) before you start.

Spend a little time architecting your app. Think about things like latency and timing if your clients can act asynchronously. Be cognizent of things like battery usage and performance.

##3. Design (loosely) before you start.

It's really important to have SOME sort of vision for UX/UI but not necessary for it to be entirely fine tuned.

Don't do anything your users aren't expecting without sufficiently explaining it with either a help page or context clues. (skip word == lose points?)

##4. Have a goal for MVP and try to reach it without exhausting yourself.

When you work on a personal project it's important to limit the amount of work you do to a minimum viable product. This prevents you from working on a feature that may be wholly unused or undesired by your users. I decided early on that my MVP would be a 'decent looking', usable product that my friends and I could use. Once released, I'll wait for feedback to make further decisions.

##5. Get user feedback early and often.

My girlfriend was great QA for me. After working on the game all night I'd show it to her and say "Hey, check out the game *now*!" And she would look at it and go "why doesn't it do this?"... and then go back to reading her book.

Through this experience I learned the importance of getting user input early on. You may think that a button should act a certain way, or that some piece of UI is sufficient to clue in a user to an action, but that's because you are a biased developer and not an end user. Try to think about ways a user will want to interact with your application.

<DEMO>