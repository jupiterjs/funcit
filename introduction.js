Func it

What is Func it?

FuncIt is a (best) way to test your apps and sites. It provides you with a GUI that allows you to "write" tests by clicking around your product/app/site. That allows you to visally comprehend states of the app and to throughly test each one of them.

How to use it?

Funcit should be used as a bookmarklet. You drag it to your bookmarks panel on your browser [insert screenshots of browsers and instructions for each and any of them] and when you are at a page that you want to test you call it. You will be provided with split screen where upper area holds your app and lower Funcit. After that you click on any of commands in left side of screen and interact with your app. You will notice that as you click on DOM elements in your app, code is written in lower right part of the screen.

Commands, actions, assert, waits, getters, wait what?

When you look on left side of the Funcit IDE you'll notice 3 columns. Actions, assert and Waits/getters. Each one of these allows has different actions related to them and we'll explain them here:

Actions

Actions are things that are related to your whole app. You can [open] new page, record mouse [move]ment, [trigger] event on any of the DOM elemnts or record [scroll]ing of elements in your app. Most of the time you'll use them to "prepare the stage" for your tests.

Assert

Asserts allow you to test the "truthiness" of "claims". Most of the time they work in combination with a [getter]. You can test any value that getter returns with assert.

Waits

Waits are functions that will wait an amount of time before calling a callback function.

Getters

Getters allow you to check any of the DOM element attributes. They will return true or false based on element's current state. This allows you to test DOM element's state in [assert]. 