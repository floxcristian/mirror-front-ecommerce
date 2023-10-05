<h1 align="center">Frontend Ecommerce</h1>

<div align="center">
  :steam_locomotive::train::train::train::train::train:
</div>
<div align="center">
  <strong>Ecommerce Implementos S.A.</strong>
</div>
<div align="center">
  Frontend para el sistema de Ecommerce de Implementos S.A.
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/v/choo.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/choojs/choo">
    <img src="https://img.shields.io/travis/choojs/choo/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://codecov.io/github/choojs/choo">
    <img src="https://img.shields.io/codecov/c/github/choojs/choo/master.svg?style=flat-square" 
      alt="Test Coverage" />
  </a>
  <!-- Chat -->
  <a href="https://gitter.im/array-mixer/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
    <img src="https://badges.gitter.im/array-mixer/Lobby.svg" 
      alt ="Gitter">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
  </a>
  <!-- License -->
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" 
      alt="MIT">
  </a>
</div>

<div align="center">
  <h3>
  <a href="impcomisiones.implementos.cl">
      Website
    </a>
    <span> | </span>
    <a href="#">
      Frontend
    </a>
    <span> | </span>
    <a href="#">
      Manual de Usuario
    </a>
    <span> | </span>
    <a href="https://github.com/choojs/choo/blob/master/.github/CONTRIBUTING.md">
      Contributing
    </a>
    <span> | </span>
    <a href="#">
      Chat
    </a>
  </h3>
</div>

<div align="center">
  <sub>Sistema para ventas electrónicas de Implementos Chile e Implementos Perú. Desarrollado con ❤︎ por
  <a href="https://twitter.com/yoshuawuyts">Cristian Flores</a> y
  <a href="https://github.com/choojs/choo/graphs/contributors">
    Colaboradores
  </a>
  .
</div>

## Tabla de Contenidos

- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Build Process](#build-process)
- [Backers](#backers-)
- [Sponsors](#sponsors-)
- [Acknowledgments](#acknowledgments)

## Resumen

Esta es una app web construída en Angular, que se conecta con distintas APIs ya estandarizadas para su uso en **Implementos Chile** e **Implementos Perú**.


## 📦 Requerimientos e Instalación
Instalar dependencias:

```
npm install
```
Levantar app web localmente para desarrollo:
```
npm start
```
Compilar app para producción incluyendo Server Side Rendering:
```
npm run build:ssr
```
Probar funcionamiento de compilación localmente:
```
npm run serve:ssr
```

## 🎨 Dependencias

| Package           | Feature                  | Sumary                                                                                                                                                                                                                                            |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bcrypt-nodejs     | --                       | Used to hash user's password before saving it into the DB.                                                                                                                                                                                        |
| colors            | --                       | --                                                                                                                                                                                                                                                |
| cors              | --                       | --                                                                                                                                                                                                                                                |
| express-validator | API parameter validation | Validate body, params, query, headers and cookies of a request (via middleware) and return a response with errors; if any of the configured validation rules fail. You won't anymore need to make your route handler dirty with such validations. |
| jsonwebtoken      | Authentication           | Used to generate and verify authentication tokens.                                                                                                                                                                                                |
| moment            | --                       | --                                                                                                                                                                                                                                                |
| nodemon           | Auto server restart      | Restart the server in real-time anytime an edit is made.                                                                                                                                                                                          |
| pg                | --                       | --                                                                                                                                                                                                                                                |
| socket&#46;io     | --                       | --                                                                                                                                                                                                                                                |
| --                | Code linting             | --                                                                                                                                                                                                                                                |
| uuid              | --                       | --                                                                                                                                                                                                                                                |

| VSCode Extension | Description                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| .editorconfig    | It helps developers define and maintain consistent coding styles between different editors and IDEs. |

## 🎨 Linters y Formatters

| Package                                                                                    | Description                                                                                                                                                     |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eslint                                                                                     | Linter para código JS. Permite la compatibilidad de Typescrip con ESLint.                                                                                       |
| eslint-config-prettier                                                                     | It helps developers define and maintain consistent coding styles between different editors and IDEs.                                                            |
| eslint-plugin-import                                                                       | It helps developers define and maintain consistent coding styles between different editors and IDEs.                                                            |
| [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint)        | Parseador de ESLint.                                                                                                                                            |
| [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) | Complemento específico de ESLint que, cuando se usa junto con `@typescript-eslint/parser`, permite que se ejecuten reglas de linting específicas de TypeScript. |

## 📙 Documentación

- [RuviClass API Doc](#) - Documentación API REST Comisiones.

## 💬 FAQ

### Why is it called RuviClass?

Because I thought it sounded cute. All these programs talk about being _"performant"_, _"rigid"_, _"robust"_ -
I like programming to be light, fun and non-scary. Choo embraces that.

## 📚 See Also

- [RuviClass Client](https://github.com/choojs/bankai) - RuviClass Client repository.
- [FlavioCopes Blog](https://flaviocopes.com/) - Node.js, Express.js, REST API Backend by Postgres and much
  more.
- [CharlieTheProgrammer](https://charlietheprogrammer.com/) - Updated Node.js tutorials.
- [Spanish Express.js Guide](http://expressjs.com/es/guide) - Official Guide.
- [Node University](https://node.university/courses) - Premium Beginner/Advanced Courses.
- [Node Express Boilerplate](https://github.com/kunalkapadia/express-mongoose-es6-rest-api) - Express.js
  Boilerplate.
- [Node Best Practices](https://github.com/i0natan/nodebestpractices)

## 🤝 Contributing

We love contributions! Check out the
[Contribution Guide](https://github.com/sourcerer-io/sourcerer-app/blob/master/CONTRIBUTING.md) for more
information.




## 🎓 License

Usage is provided under the [MIT©](https://tldrlegal.com/license/mit-license) License.
