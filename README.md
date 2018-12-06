# TabNavigation.ts

[![npm version](https://badge.fury.io/js/%40secoya%2Ftab-navigation.ts.svg)](https://badge.fury.io/js/%40secoya%2Ftab-navigation.ts)
[![Build Status](https://travis-ci.org/thetrompf/tab-navigation.ts.svg?branch=master)](https://travis-ci.org/thetrompf/tab-navigation.ts)

This library ships with an implementation that works with react, but it is not limited to react. Maybe later the react
part will be moved to separate library.

[Read the docs](https://thetrompf.github.io/tab-navigation.ts)

## Getting started

First add the tab-navigation.ts to your project

```shell
npm install @secoya/tab-navigation.ts
```
or
```shell
yarn add @secoya/tab-navigation.ts
```

```html
<html>
<head>
    <script type="application/javascript" src="//github.com/thetrompf/tab-navigation.ts/blob/latest/dist/umd.js">
</head>
<body>

    <form>
        <p>
            <label for="first-name">First name</label>
            <input type="text" name="first-name" />
        </p>
        <p>
            <label for="last-name">Last name</label>
            <input type="text" name="last-name" />
        </p>
        <p>
            <label for="email">Email</label>
            <input type="email" name="email" />
        </p>
        <p>
            <label for="password">Password</label>
            <input type="password" name="password" />
        </p>
        <p>
            <label for="password">Password</label>
            <input type="password" name="password" />
        </p>
    <form>

</body>
</html>
```

