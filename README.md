# Keyboard navigation

![npm version](https://img.shields.io/npm/v/@zeroconf/keyboard-navigation)
[![CircleCI](https://circleci.com/gh/zeroconf-dev/keyboard-navigation/tree/master.svg?style=svg)](https://circleci.com/gh/zeroconf-dev/keyboard-navigation/tree/master)

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
