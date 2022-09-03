# PeerToCP

This is supposed to be a front-end for my final project... But as life goes on I don't think I can finish this in 2 months. Lol. :joy:

This was built using:

- yjs (y-codemirror.next, y-webrtc, y-websocket)
- Webpack

This code is patched here and there from several sources, but was mainly based on [Monaco Demo from yjs](https://github.com/yjs/yjs-demos/tree/main/monaco).

## How To Run

### Prerequisites

- Node (16.x.x)
- y-webrtc server (go run `npm start` on this repo for easy webrtc server https://github.com/yjs/y-webrtc)

### Run Mantra

```bash
npm install
npm run dist # generate dist (webpack based, because why use a heavy webserver lol)
npm start # serve it
```

## Good To Know

`/dist` means "distributable", the compiled code/library.

Folder structure varies by build system and programming language. Here are some standard conventions:

- `src/`: "source" files to build and develop the project. This is where the original source files are located, before being compiled into fewer files to `dist/`, `public/` or `build/`.

- `dist/`: "distribution", the compiled code/library, also named `public/` or `build/`. The files meant for production or public use are usually located here.

  There may be a slight difference between these three:

  - `build/`: is a compiled version of your `src/` but not a production-ready.
  - `dist/`: is a production-ready compiled version of your code.
  - `public/`: usually used as the files runs on the browser. which it may be the server-side JS and also include some HTML and CSS.

- `assets/`: static content like images, video, audio, fonts etc.

- `lib/`: external dependencies (when included directly).

- `test/`: the project's tests scripts, mocks, etc.

- `node_modules/`: includes libraries and dependencies for JS packages, used by Npm.

- `vendor/`: includes libraries and dependencies for PHP packages, used by Composer.

- `bin/`: files that get added to your PATH when installed.

Markdown/Text Files:

- `README.md`: A help file which addresses setup, tutorials, and documents the project. `README.txt` is also used.
- `LICENSE.md`: any [rights](https://choosealicense.com/no-permission/) given to you regarding the project. `LICENSE` or `LICENSE.txt` are variations of the license file name, having the same contents.
- `CONTRIBUTING.md`: how to [help out](https://github.com/blog/1184-contributing-guidelines) with the project. Sometimes this is addressed in the `README.md` file.

Specific (these could go on forever):

- `package.json`: defines libraries and dependencies for JS packages, used by Npm.
- `package-lock.json`: specific version lock for dependencies installed from `package.json`, used by Npm.
- `composer.json`: defines libraries and dependencies for PHP packages, used by Composer.
- `composer.lock`: specific version lock for dependencies installed from `composer.json`, used by Composer.
- `gulpfile.js`: used to define functions and tasks to be run with Gulp.
- `.travis.yml`: config file for the [Travis CI](https://travis-ci.com/) environment.
- `.gitignore`: Specification of the files meant [to be ignored](https://help.github.com/articles/ignoring-files/) by Git.

Sources:

- [What is the meaning of the /dist directory in open source projects?](https://stackoverflow.com/questions/22842691/what-is-the-meaning-of-the-dist-directory-in-open-source-projects)