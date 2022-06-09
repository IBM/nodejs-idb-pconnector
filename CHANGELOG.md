# idb-pconnector change log

# 1.1.0
- build: Update deps for security ([#119](https://github.com/IBM/nodejs-idb-pconnector/pull/119))

  - Ran npm audit fix

  Performed the following manual fixes:
    - Updated eslint version with:
      npm install --save-dev eslint@8.8.0

    - Updated mocha with:
      npm install --save-dev mocha@9.2.0

    - Updated wide-align with:
      npm update wide-align --depth 5

- build: Add standard-version ([#90](https://github.com/IBM/nodejs-idb-pconnector/pull/90))

- feat: Add support for bindParameters ([#92](https://github.com/IBM/nodejs-idb-pconnector/pull/92))

   - bindParameters() deprecates bindParam() and bind()

- refactor: Statement tests ([#78](https://github.com/IBM/nodejs-idb-pconnector/pull/78))

  - No longer use deprecated Statement with implicitly connection
  - No longer use QIWS.QCUSTCDT from insert tests
  - Add after/afterEach hooks to delete data inserted by test cases
  - Close out open statement and connection handles in each test

- docs: Add select bindParam example ([#101](https://github.com/IBM/nodejs-idb-pconnector/pull/101))

Signed-off-by: Jhonny <jhonnattanriverarivera@gmail.com>

- fix: Make exempt labels plural for stale action ([#100](https://github.com/IBM/nodejs-idb-pconnector/pull/100))

These labels are plural since v2 to support multiple exempt labels, but
this broke the current setup as the old singular exempt options are no
longer accepted.

- chore: Unmark as stale if issue has been updated ([#99](https://github.com/IBM/nodejs-idb-pconnector/pull/99))

- Bump lodash from 4.17.15 to 4.17.19 (#95)

  Bumps [lodash](https://github.com/lodash/lodash) from 4.17.15 to 4.17.19.
  - [Release notes](https://github.com/lodash/lodash/releases)
  - [Commits](lodash/lodash@4.17.15...4.17.19)

  Signed-off-by: dependabot[bot] <support@github.com>

  Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>

-  ci: Add exempt-pr-label to stale action ([#94](https://github.com/IBM/nodejs-idb-pconnector/pull/94))

-  fix: Add package-lock.json ([#86](https://github.com/IBM/nodejs-idb-pconnector/pull/86))

- revert: "feat: DBPool now emits 'new connection' event ([#76](https://github.com/IBM/nodejs-idb-pconnector/pull/76))" ([#88](https://github.com/IBM/nodejs-idb-pconnector/pull/88))

  This reverts commit 6d9c193.

- feat: DBPool now emits 'new connection' event ([#76](https://github.com/IBM/nodejs-idb-pconnector/pull/76))

- ci: Add npm publish action ([#79](https://github.com/IBM/nodejs-idb-pconnector/pull/79))

- ci: Add exempt issue label
  - This will prevent our stale action from closing issues with the
    keep-open label.

- build: Update version to 1.1.0

- refactor: Deprecate implicitly creating a connection

- docs: for enableNumericTypeConversion() [#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54)

  Co-Authored-By: Kevin Adler <kadler@us.ibm.com>

- test: for enableNumericTypeConversion() [#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54)

-  feat(statement.js): enableNumericTypeConversion() [#54](https://github.com/IBM/nodejs-idb-pconnector/issues/54)

- docs: Add badges

-  ci: Add workflow to mark stale issues and PRs [#59](https://github.com/IBM/nodejs-idb-pconnector/issues/59) ([#64](https://github.com/IBM/nodejs-idb-pconnector/pull/64))

-  ci: Add PR title linter following conventional commits [#58](https://github.com/IBM/nodejs-idb-pconnector/issues/58)

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
