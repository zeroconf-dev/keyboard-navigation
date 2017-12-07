# <FormTabNavigation />

This library ships with an implementation that works with react, but it is not limited too react. Maybe later the react
part will be moved to separate library.

## Table of contents

* [Getting Starterd](#getting-started)
* [Examples](#examples)
  * [Simple Example](#simple-example)
  * [Advanced Example](#advanved-example)
* [Extending Boundries](#extending-boundries)
* [Usage With TypeScript](#usage-with-typescript)

## Getting Started

First add the tab-navigation.ts to your project

```shell
npm install @secoya/tab-navigation.ts
```

```html
<html>
<head>
    <script type="application/javascript" src="//github.com/secoya/tab-navigation.ts/blob/latest/dist/umd.js">
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
            <label for="password">Passowrd</label>
            <input type="password" name="password" />
        </p>
        <p>
            <label for="password">Passowrd</label>
            <input type="password" name="password" />
        </p>
    <form>

</body>
</html>
```

```js
import { TabRegistry } from '@secoya/tab-navigation.ts';
```

## Examples

### Simple Example

### Advanced Example

## Extending Boundries

## Usage With Typescript
