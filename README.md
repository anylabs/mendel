# Mendel

[![Build Status](https://secure.travis-ci.org/progressivelabs/mendel.svg?branch=master)](http://travis-ci.org/progressivelabs/mendel)
[![npm](https://img.shields.io/npm/v/@progressivelabs/mendel.svg)](https://www.npmjs.com/package/progressivelabs/mendel)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![license](https://img.shields.io/github/license/progressivelabs/mendel.svg)](https://github.com/progressivelabs/mendel/blob/master/LICENSE)

Simple Postgres migrations for Node.

## Install

```sh
$ npm install @progressivelabs/mendel
```

## Usage

Add the following snippet to your NPM scripts:

```json
{
  "migrations": "mendel"
}
```

Execute migrations using:

```sh
npm run migrations
```

## Support

Mendel is free software.  If you encounter a bug with the library please open an
issue on the [github repo](https://github.com/progressivelabs/mendel). If you
have questions unanswered by the documentation please open an issue pointing out
how the documentation was unclear & we will do our best to make it better!

When you open an issue please provide:
- version of node
- version of postgres
- smallest possible snippet of code to reproduce the problem

## License

Copyright (c) 2010-2017 Progressive Labs (contact@progressivelabs.co)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
