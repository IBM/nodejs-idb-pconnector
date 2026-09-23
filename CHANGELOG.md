# idb-pconnector change log

# 1.2.0

- build: Support Node.js >= 20

# 1.1.2

- build(deps): bump json5 from 1.0.1 to 1.0.2 in #134
- chore: fix copyright headers in #140
- build(deps): bump semver from 6.3.0 to 6.3.1 in #136
- build(deps-dev): bump word-wrap from 1.2.3 to 1.2.5 in #141
- ci: update release process in #139
- build: update release-it to 0.17.5 in #142
- build(deps): bump tar from 6.1.13 to 6.2.1  in #143
- build(deps-dev): bump braces from 3.0.2 to 3.0.3 in #144
- build(deps): bump serialize-javascript and mocha in #145
- build(deps): bump basic-ftp from 5.0.4 to 5.2.2 in #152
- build(deps): bump lodash, @release-it/conventional-changelog and release-it in #151
- build(deps-dev): bump handlebars from 4.7.8 to 4.7.9 in #150
- build(deps): bump brace-expansion from 1.1.11 to 1.1.14 in #149
- build(deps): bump minimatch from 3.1.2 to 3.1.5 in #155
- build(deps-dev): bump flatted from 3.2.7 to 3.4.2 in #154
- build(deps): bump picomatch from 2.3.1 to 2.3.2 in #153
- build(deps-dev): bump js-yaml from 4.1.0 to 4.3.0 in #160
- build(deps): bump ip-address from 10.1.0 to 10.2.0 in #156
- build(deps-dev): bump js-yaml from 4.3.0 to 4.3.2 in #164
- build(deps): bump brace-expansion from 1.1.14 to 1.1.18 in #165
- build(deps): bump ip-address from 10.2.0 to 10.7.0 in #166
- build(deps): bump undici, @release-it/conventional-changelog and release-it in #161
- build(deps): bump serialize-javascript and mocha in #167
- ci: Use trusted publisher in #168
- doc: Replace Ryver link in #169

# 1.1.1

- build: Update deps to latest version ([#129](https://github.com/IBM/nodejs-idb-pconnector/pull/129))
- ci: fix eslint action runner ([#130](https://github.com/IBM/nodejs-idb-pconnector/pull/130))
- ci: Update action to use Node.js 16
- ci: Ignore the package-lock.json during npm i
- ci: Update action to 'released' type ([#128](https://github.com/IBM/nodejs-idb-pconnector/pull/128))
- ci: Add eslint action ([#108](https://github.com/IBM/nodejs-idb-pconnector/pull/108))

# 1.1.0

- feat: Add support for enableNumericTypeConversion on DBPool functions ([#97](https://github.com/IBM/nodejs-idb-pconnector/pull/97))

- feat: Add support for bindParameters ([#92](https://github.com/IBM/nodejs-idb-pconnector/pull/92))
   - bindParameters() deprecates bindParam() and bind()

- refactor: Statement tests ([#78](https://github.com/IBM/nodejs-idb-pconnector/pull/78))
  - No longer use deprecated Statement with implicitly connection
  - No longer use QIWS.QCUSTCDT from insert tests
  - Add after/afterEach hooks to delete data inserted by test cases
  - Close out open statement and connection handles in each test

- docs: Add select bindParam example ([#101](https://github.com/IBM/nodejs-idb-pconnector/pull/101))

- fix: Add package-lock.json ([#86](https://github.com/IBM/nodejs-idb-pconnector/pull/86))

- refactor: Deprecate implicitly creating a connection

- docs: for enableNumericTypeConversion() ([#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54))

- test: for enableNumericTypeConversion() ([#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54))

- feat(statement.js): enableNumericTypeConversion() ([#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54))

- docs: Add badges ([e74e7db](https://github.com/IBM/nodejs-idb-pconnector/commit/e74e7dbdc5cb0e912c1475ba947c362617f18eb3))

# 1.0.8

- Allow `SQL_SUCCESS_WITH_INFO` return code to resolve the row in `fetch()` see PR [#47](https://github.com/IBM/nodejs-idb-pconnector/pull/47)

- Update deps see PR [#49](https://github.com/IBM/nodejs-idb-pconnector/pull/49)

- Patch `prepareExecute` only throw error if `value` is undefined see PR [#50](https://github.com/IBM/nodejs-idb-pconnector/pull/50)

# 1.0.7
Fix up setLibraryList example require statement see [03ce835](https://github.com/IBM/nodejs-idb-pconnector/commit/03ce835095551f660b64cac84d8f8cf8c8bc4ba9)

# 1.0.6
Add implementation of setLibraryList API see PR [#39](https://github.com/IBM/nodejs-idb-pconnector/pull/39)

# 1.0.5
Patched `prepareExecute` issue outlined in [#40](https://github.com/IBM/nodejs-idb-pconnector/issues/40)

- do not throw error when passing an object within the params array with value of null

# 1.0.4
Patched require issue outlined in issue #32 (#33)

- do not delete dbstmt and dbconn from idb-connector returned require object
- rather delete properties from module.exports object

# 1.0.3
- migrate repository over to https://github.com/IBM/nodejs-idb-pconnector
- update links to point to new repository
- refactor code base to now use airbnb style guide
