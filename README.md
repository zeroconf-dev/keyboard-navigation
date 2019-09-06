# TabNavigation.ts

[![npm version](https://badge.fury.io/js/%40zeroconf%2Fkeyboard-navigation.svg)](https://badge.fury.io/js/%40zeroconf%2Fkeyboard-navigation)
[![Build Status](https://travis-ci.org/zeroconf/keyboard-navigation.svg?branch=master)](https://travis-ci.org/zeroconf/keyboard-navigation)
[![Coverage Status](https://coveralls.io/repos/github/zeroconf/keyboard-navigation/badge.svg?branch=master)](https://coveralls.io/github/zeroconf/keyboard-navigation?branch=master)

This library ships with an implementation that works with react, but it is not limited to react. Maybe later the react
part will be moved to separate library.

[Read the docs](https://zeroconf.dev/keyboard-navigation)

## Getting started

First add the keyboard-navigation to your project

```shell
npm install @zeroconf/keyboard-navigation
```

or

```shell
yarn add @zeroconf/keyboard-navigation
```

```html
<html>
<head>
    <script type="application/javascript" src="//unpkg.com/@zeroconf/keyboard-navigation/blob/latest/dist/umd.js">
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
